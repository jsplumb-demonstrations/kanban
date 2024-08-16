import React, { useRef, useEffect } from 'react'

import { SurfaceComponent, SurfaceProvider} from "@jsplumbtoolkit/browser-ui-react"
import { EVENT_TAP, EmptyLayout, uuid, newInstance, RowLayout, EVENT_CANVAS_CLICK } from "@jsplumbtoolkit/browser-ui"

import ColumnComponent from './ColumnComponent'
import ItemComponent from './ItemComponent'
import { DragManager } from './drag-manager'
import KanbanInspectorComponent from "./InspectorComponent";


export default function Kanban(props) {

    const toolkit = newInstance()
    const initialized = useRef(null)
    const surfaceRef = useRef(null)
    const inspectorContainer = useRef(null)

    const view = {
        nodes:{
            default:{
                jsx:(ctx) => <ItemComponent ctx={ctx} />,
                events:{
                    [EVENT_TAP]:(p) => {
                        toolkit.setSelection(p.obj)
                    }
                }
            }
        },
        groups: {
            default: {
                jsx:(ctx) => <ColumnComponent ctx={ctx}/>,
                layout:{
                    type:EmptyLayout.type
                },
                events:{
                    [EVENT_TAP]:(p) => {
                        toolkit.clearSelection()
                    }
                }

            }
        }
    }

    const renderParams = {
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
            [EVENT_CANVAS_CLICK]:() => toolkit.clearSelection()
        },
        consumeRightClick:false
    }

    function addColumn(event) {
        if (event.code === "Enter") {
            debugger
            const column = toolkit.addGroup({
                id:uuid(),
                title:event.target.value,
                description:"",
                color:"#FFFFFF"
            })
            event.target.value = ""
            const el = surfaceRef.current.getSurface().getRenderedElement(column)
            el.scrollIntoView()
        }
    }

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            new DragManager(surfaceRef.current.getSurface())
        }
    })

    return <div className="jtk-kanban-main">
            <SurfaceProvider>
                <div className="jtk-kanban-container">
                    <SurfaceComponent
                        viewOptions={view}
                        renderOptions={renderParams}
                        ref={surfaceRef}
                        toolkit={toolkit}
                        url='/public/dataset.json'
                        />
                </div>

                <div className="jtk-kanban-rhs">

                    <div id="controls">
                        <input type="text" id="txtAddColumn" placeholder="Add column..." onKeyPress={(e) => addColumn(e)}/>
                    </div>

                    <KanbanInspectorComponent/>

                    <div className="description">

                    </div>
                </div>

            </SurfaceProvider>

        </div>

}
