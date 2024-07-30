import React, {useEffect, useRef, useState} from "react";

import { Node, Group, Inspector} from "@jsplumbtoolkit/browser-ui"

export default function InspectorComponent({surface}) {

    const container = useRef(null)
    const [currentType, setCurrentType] = useState('')
    const [inspector, setInspector] = useState(null)

    useEffect(() => {

        setInspector(new Inspector({
            container:container.current,
            surface,
            renderEmptyContainer:() => setCurrentType(''),
            refresh:(obj, cb) => {
                setCurrentType(obj.objectType)
                // next tick
                setTimeout(cb)
            }
        }))

    }, [])

    return <div ref={container}>

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

    </div>

}
