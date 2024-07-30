import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input} from "@angular/core"
import {jsPlumbService} from "@jsplumbtoolkit/browser-ui-angular"
import {Base, Inspector, Edge} from "@jsplumbtoolkit/browser-ui"

@Component({
    template:`<div class="inspector">
        
        <div *ngIf="currentType === ''"></div>

        <div *ngIf="currentType === 'Node'"  class="jtk-kanban-inspector">
            <strong>Label</strong>
            <input jtk-att="name" type="text">
            <strong>Description</strong>
          <textarea jtk-att="description" rows="10"></textarea>
        </div>

      <div  *ngIf="currentType === 'Group'" class="jtk-kanban-inspector">
        <strong>Title</strong>
        <input jtk-att="title" type="text">
        <strong>Description</strong>
        <textarea jtk-att="description" rows="10"></textarea>
        <strong>Color</strong>
        <input type="color" jtk-att="color">

      </div>
      
    </div>`,
    selector:"app-inspector"
})
export class InspectorComponent implements AfterViewInit {

    currentType:string = ''

    @Input() surfaceId!:string

    inspector!:Inspector

    constructor(private $jsplumb:jsPlumbService, private el:ElementRef, private changeDetector:ChangeDetectorRef) { }

    ngAfterViewInit(): void {

        this.$jsplumb.getSurface(this.surfaceId, (surface) => {
            this.inspector = new Inspector({
                container:this.el.nativeElement,
                surface,
                renderEmptyContainer:() => {
                    this.currentType = ''
                },
                refresh:(obj:Base, cb:() => void) => {
                    this.currentType = obj.objectType
                    setTimeout(cb, 0)
                    this.changeDetector.detectChanges()
                }
            })
        })
    }



}
