import { useRef, useEffect } from 'react'
import { createRoot } from "react-dom/client";

import { JsPlumbToolkitSurfaceComponent } from "@jsplumbtoolkit/browser-ui-react"
import { EVENT_TAP, EmptyLayout, uuid, newInstance, RowLayout, EVENT_CANVAS_CLICK } from "@jsplumbtoolkit/browser-ui"

import ColumnComponent from './ColumnComponent'
import ItemComponent from './ItemComponent'
import { DragManager } from './drag-manager'
import Inspector from './InspectorComponent'

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
            const el = surfaceRef.current.surface.getRenderedElement(column)
            el.scrollIntoView()
        }
    }

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true

            new DragManager(surfaceRef.current.surface)

            const ic = createRoot(inspectorContainer.current)
            ic.render(<Inspector surface={surfaceRef.current.surface} container={inspectorContainer.current}/>)

            toolkit.load({
                url:'/public/dataset.json'
            })
        }
    })

    return <div className="jtk-kanban-main">
            <div className="jtk-kanban-container">
                <JsPlumbToolkitSurfaceComponent 
                    view={view}
                    renderParams={renderParams} 
                    ref={surfaceRef}
                    toolkit={toolkit}
                    />
            </div>

            <div className="jtk-kanban-rhs">

                <div id="controls">
                    <input type="text" id="txtAddColumn" placeholder="Add column..." onKeyPress={(e) => addColumn(e)}/>
                </div>

                <div id="inspector" ref={inspectorContainer}/>

                <div className="description">

                </div>
            </div>

        </div>

}
