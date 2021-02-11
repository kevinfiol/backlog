import m from '../../m.js';
import Button from '../Button.js';
import { editItem, resetEditItemForm } from '../../actions/Item.js';

const EditItemControls = ({ editForm }) => {
    const isDisabled = editForm.itemname.trim().length < 1;

    return [
        m(Button, {
            label: 'save',
            icon: 'save',
            className: 'item-control',
            disabled: isDisabled,
            onclick: isDisabled
                ? null
                : [editItem, {
                    item: editForm
                }]
            ,
        }),

        m(Button, {
            label: 'cancel',
            icon: 'cancel',
            className: 'item-control',
            disabled: isDisabled,
            onclick: resetEditItemForm
        })
    ];
};

export default EditItemControls;