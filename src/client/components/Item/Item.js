import m from '../../m.js';
import { preventDefault, itemOnDragStart, itemOnDragOver, itemOnDragEnd } from '../../actions.js';
import AddItemForm from './AddItemForm.js';
import EditItemForm from './EditItemForm.js';

import ItemControls from './ItemControls.js';
import AddItemControls from './AddItemControls.js';
import EditItemControls from './EditItemControls.js';
import RemoveItemControls from './RemoveItemControls.js';

const Item = ({ item, itemPosition, itemState, dnd }) => {
    const isUserMakingChanges = itemState.isAdding || itemState.isRemoving || itemState.isEditing;
    const isAdding = itemState.isAdding && item.itemid === itemState.itemid;
    const isEditing = itemState.isEditing && item.itemid === itemState.itemid;
    const isRemoving = itemState.isRemoving && item.itemid === itemState.itemid;

    return [
        m('tr.item', {
            draggable: true,
            class: {
                'drag-item': true,
                dragging: item.itemid === dnd.drag,
                dropping: item.itemid === dnd.drop
            },
            ondragstart: preventDefault([itemOnDragStart, { itemid: item.itemid }]),
            ondragover: preventDefault([itemOnDragOver, { itemid: item.itemid }]),
            ondragend: preventDefault(itemOnDragEnd)
        },
            (!isEditing && !isRemoving) && [
                m('td.item-name', item.itemname),
                m('td.item-data', 'link & review'),
            ],

            isEditing &&
                m(EditItemForm, { editForm: itemState.editForm })
            ,

            isRemoving && [
                m('td.item-name', m('em', 'Remove ', m('b', item.itemname), '?')),
                m('td.item-data', '')
            ],

            m('td', {
                class: {
                    'item-controls': true,
                    'is-user-making-changes': isUserMakingChanges
                }
            },
                !isUserMakingChanges &&
                    m(ItemControls, { item, itemPosition })
                ,

                isEditing &&
                    m(EditItemControls, { editForm: itemState.editForm })
                ,

                isRemoving &&
                    m(RemoveItemControls, { removeForm: itemState.removeForm })
                ,
            )
        ),

        isAdding &&
            m('tr',
                m(AddItemForm, { addForm: itemState.addForm }),
                m('td.item-controls.is-user-making-changes',
                    m(AddItemControls, { addForm: itemState.addForm })
                )
            )
        ,
    ];
};

export default Item;