import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface LandingImpact {
  xPercent: number;
  radius: number;
}

@Injectable({
  providedIn: 'root'
})
export class WinterModeService {
  private readonly STORAGE_KEY = 'portfolio_winter_mode';
  private isBrowser: boolean;

  readonly isWinterMode = signal<boolean>(false);

  // Heightmap bins for footer snow accumulation (shared)
  readonly BIN_COUNT = 320;
  readonly accumulation = new Float32Array(320);
  readonly DEFAULT_LAYER_HEIGHT = 6; // Very small delicate default baseline layer in px
  readonly MAX_ACCUMULATION = 52;   // Max realistic drift height in px

  private impactListeners: ((impact: LandingImpact) => void)[] = [];

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved !== null) {
        const isActive = saved === 'true';
        this.isWinterMode.set(isActive);
        this.applyThemeAttribute(isActive);
        if (isActive) {
          this.initDefaultLayer();
        }
      }
    }
  }

  toggle(): void {
    const nextState = !this.isWinterMode();
    this.setWinterMode(nextState);
  }

  setWinterMode(enabled: boolean): void {
    this.isWinterMode.set(enabled);
    if (enabled) {
      if (this.isAccumulationEmpty()) {
        this.initDefaultLayer();
      }
    }
    if (this.isBrowser) {
      try {
        localStorage.setItem(this.STORAGE_KEY, String(enabled));
      } catch (e) {}
      this.applyThemeAttribute(enabled);
    }
  }

  /**
   * Initialize a very small, natural baseline layer (approx 5px - 7px)
   * so there is a delicate dusting of snow along the footer edge by default.
   */
  initDefaultLayer(): void {
    for (let i = 0; i < this.BIN_COUNT; i++) {
      const micro1 = Math.sin(i * 0.08) * 1.0;
      const micro2 = Math.cos(i * 0.15) * 0.6;
      this.accumulation[i] = 5.5 + micro1 + micro2;
    }
  }

  isAccumulationEmpty(): boolean {
    for (let i = 0; i < this.BIN_COUNT; i++) {
      if (this.accumulation[i] > 1.0) return false;
    }
    return true;
  }

  /**
   * Called strictly when a real falling snowflake lands at the footer edge.
   * Conservation of Mass: Volume deposited directly corresponds to the fallen flake.
   */
  recordFlakeLanded(xPercent: number, radius: number): void {
    if (!this.isWinterMode()) return;

    const clampedX = Math.max(0, Math.min(1, xPercent));
    const bin = Math.min(Math.floor(clampedX * this.BIN_COUNT), this.BIN_COUNT - 1);
    const deposit = radius * 0.9;

    if (this.accumulation[bin] < this.MAX_ACCUMULATION) {
      this.accumulation[bin] += deposit * 0.55;
      if (bin > 0) this.accumulation[bin - 1] += deposit * 0.225;
      if (bin < this.BIN_COUNT - 1) this.accumulation[bin + 1] += deposit * 0.225;
    }

    // Natural gentle powder diffusion to adjacent columns
    for (let i = Math.max(1, bin - 2); i <= Math.min(this.BIN_COUNT - 2, bin + 2); i++) {
      const diff = (this.accumulation[i - 1] + this.accumulation[i + 1]) / 2 - this.accumulation[i];
      if (Math.abs(diff) > 0.5) {
        this.accumulation[i] += diff * 0.08;
      }
    }

    // Notify listeners for landing crystal sparkles
    for (const listener of this.impactListeners) {
      listener({ xPercent: clampedX, radius });
    }
  }

  onImpact(callback: (impact: LandingImpact) => void): () => void {
    this.impactListeners.push(callback);
    return () => {
      this.impactListeners = this.impactListeners.filter(l => l !== callback);
    };
  }

  private applyThemeAttribute(enabled: boolean): void {
    if (!this.isBrowser) return;
    if (enabled) {
      document.documentElement.setAttribute('data-theme-winter', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme-winter');
    }
  }
}
