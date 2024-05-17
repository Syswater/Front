import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScrolldetector]'
})
export class ScrolldetectorDirective {

  @Output() finalScroll = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) { }

  @HostListener('scroll')
  onScroll() {
    const container = this.elementRef.nativeElement;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
      this.finalScroll.emit();
    }
  }

}
