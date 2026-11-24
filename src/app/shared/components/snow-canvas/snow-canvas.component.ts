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
import { WinterModeService } from '../../../core/services/winter-mode.service';

interface Snowflake {
  x: number;
  y: number;
  vx: number;
  radius: number;
  speedY: number;
  swaySpeed: number;
  swayAmp: number;
  swayAngle: number;
  alpha: number;
  layer: number; // 0: background (true 3D depth), 1: midground, 2: foreground
}

/** Micro-powder dust specks that scatter upon physical impact */
interface ImpactParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  colorPrefix: string;
}

/** 4-point crystalline diamond glint at impact point */
interface ImpactGlint {
  x: number;
  y: number;
  size: number;
  maxSize: number;
  alpha: number;
  decay: number;
  rotation: number;
}

/** Subtle frosted kinetic shockwave ring */
interface ImpactRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
}

interface StuckFlake {
  element: HTMLElement;
  relX: number;
  relY: number;
  radius: number;
  alpha: number;
}

interface AvatarObstacle {
  element: HTMLElement;
  rect: DOMRect;
}

interface CardObstacle {
  element: HTMLElement;
  left: number;
  right: number;
  top: number;
}

@Component({
  selector: 'app-snow-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #canvas class="snow-canvas" aria-hidden="true"></canvas>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 90;
      overflow: hidden;
    }
    .snow-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  `]
})
export class SnowCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private isBrowser: boolean;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;

  // Viewport dimensions
  private width = 0;
  private height = 0;
  private dpr = 1;

  // Falling snow particles
  private flakes: Snowflake[] = [];
  private readonly TOTAL_FLAKES = 85;

  // Pixel-Perfect Avatar Alpha-Mask Silhouette (No more hitting invisible air!)
  private readonly MASK_RES = 160; // 160 discrete columns across avatar
  private avatarSurfaceY: Float32Array | null = null;
  private isMaskGenerating = false;

  // Physical Obstacle & Collision Animation Systems
  private avatarObstacle: AvatarObstacle | null = null;
  private cardObstacles: CardObstacle[] = [];
  private stuckFlakes: StuckFlake[] = [];
  private impactParticles: ImpactParticle[] = [];
  private impactGlints: ImpactGlint[] = [];
  private impactRings: ImpactRing[] = [];
  private obstacleCheckCounter = 0;

  // Natural ambient wind & mouse sway
  private wind = 0;
  private targetWind = 0;
  private lastTime = 0;
  private mouseX = -1000;
  private mouseY = -1000;
  private mousePrevX = -1000;
  private mouseSpeedX = 0;

  // Fading transition state
  private isFading = false;
  private globalAlpha = 0;

  // Listeners
  private resizeListener = () => this.handleResize();
  private scrollListener = () => this.updateObstacles();
  private mouseMoveListener = (e: MouseEvent) => this.handleMouseMove(e);

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private ngZone: NgZone,
    public winterService: WinterModeService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Watch winter mode signal reactively
    effect(() => {
      const active = this.winterService.isWinterMode();
      if (!this.isBrowser) return;

      if (active) {
        this.isFading = false;
        this.updateObstacles();
        this.startLoop();
      } else {
        this.isFading = true;
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.initCanvasSize();
    this.initFlakes();
    this.updateObstacles();

    if (this.winterService.isWinterMode()) {
      this.startLoop();
    }

    window.addEventListener('resize', this.resizeListener, { passive: true });
    window.addEventListener('scroll', this.scrollListener, { passive: true });
    window.addEventListener('mousemove', this.mouseMoveListener, { passive: true });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    this.stopLoop();
    window.removeEventListener('resize', this.resizeListener);
    window.removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('mousemove', this.mouseMoveListener);
  }

  private initCanvasSize(): void {
    if (!this.canvasRef || !this.ctx) return;
    const canvas = this.canvasRef.nativeElement;

    this.width = document.documentElement.clientWidth || window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(this.width * this.dpr);
    canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private handleResize(): void {
    this.initCanvasSize();
    this.updateObstacles();
  }

  private handleMouseMove(e: MouseEvent): void {
    if (this.mouseX !== -1000) {
      this.mouseSpeedX = (e.clientX - this.mousePrevX) * 0.05;
    }
    this.mousePrevX = this.mouseX;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  /**
   * Deep pixel-perfect alpha-mask extraction from the actual 3D avatar image.
   * Scans down every vertical column to find the exact pixel where hair/skin begins.
   * Guaranteed zero collision with transparent empty air!
   */
  private generateAvatarAlphaMask(imgEl: HTMLImageElement): void {
    if (this.avatarSurfaceY || this.isMaskGenerating) return;
    this.isMaskGenerating = true;

    try {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = this.MASK_RES;
      offCanvas.height = this.MASK_RES;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.clearRect(0, 0, this.MASK_RES, this.MASK_RES);
      offCtx.drawImage(imgEl, 0, 0, this.MASK_RES, this.MASK_RES);

      const imgData = offCtx.getImageData(0, 0, this.MASK_RES, this.MASK_RES).data;
      const surface = new Float32Array(this.MASK_RES);

      for (let x = 0; x < this.MASK_RES; x++) {
        let foundY = -1;
        for (let y = 0; y < this.MASK_RES; y++) {
          const alphaIndex = (y * this.MASK_RES + x) * 4 + 3;
          // Threshold of 45/255 ensures we only collide with solid hair, skin, and clothing
          if (imgData[alphaIndex] > 45) {
            foundY = y / this.MASK_RES;
            break;
          }
        }
        surface[x] = foundY;
      }

      this.avatarSurfaceY = surface;
    } catch (e) {
      console.warn('Avatar alpha mask extraction skipped:', e);
    } finally {
      this.isMaskGenerating = false;
    }
  }

  /**
   * Scan DOM for physical obstacles (Hero Avatar and Cards) to react with snow
   */
  private updateObstacles(): void {
    if (!this.isBrowser) return;

    // 1. Scan Hero Avatar (3D Portrait of Gitesh)
    const avatarEl = document.querySelector('.hero-avatar-img') as HTMLImageElement | null;

    if (avatarEl) {
      const rect = avatarEl.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < this.height) {
        this.avatarObstacle = {
          element: avatarEl,
          rect
        };

        // Extract alpha-mask if not already done
        if (!this.avatarSurfaceY) {
          if (avatarEl.complete && avatarEl.naturalWidth > 0) {
            this.generateAvatarAlphaMask(avatarEl);
          } else {
            avatarEl.addEventListener('load', () => this.generateAvatarAlphaMask(avatarEl), { once: true });
          }
        }
      } else {
        this.avatarObstacle = null;
      }
    } else {
      this.avatarObstacle = null;
    }

    // 2. Scan Visible Cards (Projects, Services, Social Pills)
    const cardElements = document.querySelectorAll(
      '.project-card, .service-card, .social-pill'
    );
    this.cardObstacles = [];

    cardElements.forEach(el => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < this.height + 20) {
        this.cardObstacles.push({
          element: el as HTMLElement,
          left: rect.left,
          right: rect.right,
          top: rect.top
        });
      }
    });
  }

  private initFlakes(): void {
    this.flakes = [];
    for (let i = 0; i < this.TOTAL_FLAKES; i++) {
      this.flakes.push(this.createFlake(Math.random() * this.height));
    }
  }

  private createFlake(customY?: number): Snowflake {
    const rand = Math.random();
    let layer = 1;
    let radius = 1.8;
    let speedY = 1.1;
    let alpha = 0.65;

    if (rand < 0.35) {
      // Background (passes behind obstacles, providing true 3D depth)
      layer = 0;
      radius = 0.9 + Math.random() * 0.6;
      speedY = 0.5 + Math.random() * 0.4;
      alpha = 0.25 + Math.random() * 0.2;
    } else if (rand < 0.8) {
      // Midground (reacts with physical obstacles)
      layer = 1;
      radius = 1.6 + Math.random() * 0.9;
      speedY = 1.0 + Math.random() * 0.55;
      alpha = 0.55 + Math.random() * 0.25;
    } else {
      // Foreground (closer, crisp, interactive)
      layer = 2;
      radius = 2.6 + Math.random() * 1.2;
      speedY = 1.5 + Math.random() * 0.7;
      alpha = 0.75 + Math.random() * 0.2;
    }

    return {
      x: Math.random() * this.width,
      y: customY !== undefined ? customY : -10 - Math.random() * 20,
      vx: 0,
      radius,
      speedY,
      swaySpeed: 0.015 + Math.random() * 0.02,
      swayAmp: 0.4 + Math.random() * 0.9,
      swayAngle: Math.random() * Math.PI * 2,
      alpha,
      layer
    };
  }

  /**
   * Trigger a realistic physical snow impact:
   * 1. 3-5 micro-powder specks burst outward along the impact surface normal
   * 2. An authentic 4-point crystalline prism diamond glint
   * 3. A delicate kinetic shockwave ring
   */
  private triggerImpact(x: number, y: number, normalX: number, normalY: number, intensity: number): void {
    if (this.impactParticles.length > 40) return;

    // 1. Kinetic shockwave ring
    this.impactRings.push({
      x,
      y,
      radius: 1.2,
      maxRadius: 3.5 + intensity * 2.0,
      alpha: 0.75,
      decay: 0.055
    });

    // 2. Crystalline diamond star glint
    this.impactGlints.push({
      x,
      y,
      size: 1.0,
      maxSize: 3.2 + intensity * 1.5,
      alpha: 0.95,
      decay: 0.075,
      rotation: Math.random() * Math.PI
    });

    // 3. 3 to 5 micro-powder specks bursting outward
    const speckCount = 3 + Math.floor(Math.random() * 3);
    const baseAngle = Math.atan2(normalY, normalX);

    for (let i = 0; i < speckCount; i++) {
      const spread = (Math.random() - 0.5) * 1.8;
      const angle = baseAngle + spread;
      const speed = (0.7 + Math.random() * 1.6) * (0.8 + intensity * 0.4);

      this.impactParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 0.6 + Math.random() * 0.8,
        alpha: 0.85,
        decay: 0.045 + Math.random() * 0.025,
        colorPrefix: Math.random() < 0.4 ? 'rgba(215, 240, 255,' : 'rgba(255, 255, 255,'
      });
    }
  }

  private addStuckFlake(element: HTMLElement, absX: number, absY: number, radius: number): void {
    if (this.stuckFlakes.length >= 20) {
      this.stuckFlakes.shift();
    }
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    this.stuckFlakes.push({
      element,
      relX: (absX - rect.left) / rect.width,
      relY: (absY - rect.top) / rect.height,
      radius: Math.max(1.0, radius * 0.85),
      alpha: 0.9
    });
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

        if (this.isFading && this.globalAlpha <= 0.01) {
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

  private update(delta: number): void {
    if (this.isFading) {
      this.globalAlpha = Math.max(0, this.globalAlpha - delta * 1.5);
    } else {
      this.globalAlpha = Math.min(1, this.globalAlpha + delta * 2.0);
    }

    // Refresh obstacle bounds every 30 frames (~0.5s fallback)
    this.obstacleCheckCounter++;
    if (this.obstacleCheckCounter > 30) {
      this.obstacleCheckCounter = 0;
      this.updateObstacles();
    }

    this.targetWind = Math.sin(this.lastTime * 0.0008) * 0.4 + this.mouseSpeedX * 0.25;
    this.wind += (this.targetWind - this.wind) * 0.05;
    this.mouseSpeedX *= 0.9;

    // 1. Update falling snowflakes & collisions with physical obstacles
    for (let i = 0; i < this.flakes.length; i++) {
      const f = this.flakes[i];

      f.swayAngle += f.swaySpeed;
      const targetVx = Math.sin(f.swayAngle) * f.swayAmp + this.wind;
      f.vx += (targetVx - f.vx) * 0.1;
      f.x += f.vx;
      f.y += f.speedY;

      if (f.x < -10) f.x = this.width + 10;
      else if (f.x > this.width + 10) f.x = -10;

      // Obstacle collision checks (layers 1 & 2 only; layer 0 background flakes pass behind)
      if (f.layer > 0 && !this.isFading) {
        // A. Pixel-Perfect Silhouette Collision with Hero 3D Portrait
        if (this.avatarObstacle && this.avatarSurfaceY) {
          const rect = this.avatarObstacle.rect;

          if (f.x >= rect.left && f.x <= rect.right) {
            const normX = (f.x - rect.left) / rect.width;
            const bin = Math.min(Math.max(0, Math.floor(normX * this.MASK_RES)), this.MASK_RES - 1);
            const surfaceRatio = this.avatarSurfaceY[bin];

            // Only collide if this vertical column actually contains hair/skin/clothing!
            if (surfaceRatio >= 0) {
              const surfaceY = rect.top + surfaceRatio * rect.height;

              // Flake is precisely touching the hair/skin/shoulder surface
              if (f.y + f.radius >= surfaceY && f.y - f.radius <= surfaceY + 6) {
                // Compute true physical surface normal from neighboring silhouette pixels
                const prevBin = Math.max(0, bin - 1);
                const nextBin = Math.min(this.MASK_RES - 1, bin + 1);
                const prevY = this.avatarSurfaceY[prevBin] >= 0 ? this.avatarSurfaceY[prevBin] : surfaceRatio;
                const nextY = this.avatarSurfaceY[nextBin] >= 0 ? this.avatarSurfaceY[nextBin] : surfaceRatio;

                const dxPx = (2 / this.MASK_RES) * rect.width;
                const dyPx = (nextY - prevY) * rect.height;
                const tangentLen = Math.hypot(dxPx, dyPx) || 1;

                // Outward-pointing surface normal
                const nx = -dyPx / tangentLen;
                const ny = -dxPx / tangentLen;

                // Snap flake directly to the body surface
                f.y = surfaceY - f.radius;

                const chance = Math.random();
                if (chance < 0.45) {
                  // Deflect along the true curvature of the hair/shoulder
                  f.vx = nx * (1.8 + Math.random() * 0.8);
                  f.speedY = Math.max(0.3, f.speedY * 0.5);
                  this.triggerImpact(f.x, surfaceY, nx, ny, 0.5);
                } else if (chance < 0.75) {
                  // Melt on contact with body/hair with micro-burst & glint
                  this.triggerImpact(f.x, surfaceY, nx, ny, 1.0);
                  this.flakes[i] = this.createFlake();
                  continue;
                } else {
                  // Settle directly on the hair/skin/shoulder
                  this.triggerImpact(f.x, surfaceY, nx, ny, 0.7);
                  this.addStuckFlake(this.avatarObstacle.element, f.x, surfaceY, f.radius);
                  this.flakes[i] = this.createFlake();
                  continue;
                }
              }
            }
          }
        }

        // B. Collision with Card Top Ledges (Accurately accounting for rounded corners)
        for (const card of this.cardObstacles) {
          if (f.x >= card.left && f.x <= card.right) {
            const cornerRadius = 16;
            let topY = card.top;

            if (f.x < card.left + cornerRadius) {
              const dx = card.left + cornerRadius - f.x;
              topY = card.top + (cornerRadius - Math.sqrt(Math.max(0, cornerRadius * cornerRadius - dx * dx)));
            } else if (f.x > card.right - cornerRadius) {
              const dx = f.x - (card.right - cornerRadius);
              topY = card.top + (cornerRadius - Math.sqrt(Math.max(0, cornerRadius * cornerRadius - dx * dx)));
            }

            if (f.y + f.radius >= topY && f.y - f.radius <= topY + 4) {
              f.y = topY - f.radius;
              const roll = Math.random();

              if (roll < 0.45) {
                f.speedY = 0.4;
                f.vx += (Math.random() - 0.5) * 1.5;
                this.triggerImpact(f.x, topY, 0, -1, 0.5);
              } else if (roll < 0.75) {
                this.triggerImpact(f.x, topY, 0, -1, 1.0);
                this.flakes[i] = this.createFlake();
                break;
              } else {
                this.triggerImpact(f.x, topY, 0, -1, 0.6);
                this.addStuckFlake(card.element, f.x, topY, f.radius);
                this.flakes[i] = this.createFlake();
                break;
              }
            }
          }
        }
      }

      // Reaching the bottom deposits into the footer accumulation storage
      if (f.y >= this.height) {
        if (!this.isFading) {
          this.winterService.recordFlakeLanded(f.x / this.width, f.radius);
        }
        this.flakes[i] = this.createFlake();
      }
    }

    // 2. Update micro-powder specks (drag & fade)
    for (let i = this.impactParticles.length - 1; i >= 0; i--) {
      const p = this.impactParticles[i];
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        this.impactParticles.splice(i, 1);
      }
    }

    // 3. Update crystalline star glints
    for (let i = this.impactGlints.length - 1; i >= 0; i--) {
      const g = this.impactGlints[i];
      g.size += (g.maxSize - g.size) * 0.2;
      g.alpha -= g.decay;
      if (g.alpha <= 0) {
        this.impactGlints.splice(i, 1);
      }
    }

    // 4. Update shockwave rings
    for (let i = this.impactRings.length - 1; i >= 0; i--) {
      const r = this.impactRings[i];
      r.radius += (r.maxRadius - r.radius) * 0.25;
      r.alpha -= r.decay;
      if (r.alpha <= 0) {
        this.impactRings.splice(i, 1);
      }
    }

    // 5. Update stuck flakes (gradually melt over 2 to 3 seconds)
    for (let i = this.stuckFlakes.length - 1; i >= 0; i--) {
      const sf = this.stuckFlakes[i];
      sf.alpha -= 0.005;
      if (sf.alpha <= 0) {
        this.stuckFlakes.splice(i, 1);
      }
    }
  }

  private draw(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.width, this.height);
    if (this.globalAlpha <= 0.001) return;

    ctx.save();
    ctx.globalAlpha = this.globalAlpha;

    // 1. Draw Falling Snowflakes
    for (const f of this.flakes) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`;
      ctx.fill();

      if (f.layer === 2) {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 4;
      }
    }
    ctx.shadowBlur = 0;

    // 2. Draw Stuck / Resting Snow on Hero & Cards (Moves in sync with scrolling!)
    for (const sf of this.stuckFlakes) {
      if (!sf.element || !sf.element.isConnected) continue;
      const rect = sf.element.getBoundingClientRect();
      const px = rect.left + sf.relX * rect.width;
      const py = rect.top + sf.relY * rect.height;

      ctx.beginPath();
      ctx.arc(px, py, sf.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${sf.alpha})`;
      ctx.shadowColor = 'rgba(220, 245, 255, 0.7)';
      ctx.shadowBlur = 3;
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // 3. Draw Kinetic Shockwave Rings
    for (const r of this.impactRings) {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(240, 250, 255, ${r.alpha * 0.6})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // 4. Draw Micro-Powder Dust Particles
    for (const p of this.impactParticles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.colorPrefix} ${p.alpha})`;
      ctx.fill();
    }

    // 5. Draw 4-Point Crystalline Diamond Glints
    for (const g of this.impactGlints) {
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.rotation);

      // Star cross rays
      ctx.beginPath();
      ctx.moveTo(-g.size, 0);
      ctx.lineTo(g.size, 0);
      ctx.moveTo(0, -g.size);
      ctx.lineTo(0, g.size);
      ctx.strokeStyle = `rgba(255, 255, 255, ${g.alpha})`;
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Soft bright center core
      ctx.beginPath();
      ctx.arc(0, 0, g.size * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${g.alpha})`;
      ctx.shadowColor = 'rgba(165, 231, 250, 0.9)';
      ctx.shadowBlur = 4;
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }
}
