import { app } from 'hyperapp';
import m from './m.js';

import Item from './components/Item.js';
import AddItemForm from './components/AddItemForm.js';
import EditItemForm from './components/EditItemForm.js';

const LIST_CONTAINER = document.getElementById('list');
const { list } = window.viewData;

const initialState = {
    list,
    error: null,

    isAddingItem: false,
    isRemovingItem: false,
    isEditingItem: false,

    itemToEdit: { itemid: null, itemname: '', url: '' },
    itemToAdd: { itemname: '', url: '', itemPosition: null },
    itemToRemove: null,
};

const List = state => 
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

        state.isAddingItem &&
            m(AddItemForm, {
                itemToAdd: state.itemToAdd,
                initialItem: initialState.itemToAdd
            })
        ,

        state.isEditingItem &&
            m(EditItemForm, {
                itemToEdit: state.itemToEdit
            })
        ,
    )
;

app({
    init: initialState,
    view: List,
    node: LIST_CONTAINER
});