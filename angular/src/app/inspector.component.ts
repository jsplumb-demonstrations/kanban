import {Component} from "@angular/core"
import {InspectorComponent} from "@jsplumbtoolkit/browser-ui-angular"
import { Node, Group } from "@jsplumbtoolkit/browser-ui"

@Component({
    template:`<div class="inspector">
      
      @if(currentObjectType === NODE) {
        <div class="jtk-kanban-inspector">
            <strong>Label</strong>
            <input jtk-att="name" type="text">
            <strong>Description</strong>
          <textarea jtk-att="description" rows="10"></textarea>
        </div>
      }  

      @if(currentObjectType === GROUP) {
        <div class="jtk-kanban-inspector">
          <strong>Title</strong>
          <input jtk-att="title" type="text">
          <strong>Description</strong>
          <textarea jtk-att="description" rows="10"></textarea>
          <strong>Color</strong>
          <input type="color" jtk-att="color">
  
        </div>
      }  
      
    </div>`,
    selector:"app-inspector"
})
export class KanbanInspectorComponent extends InspectorComponent {
  NODE = Node.objectType
  GROUP = Group.objectType
}
