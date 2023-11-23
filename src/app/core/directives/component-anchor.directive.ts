import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[mipoolsFrontEndComponentAnchor]',
  standalone: true,
})
export class ComponentAnchorDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
