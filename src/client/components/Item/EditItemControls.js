import m from '../../m.js';
import { editItem, resetEditItemForm } from '../../actions/Item.js';

const EditItemControls = ({ editForm }) => {
    const isDisabled = editForm.itemname.trim().length < 1;

    return [
        m('button.item-control', {
            disabled: isDisabled,
            onclick: isDisabled ? null : [editItem, { item: editForm }]
        },
            m('i.save'),
            'save'
        ),

        m('button.item-control', {
            onclick: resetEditItemForm
        },
            m('i.cancel'),
            'cancel'
        )
    ];
};




export default EditItemControls;