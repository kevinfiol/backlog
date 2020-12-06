import m from '../m.js';
import { setState } from '../actions.js';
import ItemControls from './ItemControls.js';
import AddItemForm from './AddItemForm.js';
import EditItemForm from './EditItemForm.js';
import RemoveItemForm from './RemoveItemForm.js';

const Item = ({ item, itemPosition, itemState }) => 
    m('li.item',
        (!itemState.isEditing || item.itemid !== itemState.itemid) &&
            m('span', item.itemname)
        ,

        (itemState.isAdding && item.itemid === itemState.itemid) &&
            m(AddItemForm, { addForm: itemState.addForm })
        ,

        (itemState.isEditing && item.itemid === itemState.itemid) &&
            m(EditItemForm, { editForm: itemState.editForm })
        ,

        (itemState.isRemoving && item.itemid === itemState.itemid) &&
            m(RemoveItemForm, { removeForm: itemState.removeForm })
        ,

        !(itemState.isAdding || itemState.isRemoving || itemState.isEditing) &&
            m(ItemControls, { item, itemPosition })
        ,
    )
;

export default Item;