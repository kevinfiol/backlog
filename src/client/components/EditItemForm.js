import m from '../m.js';
import Input from './Input.js';
import { setState } from '../actions.js';

const EditItemForm = ({ itemToEdit }) => 
    m('div.flex',
        m(Input, {
            placeholder: 'name...',
            value: itemToEdit.itemname,
            oninput: (state, e) => [
                setState,
                { itemToEdit: { itemname: e.target.value } }
            ]
        }),

        m(Input, {
            placeholder: 'url...',
            value: itemToEdit.url,
            oninput: (state, e) => [
                setState,
                { itemToEdit: { url: e.target.value } }
            ]
        }),

        m('button.item-control',
            {},
            m('i.save'), 'save'
        ),

        m('button.item-control',
            { onclick: [setState, { isEditingItem: false }] },
            m('i.cancel'), 'cancel'
        )
    )
;

export default EditItemForm;