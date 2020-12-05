import m from '../m.js';
import Input from './Input.js';
import { setState, editItem, resetEditItemForm } from '../actions.js';

const EditItemForm = ({ editForm }) => 
    m('div.flex',
        m(Input, {
            placeholder: 'name...',
            value: editForm.itemname,
            oninput: (state, e) => [setState, {
                item: { editForm: { itemname: e.target.value } }
            }]
        }),

        m(Input, {
            placeholder: 'url...',
            value: editForm.url,
            oninput: (state, e) => [setState, {
                item: { editForm: { url: e.target.value } }
            }]
        }),

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
    )
;

export default EditItemForm;