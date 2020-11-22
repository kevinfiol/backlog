import m from '../m.js';
import Input from './Input.js';
import { setState } from '../actions.js';

const AddItemForm = ({ itemToAdd, initialItem }) => 
    m('div.flex',
        m(Input, {
            placeholder: 'name...',
            value: itemToAdd.itemname,
            oninput: (state, e) => [
                setState,
                { itemToAdd: { itemname: e.target.value } }
            ]
        }),

        m(Input, {
            placeholder: 'url...',
            value: itemToAdd.url,
            oninput: (state, e) => [
                setState,
                { itemToAdd: { url: e.target.value } }
            ]
        }),

        m('button.item-control',
            {},
            m('i.save'), 'save'
        ),

        m('button.item-control',
            { onclick: [setState, { isAddingItem: false, itemToAdd: { ...initialItem } }] },
            m('i.cancel'), 'cancel'
        )
    )
;

export default AddItemForm;