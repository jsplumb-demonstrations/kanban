export default function ItemComponent({ctx}) {

    return <div className="jtk-kanban-item" draggable="true">
        <div className="jtk-kanban-item-delete" onClick={() => ctx.toolkit.removeNode(ctx.vertex)}/>
        {ctx.vertex.data.name}
    </div>
}
