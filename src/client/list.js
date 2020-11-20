import { app } from 'hyperapp';
import m from './m.js';
import { valueStream, addToSection, getFullList } from './actions.js';

const LIST_CONTAINER = document.getElementById('list');
const { list } = window.viewData;
console.log(window.viewData);

const Item = ({ item }) => 
    m('li.item',
        m('span', item.itemname),
        m('div.item-controls.inline',
            m('button.item-control',
                m('i.edit'), 'edit'
            ),
            m('button.item-control',
                m('i.add'), 'add'
            ),
            m('button.item-control',
                m('i.remove'), 'remove'
            )
        )
    )
;

const List = ({ list }) =>
    list.sections.map(section =>
        m('section',
            m('h2.section-header', section.sectionname),
            m('ul.item-list',
                section.items.map(item =>
                    m(Item, { item })
                )
            )
        )
    )
;

app({
    init: {
        list,
        newItem: ''
    },
    view: ({ newItem, list }) =>
        m('div',
            m(List, { list })
        )
    ,
    node: LIST_CONTAINER
});