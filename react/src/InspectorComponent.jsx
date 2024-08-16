import React, {useState} from "react";

import {InspectorComponent} from "@jsplumbtoolkit/browser-ui-react"
import { Node, Group } from "@jsplumbtoolkit/browser-ui"

export default function KanbanInspectorComponent() {

    const [currentType, setCurrentType] = useState('')

    return <InspectorComponent renderEmptyContainer={() => setCurrentType('')} refresh={(obj,cb) => setCurrentType(obj.objectType)}>

        { currentType === '' && <></> }

        { currentType === Node.objectType &&
        <div className="jtk-kanban-inspector">
            <strong>Label</strong>
            <input jtk-att="name" type="text"/>
            <strong>Description</strong>
            <textarea jtk-att="description" rows="10"/>
            </div>
        }

        { currentType === Group.objectType &&
        <div className="jtk-kanban-inspector">
            <strong>Title</strong>
            <input jtk-att="title" type="text"/>
            <strong>Description</strong>
            <textarea jtk-att="description" rows="10"/>
            <strong>Color</strong>
            <input type="color" jtk-att="color"/>
        </div>
        }

    </InspectorComponent>

}
