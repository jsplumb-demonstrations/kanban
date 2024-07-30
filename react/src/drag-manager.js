import {EventManager, EVENT_GROUP_ADDED, EVENT_NODE_ADDED, EVENT_GROUP_MEMBER_ADDED, EVENT_NODE_REMOVED} from "@jsplumbtoolkit/browser-ui"

const CLASS_DRAG_ACTIVE = "jtk-drag-active"

const EVENT_DRAG_OVER = "dragover"
const EVENT_DRAG_ENTER = "dragenter"
const EVENT_DRAG_LEAVE = "dragleave"
const EVENT_DROP = "drop"
const EVENT_DRAG_START = "dragstart"
const EVENT_DRAG_END = "dragend"

const MOVE = "move"

/**
 * This class handles drag/drop of items between columns, using 'native' drag/drop.
 */
export class DragManager {

    currentNode
    currentColumn
    dragElement

    constructor(surface) {

        this.eventManager = new EventManager()

        const dragstartHandler = (ev) => {
            // on drag start, clear the selection
            surface.toolkitInstance.clearSelection()
            // stash the drag element and the model object it represents, plus the current column the item is in
            this.dragElement = ev.target
            this.currentNode = surface.getModelObjectFromElement(ev.target, true)
            this.currentColumn = this.currentNode.group
            // indicate the item will be moved, not copied
            ev.dataTransfer.dropEffect = MOVE;
            // add css class so user can see what's being dragged
            ev.target.classList.add(CLASS_DRAG_ACTIVE)
        }

        surface.bind(EVENT_NODE_ADDED, (p) => {
            // initialise the element for native drag
            p.el.addEventListener(EVENT_DRAG_START, dragstartHandler)
            p.el.addEventListener(EVENT_DRAG_END, (e) => {
                e.target.classList.remove(CLASS_DRAG_ACTIVE)
            })
        })

        //
        // handler for over/enter drag events. sets drop effect on the data transfer and
        // adds a css class to the column
        //
        const initGroupOver = (el, group) => {
            return (event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = MOVE;
                el.classList.add(CLASS_DRAG_ACTIVE)
            }
        }

        //
        // initialise a drop on a column
        const initGroupDrop = (el, group) => {
            return (evt) => {
                evt.preventDefault();
                el.classList.remove(CLASS_DRAG_ACTIVE)

                // find the element that is next in the column; we'll insert before it
                const previous = getDragAfterElement(el, group, evt.clientY)

                // get current item order and order value from previous, or if previous is null we
                // just use the current length of the item list in the column
                const currentOrder = this.currentNode.data.order
                const newOrder = previous == null ? group.getMembers().length : previous.vertex.data.order

                // update order for members in the current column
                this.currentColumn.getMembers().forEach(m => {
                    if (m.data.order >= currentOrder) {
                        m.data.order--
                    }
                })

                // update order for members in the new column
                group.getMembers().forEach(m => {
                    if (m.data.order >= newOrder) {
                        m.data.order++
                    }
                })

                // write the new ordering
                this.currentNode.data.order = newOrder

                // if item is in the same column as originally, just reorder
                if(group.id === this.currentColumn.id) {
                    _reorderGroup(group)
                } else {
                    // otherwise add to new group; the toolkit will handle removing it from the previous one
                    surface.toolkitInstance.addToGroup(this.currentNode, group)
                }
            }
        }

        // find in the DOM the element after the given Y location
        const getDragAfterElement = (
            container, group, y
        ) => {
            const draggableElements = group.getMembers().map(m => { return {vertex:m, el:surface.getRenderedElement(m)}})

            return draggableElements.reduce(
                (closest, child) => {
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

        //
        // when a new group is added, initialise it for drag/drop
        //
        surface.bind(EVENT_GROUP_ADDED, (p) => {

            const enterHandler = initGroupOver(p.el, p.vertex);
            const dropHandler = initGroupDrop(p.el, p.vertex);

            [EVENT_DRAG_ENTER, EVENT_DRAG_OVER].forEach( (evt) => {
                this.eventManager.on(p.el, evt, "*", enterHandler)
                this.eventManager.on(p.el, evt, enterHandler)
            })

            this.eventManager.on(p.el, EVENT_DRAG_LEAVE, (event) => {
                p.el.classList.remove(CLASS_DRAG_ACTIVE)
            })

            this.eventManager.on(p.el, EVENT_DROP, "*", dropHandler)
            this.eventManager.on(p.el, EVENT_DROP, dropHandler)

        })

        //
        // reorder DOM elements according to the `order` property of their data objects
        //
        const _reorderGroup = (group) => {
            const el = surface.getRenderedElement(group)
            const contentArea = el.querySelector("[data-jtk-group-content]")
            const cards = group.getMembers()
                .slice()
                .sort((a,b) => -1 * Math.sign(a.data.order - b.data.order))
                .map(m => surface.getRenderedElement(m))

            cards.forEach(c => {
                contentArea.insertBefore(c, contentArea.firstChild)
            })
        }

        // reorder a group when a node is added/removed or added to a group

        surface.bind(EVENT_NODE_ADDED, (p) => {
            _reorderGroup(p.vertex.group)
        })

        surface.bind(EVENT_NODE_REMOVED, (p) => {
            _reorderGroup(p.vertex.group)
        })

        surface.bind(EVENT_GROUP_MEMBER_ADDED, (p) => {
            _reorderGroup(p.group)
        })
    }


}
