import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTypewriter]',
  standalone: true
})
export class Typewriter implements OnInit, OnDestroy {
  @Input('appTypewriter') typeSpeed: number | string = 30;
  private observer: IntersectionObserver | null = null;
  private timeoutId: any;
  private originalHTML: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.originalHTML = this.el.nativeElement.innerHTML.trim();
    // hide content initially to prevent flash of text
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', '&nbsp;');

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.typeOut();
        this.observer?.disconnect();
      }
    }, { threshold: 0.1 });

    this.observer.observe(this.el.nativeElement);
  }

  private typeOut() {
    let currentIdx = 0;
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', '');
    const speed = typeof this.typeSpeed === 'string' ? parseInt(this.typeSpeed, 10) : this.typeSpeed;

    const typeChar = () => {
      if (currentIdx < this.originalHTML.length) {
        // Fast-forward through HTML tags (e.g. <br>)
        if (this.originalHTML[currentIdx] === '<') {
          let closingIdx = this.originalHTML.indexOf('>', currentIdx);
          if (closingIdx !== -1) {
            currentIdx = closingIdx + 1;
            this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.originalHTML.substring(0, currentIdx) + '<span class="cursor">|</span>');
            this.timeoutId = setTimeout(typeChar, speed);
            return;
          }
        }

        currentIdx++;
        // Maintain a blinking cursor effect while typing
        this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.originalHTML.substring(0, currentIdx) + '<span class="cursor">|</span>');

        // Slight randomization for human-like typing feel
        const randomDelay = speed + (Math.random() * 20 - 10);
        this.timeoutId = setTimeout(typeChar, Math.max(10, randomDelay));
      } else {
        // Typing fully completed
        this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.originalHTML);
      }
    };

    typeChar();
  }

  ngOnDestroy() {
    if (this.observer) this.observer.disconnect();
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}

