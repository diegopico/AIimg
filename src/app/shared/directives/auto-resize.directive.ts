import { Directive, HostListener, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
  selector: 'textarea[autoResize]'
})
export class AutoResizeDirective implements AfterViewInit {
  
  constructor(private elementRef: ElementRef) {}
  
  ngAfterViewInit() {
    this.adjustTextAreaHeight(this.elementRef.nativeElement);
  }
  
  @HostListener('input')
  onInput() {
    this.adjustTextAreaHeight(this.elementRef.nativeElement);
  }
  
  private adjustTextAreaHeight(textArea: HTMLTextAreaElement): void {
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }
}
