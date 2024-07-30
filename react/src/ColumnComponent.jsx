import { uuid } from "@jsplumbtoolkit/browser-ui"

/**
 * Component for a column in the Kanban
 */
export default function ColumnComponent({ctx}) {

    function addItem(event) {
        if (event.code === "Enter") {

            // On enter keypress, find out how many members there already are in the column
            const order = ctx.vertex.getMembers().length
            // add a new item to the column, specifying an `order` property and the text from
            // the input field, or default to `Item` if the user didnt type anything.
            const node = ctx.toolkit.addNode({
                group:ctx.vertex.id,
                id:uuid(),
                order,
                name:event.target.value || "Item"
            })

            // show the rendered item in the next tick of the event loop
            setTimeout(() => {
                const el = ctx.surface.getRenderedElement(node)
                el.scrollIntoView()
                ctx.toolkit.setSelection(node)
            }, 0)

            // clear the input field
            event.target.value = ""

        }
    }

    return <div className="jtk-kanban-lane">
        <div className="jtk-kanban-lane-header">

            <div className="jtk-kanban-lane-titlebar">
                <div className="jtk-kanban-lane-color" style={{ "backgroundColor":ctx.vertex.data.color}}/>
                <div className="jtk-kanban-lane-title">{ctx.vertex.data.title}</div>
                <div className="jtk-kanban-lane-edit" onClick={() => ctx.toolkit.setSelection(ctx.vertex)}/>
            </div>

            <div className="jtk-kanban-lane-description">{ctx.vertex.data.description}</div>
        </div>

        { /* the items go into this element */ }
        <div data-jtk-group-content="true"/>

        <div className="jtk-kanban-lane-footer">
            <input type="text" placeholder="Add item..." onKeyPress={(e) => addItem(e)}/>
        </div>
    </div>
}
