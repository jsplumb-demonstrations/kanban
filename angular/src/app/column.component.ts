import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"
import { uuid, Group} from "@jsplumbtoolkit/browser-ui"

@Component({
  template:`<div class="jtk-kanban-lane">
                        <div class="jtk-kanban-lane-header">
                        
                        <div class="jtk-kanban-lane-titlebar">
                            <div class="jtk-kanban-lane-color" style="background-color: {{obj.color}}"></div>
                            <div class="jtk-kanban-lane-title">{{obj.title}}</div>
                            <div class="jtk-kanban-lane-edit" (click)="editColumn()"></div>
                        </div>
                        
                        <div class="jtk-kanban-lane-description">{{obj.description}}</div>
                        </div>
                        
                        <div data-jtk-group-content="true"></div>
                        <div class="jtk-kanban-lane-footer">
                            <input type="text" placeholder="Add item..." (keypress)="maybeAddItem($event)">
                        </div>
                    </div>
  `
})
export class ColumnComponent extends BaseNodeComponent{


  editColumn() {
    this.toolkit.setSelection(this.getNode())
  }

  maybeAddItem(event:KeyboardEvent) {
    if (event.keyCode === 13) {
      const target = event.target as HTMLInputElement
      const group = (this.getNode() as Group)
      const order = group.getMembers().length
      const node = this.toolkit.addNode({
        group:group.id,
        id:uuid(),
        order,
        name:target.value || "Item"
      })
      const el = this.surface.getRenderedElement(node)
      el.scrollIntoView()
      this.toolkit.setSelection(node)

      target.value = ""
    }
  }

}
