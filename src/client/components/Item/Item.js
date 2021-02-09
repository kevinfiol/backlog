import m from '../../m.js';
import AddItemForm from './AddItemForm.js';
import EditItemForm from './EditItemForm.js';

import ItemControls from './ItemControls.js';
import AddItemControls from './AddItemControls.js';
import EditItemControls from './EditItemControls.js';
import RemoveItemControls from './RemoveItemControls.js';

const Item = ({ item, itemPosition, itemState, isSorting }) => {
    const isUserMakingChanges = itemState.isAdding || itemState.isRemoving || itemState.isEditing || isSorting;
    const isAdding = itemState.isAdding && item.itemid === itemState.itemid;
    const isEditing = itemState.isEditing && item.itemid === itemState.itemid;
    const isRemoving = itemState.isRemoving && item.itemid === itemState.itemid;

    return [
        m('tr.item', {
            id: item.itemid // IMPORTANT; necessary for SortableJS to collect item ids and create new sort order
        },
            (!isEditing && !isRemoving) && [
                isSorting && m('td.item-handle', m('i.move')),
                m('td.item-name', item.itemname),
                m('td.item-data', 'link & review'),
            ],

            isEditing &&
                m(EditItemForm, { editForm: itemState.editForm })
            ,

            isRemoving && [
                m('td.item-name', m('em', 'Remove ', m('b', item.itemname), '?')),
                m('td.item-data', '') // empty cell
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