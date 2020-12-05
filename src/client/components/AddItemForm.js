import m from '../m.js';
import Input from './Input.js';
import { setState, addItem, resetAddItemForm } from '../actions.js';

const AddItemForm = ({ addForm }) => 
    m('div.flex',
        m(Input, {
            placeholder: 'name...',
            value: addForm.item.itemname,
            oninput: (state, e) => [setState, {
                item: { addForm: { item: { itemname: e.target.value } } }
            }]
        }),

        m(Input, {
            placeholder: 'url...',
            value: addForm.item.url,
            oninput: (state, e) => [setState, {
                item: { addForm: { item: { url: e.target.value } } }
            }]
        }),

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
    )
;

export default AddItemForm;