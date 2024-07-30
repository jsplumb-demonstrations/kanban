import { ready, newInstance, EVENT_TAP, uuid, RowLayout, EVENT_CANVAS_CLICK} from "@jsplumbtoolkit/browser-ui"
import { DragManager } from './drag-manager'
import { KanbanInspector} from "./inspector";


    ready(() => {


        const view = {
            nodes: {
                default: {
                    template: `<div class="jtk-kanban-item" draggable="true">
                        <div class="jtk-kanban-item-delete"/>
                        {{name}}
                        </div>`,
                    events:{
                        [EVENT_TAP]:(p) => {
                            toolkit.setSelection(p.obj)
                        }
                    }
                }
            },
            groups: {
                default: {
                    template: `<div class="jtk-kanban-lane">
                        <div class="jtk-kanban-lane-header">
                        
                        <div class="jtk-kanban-lane-titlebar">
                            <div class="jtk-kanban-lane-color" style="background-color: {{color}}"></div>
                            <div class="jtk-kanban-lane-title">{{title}}</div>
                            <div class="jtk-kanban-lane-edit"></div>
                        </div>
                        
                        <div class="jtk-kanban-lane-description">{{description}}</div>
                        </div>
                        
                        <div data-jtk-group-content="true"/>
                        <div class="jtk-kanban-lane-footer">
                            <input type="text" placeholder="Add item..."/>
                        </div>
                    </div>`,
                    layout:{
                        type:"Empty"
                    },
                    events:{
                        [EVENT_TAP]:(p) => {
                            toolkit.clearSelection()
                        }
                    }

                }
            }
        };

        const toolkit = window.tk = newInstance()

        const canvasElement = document.querySelector(".jtk-kanban-container")

        const renderer = toolkit.render(canvasElement, {
            view: view,
            layout: {
                type: RowLayout.type,
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
                [EVENT_CANVAS_CLICK]:() => toolkit.clearSelection()
            },
            consumeRightClick: false,
            modelEvents:[
                {
                    selector:".jtk-kanban-lane-footer input",
                    event:"keypress",
                    callback:(event, eventTarget, modelObject) => {
                        if (event.keyCode === 13) {

                            const order = modelObject.obj.getMembers().length
                            const node = toolkit.addNode({
                                group:modelObject.id,
                                id:uuid(),
                                order,
                                name:eventTarget.value || "Item"
                            })
                            const el = renderer.getRenderedElement(node)
                            el.scrollIntoView()
                            toolkit.setSelection(node)

                            eventTarget.value = ""

                        }

                    }
                },
                {
                    selector:".jtk-kanban-lane-edit",
                    event:EVENT_TAP,
                    callback:(event, eventTarget, modelObject) => {
                        toolkit.setSelection(modelObject.obj)

                    }
                },
                {
                    selector:".jtk-kanban-item-delete",
                    event:EVENT_TAP,
                    callback:(event, eventTarget, modelObject) => {
                        toolkit.removeNode(modelObject.obj)

                    }
                }
            ]
        });

        new DragManager(renderer)

        new KanbanInspector({
            surface:renderer,
            container:document.getElementById("inspector")
        })

        document.getElementById("txtAddColumn").addEventListener("keypress", (event) => {
            if (event.keyCode === 13) {
                const column = toolkit.addGroup({
                    id:uuid(),
                    title:event.target.value,
                    description:"",
                    color:"#FFFFFF"
                })
                event.target.value = ""
                const el = renderer.getRenderedElement(column)
                el.scrollIntoView()
            }
        })

        // load the data.
        toolkit.load({url:'dataset.json'});



    })

