import m from '../../m.js';
import { addItem, resetAddItemForm } from '../../actions.js';

const AddItemControls = ({ addForm }) => [
    m('button.item-control', {
        onclick: [addItem, {
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

export default AddItemControls;

