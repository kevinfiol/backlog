import m from '../../m.js';
import { addItem, resetAddItemForm } from '../../actions/Item.js';

const AddItemControls = ({ addForm }) => {
    const isDisabled = addForm.item.itemname.trim().length < 1;

    return [
        m('button.item-control', {
            disabled: isDisabled,
            onclick: isDisabled ? null : [addItem, {
                item: addForm.item,
                sectionid: addForm.sectionid,
                itemPosition: addForm.itemPosition
            }]
        },
            m('i.save'),
            'save'
        ),

        m('button.item-control', {
            onclick: resetAddItemForm
        },
            m('i.cancel'),
            'cancel'
        )
    ];
};

export default AddItemControls;

