import m from '../m.js';
import { setState } from '../actions.js';
import ItemControls from './ItemControls.js';
import AddItemForm from './AddItemForm.js';
import EditItemForm from './EditItemForm.js';
import RemoveItemForm from './RemoveItemForm.js';

const Item = ({ item, itemPosition, itemState }) => [
    m('li',
        {
            class: {
                item: true,
                editing: itemState.isEditing && item.itemid === itemState.itemid,
                removing: itemState.isRemoving && item.itemid === itemState.itemid
            }
        },

        ((!itemState.isEditing && !itemState.isRemoving) || item.itemid !== itemState.itemid) &&
            m('span.item-label', item.itemname)
        ,

        (itemState.isEditing && item.itemid === itemState.itemid) &&
            m(EditItemForm, { editForm: itemState.editForm })
        ,

        (itemState.isRemoving && item.itemid === itemState.itemid) &&
            m(RemoveItemForm, { removeForm: itemState.removeForm },
                m('em.mr1', 'Remove item ', m('b', item.itemname), '?')
            )
        ,

        !(itemState.isAdding || itemState.isRemoving || itemState.isEditing) &&
            m(ItemControls, { item, itemPosition })
        ,
    ),

    (itemState.isAdding && item.itemid === itemState.itemid) &&
        m('li.item.adding',
            m(AddItemForm, { addForm: itemState.addForm })
        )
    ,
];

export default Item;