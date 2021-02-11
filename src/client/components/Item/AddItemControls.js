import m from '../../m.js';
import Button from '../Button.js';
import { addItem, resetAddItemForm } from '../../actions/Item.js';

const AddItemControls = ({ addForm }) => {
    const isDisabled = addForm.item.itemname.trim().length < 1;

    return [
        m(Button, {
            className: 'item-control',
            label: 'save',
            icon: 'save',
            disabled: isDisabled,
            onclick: isDisabled
                ? null
                : [addItem, {
                    item: addForm.item,
                    sectionid: addForm.sectionid,
                    itemPosition: addForm.itemPosition
                }]
            ,
        }),

        m(Button, {
            className: 'item-control',
            label: 'cancel',
            icon: 'cancel',
            onclick: [resetAddItemForm]
        })
    ];
};

export default AddItemControls;

