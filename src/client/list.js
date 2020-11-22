import { app } from 'hyperapp';
import m from './m.js';
import Input from './components/Input.js';

import {
    valueStream,
    setState,
    addToSection,
    getFullList,
    addItem
} from './actions.js';

const LIST_CONTAINER = document.getElementById('list');
const { list } = window.viewData;
console.log(window.viewData);

const Item = ({ item, isAddingItem, isRemovingItem, isEditingItem }) => {
    console.log(isAddingItem, isRemovingItem,isEditingItem);
    return     m('li.item',
        m('span', item.itemname),

        !(isAddingItem || isRemovingItem || isEditingItem) &&
            m('div.item-controls.inline',
                m('button.item-control',
                    m('i.edit'), 'edit'
                ),
                m('button.item-control',
                    { onclick: [setState, { isAddingItem: true }] },
                    m('i.add'), 'add'
                ),
                m('button.item-control',
                    m('i.remove'), 'remove'
                )
            )
    )
};

const AddItemForm = ({ itemToAdd }) => 
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
            { onclick: [setState, { isAddingItem: false, itemToAdd: { itemname: '', url: '' } }] },
            m('i.cancel'), 'cancel'
        )
    )
;

app({
    init: {
        list,
        error: null,

        isAddingItem: false,
        isRemovingItem: false,
        isEditingItem: false,

        itemToAdd: { itemname: '', url: '' },
        itemToRemove: null,
        itemToEdit: null
    },
    view: state =>
        m('div',
            state.list.sections.map(section =>
                m('section',
                    m('h2.section-header', section.sectionname),
                    m('ul.item-list',
                        section.items.map(item =>
                            m(Item, {
                                item,
                                isAddingItem: state.isAddingItem,
                                isRemovingItem: state.isRemovingItem,
                                isEditingItem: state.isEditingItem
                            })
                        )
                    )
                )
            ),

            // if adding item
            state.isAddingItem &&
                m(AddItemForm, { itemToAdd: state.itemToAdd })
            ,
        )
    ,
    node: LIST_CONTAINER
});