import {AfterViewInit, Component, Input, ViewChild} from "@angular/core"
import {EVENT_CANVAS_CLICK, EVENT_TAP, RowLayout, Surface, uuid, Node, EmptyLayout} from "@jsplumbtoolkit/browser-ui"
import {
  AngularRenderOptions,
  BrowserUIAngular,
  DEFAULT_ANGULAR_SURFACE_ID,
  SurfaceComponent
} from "@jsplumbtoolkit/browser-ui-angular"
import {ItemComponent} from "./item.component"
import {ColumnComponent} from "./column.component"
import {DragManager} from "./drag-manager"

@Component({
  selector:`jtk-kanban`,
  template:`
    <div class="jtk-kanban-container">
      <jsplumb-surface [surfaceId]="kanbanId"
                       [toolkitId]="kanbanId"
                       [view]="view"
                       [renderParams]="renderParams">
  
      </jsplumb-surface>
    </div>
    <div class="jtk-kanban-rhs">
      <div id="controls">
        <input type="text" id="txtAddColumn" placeholder="Add column..." (keypress)="addColumn($event)">
      </div>
      <!-- node/group inspector -->
      <app-inspector [surfaceId]="kanbanId"/>  
    </div>`
})
export class KanbanComponent implements AfterViewInit {

  @Input() kanbanId:string = DEFAULT_ANGULAR_SURFACE_ID

  @ViewChild(SurfaceComponent) surfaceComponent!:SurfaceComponent;
  toolkit!:BrowserUIAngular
  surface!:Surface

  renderParams:AngularRenderOptions = {
    layout:{
      type:RowLayout.type,
      options:{
        padding:{x:10, y:0}
      }
    },
    dragOptions:{
      filter:"*"
    },
    wheel:{
      zoom:false
    },
    events:{
      [EVENT_CANVAS_CLICK]:() => this.toolkit.clearSelection()
    },
  }

  view = {
    nodes: {
      default: {
        component:ItemComponent,
        events:{
          [EVENT_TAP]:(p:{obj:Node}) => {
            this.toolkit.setSelection(p.obj)
          }
        }
      }
    },
    groups: {
      default: {
        component:ColumnComponent,
        layout:{
          type:EmptyLayout.type
        },
        events:{
          [EVENT_TAP]:(p:any) => {
            this.toolkit.clearSelection()
          }
        }

      }
    }
  }

  ngAfterViewInit(): void {
    this.toolkit = this.surfaceComponent.surface.toolkitInstance
    this.surface = this.surfaceComponent.surface

    new DragManager(this.surface)

    this.toolkit.load({
      url:'/assets/dataset.json'
    })
  }

  addColumn(event:KeyboardEvent) {
    const target = event.target as HTMLInputElement
    if (event.keyCode === 13) {
      const column = this.toolkit.addGroup({
        id:uuid(),
        title:target.value,
        description:"",
        color:"#FFFFFF"
      })
      target.value = ""
      const el = this.surface.getRenderedElement(column)
      el.scrollIntoView()
    }
  }

}
