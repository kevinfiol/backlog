import { app } from 'hyperapp';
import m from './m.js';

import Item from './components/Item.js';
import AddItemForm from './components/AddItemForm.js';
import EditItemForm from './components/EditItemForm.js';
import RemoveItemForm from './components/RemoveItemForm.js';

const LIST_CONTAINER = document.getElementById('list');
const { list } = window.viewData;

console.log(list);

const initialState = {
    list,
    error: null,

    item: {
        itemid: null,

        isAdding: false,
        isRemoving: false,
        isEditing: false,

        editForm: { itemid: null, itemname: '', url: '' },
        addForm: { item: { itemname: '', url: '' }, sectionid: null, itemPosition: null },
        removeForm: { itemid: null, sectionid: null }
    }
};

const List = state => 
    m('div',
        state.list.sections.map(section =>
            m('section',
                m('h2.section-header', section.sectionname),
                m('ul.item-list',
                    section.items.map((item, index) =>
                        m(Item, {
                            item,
                            key: item.itemid,
                            itemPosition: index,
                            isAdding: state.item.isAdding,
                            isRemoving: state.item.isRemoving,
                            isEditing: state.item.isEditing
                        })
                    )
                )
            )
        ),

        state.item.isAdding &&
            m(AddItemForm, {
                addForm: state.item.addForm,
            })
        ,

        state.item.isEditing &&
            m(EditItemForm, {
                editForm: state.item.editForm
            })
        ,

        state.item.isRemoving &&
            m(RemoveItemForm, {
                removeForm: state.item.removeForm
            })
        ,
    )
;

app({
    init: initialState,
    view: List,
    node: LIST_CONTAINER
});