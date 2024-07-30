import {
    EventManager,
    EVENT_GROUP_ADDED,
    EVENT_NODE_ADDED,
    EVENT_GROUP_MEMBER_ADDED,
    EVENT_NODE_REMOVED,
    Node,
    Group,
    Surface,
  BrowserElement
} from "@jsplumbtoolkit/browser-ui"

const CLASS_DRAG_ACTIVE = "jtk-drag-active"

const EVENT_DRAG_OVER = "dragover"
const EVENT_DRAG_ENTER = "dragenter"
const EVENT_DRAG_LEAVE = "dragleave"
const EVENT_DROP = "drop"
const EVENT_DRAG_START = "dragstart"
const EVENT_DRAG_END = "dragend"

const ATTR_VERTEX = "data-jtk-vertex"

const MOVE = "move"

export class DragManager {

    currentNode!:Node
    currentGroup!:Group

    dragElement!:HTMLElement

    eventManager:EventManager

    constructor(surface:Surface) {

        this.eventManager = new EventManager()

        const dragstartHandler = (ev:any) => {

            surface.toolkitInstance.clearSelection()

            this.dragElement = ev.target
            const vertexId = ev.target.getAttribute(ATTR_VERTEX)
            this.currentNode = surface.toolkitInstance.getNode(vertexId)
            this.currentGroup = this.currentNode.group
            ev.dataTransfer.setData(ATTR_VERTEX, vertexId);
            ev.dataTransfer.dropEffect = MOVE;
            ev.target.classList.add(CLASS_DRAG_ACTIVE)
        }

        surface.bind(EVENT_NODE_ADDED, (p:{el:HTMLElement}) => {
            p.el.addEventListener(EVENT_DRAG_START, dragstartHandler)
            p.el.addEventListener(EVENT_DRAG_END, (e:any) => {
                e.target.classList.remove(CLASS_DRAG_ACTIVE)
            })
        })

        const initGroupOver = (el:HTMLElement, group:Group) => {
            return (event:any) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = MOVE;
                el.classList.add(CLASS_DRAG_ACTIVE)
            }
        }

        const initGroupDrop = (el:HTMLElement, group:Group) => {
            return (evt:any) => {
                evt.preventDefault();
                el.classList.remove(CLASS_DRAG_ACTIVE)

                const previous = getDragAfterElement(el, group, evt.clientY)

                const currentOrder = this.currentNode.data.order
                const newOrder = previous == null ? group.getMembers().length : previous.vertex.data.order

                this.currentGroup.getMembers().forEach((m:Node) => {
                    if (m.data.order >= currentOrder) {
                        m.data.order--
                    }
                })

                group.getMembers().forEach((m:Node) => {
                    if (m.data.order >= newOrder) {
                        m.data.order++
                    }
                })

                this.currentNode.data.order = newOrder

                if(group.id === this.currentGroup.id) {
                    _reorderGroup(group)
                } else {

                    surface.toolkitInstance.addToGroup(this.currentNode, group)
                }
            }
        }

        const getDragAfterElement = (container:HTMLElement, group:Group, y:number) => {
            const draggableElements = group.getMembers().map((m:Node|Group) => { return {vertex:m, el:surface.getRenderedElement(m)}})

            return draggableElements.reduce(
                (closest:any, child:any) => {
                    const box =
                        child.el.getBoundingClientRect();
                    const offset =
                        y - box.top - box.height / 2;
                    if (
                        offset < 0 &&
                        offset > closest.offset) {
                        return {
                            offset: offset,
                            element: child,
                        };}
                    else {
                        return closest;
                    }},
                {
                    offset: Number.NEGATIVE_INFINITY,
                }
            ).element;
        };

        surface.bind(EVENT_GROUP_ADDED, (p:{el:HTMLElement, vertex:Group}) => {

            const enterHandler = initGroupOver(p.el, p.vertex);
            const dropHandler = initGroupDrop(p.el, p.vertex);

            [EVENT_DRAG_ENTER, EVENT_DRAG_OVER].forEach( (evt) => {
                this.eventManager.on(p.el, evt, "*", enterHandler)
                this.eventManager.on(p.el, evt, enterHandler)
            })

            this.eventManager.on(p.el, EVENT_DRAG_LEAVE, (event:any) => {
                p.el.classList.remove(CLASS_DRAG_ACTIVE)
            })

            this.eventManager.on(p.el, EVENT_DROP, "*", dropHandler)
            this.eventManager.on(p.el, EVENT_DROP, dropHandler)

        })

        const _reorderGroup = (group:Group) => {
            const el = surface.getRenderedElement(group)
            const contentArea = el.querySelector("[data-jtk-group-content]") as BrowserElement
            const cards = group.getMembers()
                .slice()
                .sort((a:Node,b:Node) => -1 * Math.sign(a.data.order - b.data.order))
                .map((m:Node) => surface.getRenderedElement(m))

            cards.forEach((c:BrowserElement) => {
                contentArea.insertBefore(c, contentArea.firstChild)
            })
        }

        surface.bind(EVENT_NODE_ADDED, (p:{vertex:Node}) => {
            _reorderGroup(p.vertex.group)
        })

        surface.bind(EVENT_NODE_REMOVED, (p:{vertex:Node}) => {
            _reorderGroup(p.vertex.group)
        })

        surface.bind(EVENT_GROUP_MEMBER_ADDED, (p:{group:Group}) => {
            _reorderGroup(p.group)
        })
    }


}
