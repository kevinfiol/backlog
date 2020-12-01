import m from '../m.js';
import Input from './Input.js';
import { setState, addItem } from '../actions.js';

const AddItemForm = ({ itemToAdd, initialItem }) => 
    m('div.flex',
        m(Input, {
            placeholder: 'name...',
            value: itemToAdd.item.itemname,
            oninput: (state, e) => [setState, {
                itemToAdd: { item: { itemname: e.target.value } }
            }]
        }),

        m(Input, {
            placeholder: 'url...',
            value: itemToAdd.item.url,
            oninput: (state, e) => [setState, {
                itemToAdd: { item: { url: e.target.value } }
            }]
        }),

        m('button.item-control', {
            onclick: [addItem, {
                item: itemToAdd.item,
                sectionid: itemToAdd.sectionid,
                itemPosition: itemToAdd.itemPosition,
                initialItem
            }]
        },
            m('i.save'),
            'save'
        ),

        m('button.item-control', {
            onclick: [setState, {
                isAddingItem: false,
                itemToAdd: { item: { ...initialItem } }
            }]
        },
            m('i.cancel'),
            'cancel'
        )
    )
;

export default AddItemForm;