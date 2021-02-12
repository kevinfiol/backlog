import m from '../../m.js';
import AddItemForm from './AddItemForm.js';
import EditItemForm from './EditItemForm.js';

import ItemControls from './ItemControls.js';
import AddItemControls from './AddItemControls.js';
import EditItemControls from './EditItemControls.js';
import RemoveItemControls from './RemoveItemControls.js';

const Item = ({ item, itemPosition, itemState, isSorting, isUserMakingChanges, showItems }) => {
    const isAdding = itemState.isAdding && item.itemid === itemState.itemid;
    const isEditing = itemState.isEditing && item.itemid === itemState.itemid;
    const isRemoving = itemState.isRemoving && item.itemid === itemState.itemid;
    const isBeingUsed = isAdding || isEditing || isRemoving;

    return [
        m('tr', {
            class: {
                item: true,
                hide: !showItems,
                'cursor-grab': isSorting
            },

            key: item.itemid,
            // data attributes for sorting
            'data-id': item.itemid,
            'data-sectionid': item.sectionid
        },
            // default view of item
            (!isEditing && !isRemoving) && [
                isSorting &&
                    m('td', m('i.move'))
                ,
                m('td.item-name', item.itemname),
                m('td.item-data', 'link & review'),
            ],

            // Edit Form
            isEditing &&
                m(EditItemForm, { editForm: itemState.editForm })
            ,

            // Remove Form
            isRemoving && [
                m('td.item-name', m('em', 'Remove ', m('b', item.itemname), '?')),
                m('td.item-data', '') // empty cell
            ],

            // Item Controls
            m('td', {
                class: {
                    'item-controls': true,
                    'is-being-used': isBeingUsed
                }
            },
                // Shows Item Controls only on Items being used
                (!isUserMakingChanges) &&
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

        // Add Form
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