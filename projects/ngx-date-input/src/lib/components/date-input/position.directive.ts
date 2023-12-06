import {
  AfterViewInit,
  Directive,
  Input,
  Renderer2,
  inject,
} from '@angular/core';

import { ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[ngxDatePosition]',
})
export class PositionDirective implements AfterViewInit {
  #elementRef = inject(ElementRef);
  #renderer = inject(Renderer2);

  @Input() ngxDatePosition?: HTMLInputElement;

  ngAfterViewInit(): void {
    const rect = this.ngxDatePosition?.getBoundingClientRect();
    const height = (
      this.#elementRef.nativeElement as HTMLDivElement
    ).getBoundingClientRect().height;

    const top = (rect?.top || 0) + (rect?.height || 0) + 2;
    const enough = window.innerHeight - top > height;
    const left = rect?.left;

    let topPosition;

    if (enough) {
      topPosition = top;
    } else {
      if (window.innerHeight > height) {
        topPosition = (rect?.top || 0) + window.scrollY - height;
      } else {
        topPosition = window.innerHeight - height / 2;
      }
    }

    this.#renderer.setStyle(
      this.#elementRef.nativeElement,
      'top',
      `${topPosition}px`
    );
    this.#renderer.setStyle(
      this.#elementRef.nativeElement,
      'left',
      `${left}px`
    );
  }
}
