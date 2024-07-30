import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"

@Component({
  template:`<div class="jtk-kanban-item" draggable="true">
    <div class="jtk-kanban-item-delete" (click)="deleteItem()"></div>
    {{obj.name}}
</div>`
})
export class ItemComponent extends BaseNodeComponent {

  deleteItem() {
    this.removeNode()
  }
}
