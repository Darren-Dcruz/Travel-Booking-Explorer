import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightOffer]',
  standalone: true,
})
export class HighlightOfferDirective implements OnChanges {
  @Input() appHighlightOffer: 'top-rated' | 'promo' | '' = '';

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    const hostElement = this.elementRef.nativeElement;

    this.renderer.removeStyle(hostElement, 'box-shadow');
    this.renderer.removeStyle(hostElement, 'outline');

    if (this.appHighlightOffer === 'top-rated') {
      this.renderer.setStyle(hostElement, 'outline', '2px solid #009688');
      this.renderer.setStyle(hostElement, 'box-shadow', '0 10px 24px rgba(0, 150, 136, 0.24)');
    }

    if (this.appHighlightOffer === 'promo') {
      this.renderer.setStyle(hostElement, 'outline', '2px dashed #fb8c00');
      this.renderer.setStyle(hostElement, 'box-shadow', '0 10px 24px rgba(251, 140, 0, 0.24)');
    }
  }
}
