import m from '../../m.js';
import { editItem, resetEditItemForm } from '../../actions.js';

const EditItemControls = ({ editForm }) => [
    m('button.item-control', {
        onclick: [editItem, { item: editForm }]
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

export default EditItemControls;