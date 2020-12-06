import { app } from 'hyperapp';
import m from './m.js';

import Item from './components/Item.js';

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

        editForm: {
            itemid: null,
            itemname: '',
            url: ''
        },
        addForm: {
            item: { itemname: '', url: '' },
            sectionid: null,
            itemPosition: null
        },
        removeForm: {
            itemid: null,
            sectionid: null
        }
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
                            itemPosition: index,
                            itemState: state.item,
                            key: item.itemid
                        })
                    )
                )
            )
        )
    )
;

app({
    init: initialState,
    view: List,
    node: LIST_CONTAINER
});