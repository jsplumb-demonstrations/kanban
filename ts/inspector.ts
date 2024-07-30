import {VanillaInspector, isNode, isGroup, VanillaInspectorOptions, Base, Surface} from "@jsplumbtoolkit/browser-ui"


const CARD_TEMPLATE = `<div class="jtk-kanban-inspector">
    <strong>Label</strong>
    <input jtk-att="name" type="text"/>
    <strong>Description</strong>
    <textarea jtk-att="description" rows="10"/>
</div>`

const LANE_TEMPLATE = `<div class="jtk-kanban-inspector">
    <strong>Title</strong>
    <input jtk-att="title" type="text"/>
    <strong>Description</strong>
    <textarea jtk-att="description" rows="10"/>
    <strong>Color</strong>
    <input type="color" jtk-att="color"/>

</div>`

export class KanbanInspector extends VanillaInspector {

    constructor(options:{surface:Surface, container:HTMLElement}) {
        super(Object.assign(options, {
            cacheTemplates:false,
            templateResolver:(obj:Base) => {
                if (isGroup(obj)) {
                    return LANE_TEMPLATE
                }
                else if (isNode(obj)) {
                    return CARD_TEMPLATE
                }
            }
        }))

    }
}
