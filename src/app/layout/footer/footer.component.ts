import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  NgZone,
  effect
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollAnimate } from '../../shared/directives/scroll-animate';
import { WinterModeService, LandingImpact } from '../../core/services/winter-mode.service';

interface Sparkle {
  x: number;
  y: number;
  alpha: number;
  decay: number;
  size: number;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, ScrollAnimate],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('footerSnowCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  currentYear = new Date().getFullYear();

  private isBrowser: boolean;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;

  private width = 0;
  private height = 75; // Canvas height in pixels at the footer edge
  private dpr = 1;

  // Impact sparkles at landing points
  private sparkles: Sparkle[] = [];
  private unsubscribeImpact: (() => void) | null = null;

  private lastTime = 0;
  private isMelting = false;

  private resizeListener = () => this.handleResize();

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private ngZone: NgZone,
    public winterService: WinterModeService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Reactively start or stop footer accumulation rendering
    effect(() => {
      const active = this.winterService.isWinterMode();
      if (!this.isBrowser) return;

      if (active) {
        this.isMelting = false;
        this.startLoop();
      } else {
        this.isMelting = true;
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.initCanvasSize();

    // Listen to snowflakes landing
    this.unsubscribeImpact = this.winterService.onImpact((impact: LandingImpact) => {
      if (!this.winterService.isWinterMode() || this.isMelting) return;
      const pxX = impact.xPercent * this.width;
      const bin = Math.min(Math.floor(impact.xPercent * this.winterService.BIN_COUNT), this.winterService.BIN_COUNT - 1);
      const snowHeight = this.winterService.accumulation[bin];
      const groundY = this.height - snowHeight;

      if (Math.random() < 0.4) {
        this.sparkles.push({
          x: pxX,
          y: groundY,
          alpha: 0.95,
          decay: 0.03 + Math.random() * 0.03,
          size: 1.2 + Math.random() * 1.4
        });
      }
    });

    if (this.winterService.isWinterMode()) {
      this.startLoop();
    }

    window.addEventListener('resize', this.resizeListener, { passive: true });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    this.stopLoop();
    if (this.unsubscribeImpact) {
      this.unsubscribeImpact();
    }
    window.removeEventListener('resize', this.resizeListener);
  }

  private initCanvasSize(): void {
    if (!this.canvasRef || !this.ctx) return;
    const canvas = this.canvasRef.nativeElement;

    this.width = canvas.parentElement ? canvas.parentElement.clientWidth : document.documentElement.clientWidth;
    this.height = 75;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(this.width * this.dpr);
    canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private handleResize(): void {
    this.initCanvasSize();
  }

  private startLoop(): void {
    if (this.animationFrameId !== null) return;

    this.lastTime = performance.now();
    this.ngZone.runOutsideAngular(() => {
      const render = (time: number) => {
        const delta = Math.min((time - this.lastTime) / 1000, 0.1);
        this.lastTime = time;

        this.update(delta);
        this.draw();

        // Check if loop should terminate when melted
        if (this.isMelting && this.isAccumulationMelted()) {
          this.stopLoop();
          if (this.ctx) {
            this.ctx.clearRect(0, 0, this.width, this.height);
          }
          return;
        }

        this.animationFrameId = requestAnimationFrame(render);
      };

      this.animationFrameId = requestAnimationFrame(render);
    });
  }

  private stopLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private isAccumulationMelted(): boolean {
    const acc = this.winterService.accumulation;
    for (let i = 0; i < acc.length; i++) {
      if (acc[i] > 0.3) return false;
    }
    return true;
  }

  private update(delta: number): void {
    if (this.isMelting) {
      const acc = this.winterService.accumulation;
      for (let i = 0; i < acc.length; i++) {
        if (acc[i] > 0) {
          acc[i] = Math.max(0, acc[i] - delta * 24);
        }
      }
    }

    // Update sparkles
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      s.alpha -= s.decay;
      if (s.alpha <= 0) {
        this.sparkles.splice(i, 1);
      }
    }
  }

  private draw(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.width, this.height);

    const acc = this.winterService.accumulation;
    const binCount = acc.length;

    let hasSnow = false;
    for (let i = 0; i < binCount; i++) {
      if (acc[i] > 0.4) {
        hasSnow = true;
        break;
      }
    }
    if (!hasSnow) return;

    const binWidth = this.width / (binCount - 1);

    // 1. Draw smooth curved snow bed using quadratic curves
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    ctx.lineTo(0, this.height - acc[0]);

    for (let i = 0; i < binCount - 1; i++) {
      const currentX = i * binWidth;
      const nextX = (i + 1) * binWidth;
      const midX = (currentX + nextX) / 2;
      const midY = this.height - (acc[i] + acc[i + 1]) / 2;
      ctx.quadraticCurveTo(currentX, this.height - acc[i], midX, midY);
    }

    ctx.lineTo(this.width, this.height - acc[binCount - 1]);
    ctx.lineTo(this.width, this.height);
    ctx.closePath();

    // Elegant, authentic frosted snow gradient adaptive to current height
    let currentMaxHeight = 6;
    for (let i = 0; i < binCount; i++) {
      if (acc[i] > currentMaxHeight) currentMaxHeight = acc[i];
    }
    const gradientTop = Math.max(0, this.height - Math.max(12, currentMaxHeight + 2));
    const snowGrad = ctx.createLinearGradient(0, gradientTop, 0, this.height);
    snowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
    snowGrad.addColorStop(0.35, 'rgba(242, 248, 253, 0.94)');
    snowGrad.addColorStop(0.7, 'rgba(215, 235, 248, 0.88)');
    snowGrad.addColorStop(1, 'rgba(180, 215, 235, 0.80)');

    ctx.fillStyle = snowGrad;
    ctx.fill();

    // Refined crisp top highlight contour
    ctx.beginPath();
    ctx.moveTo(0, this.height - acc[0]);
    for (let i = 0; i < binCount - 1; i++) {
      const currentX = i * binWidth;
      const nextX = (i + 1) * binWidth;
      const midX = (currentX + nextX) / 2;
      const midY = this.height - (acc[i] + acc[i + 1]) / 2;
      ctx.quadraticCurveTo(currentX, this.height - acc[i], midX, midY);
    }
    ctx.lineTo(this.width, this.height - acc[binCount - 1]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 2. Draw fresh impact sparkles
    for (const s of this.sparkles) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.shadowColor = 'rgba(165, 231, 250, 0.8)';
      ctx.shadowBlur = 5;
      ctx.fill();
    }

    ctx.restore();
  }
}
