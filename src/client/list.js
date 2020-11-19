import { app } from 'hyperapp';
import m from './m.js';

import Input from './components/Input.js';
import { valueStream, addToSection, getFullList } from './actions.js';

const LIST_CONTAINER = document.getElementById('list');
// const { list } = window.viewData;

const List = ({ list }) =>
    list.sections.map(section =>
        m('section',
            m('h2.section-header', section.sectionname),
            m('ul.item-list',
                section.items.map(item =>
                    m('li.item', item.itemname)
                )
            )
        )
    )
;

app({
    init: {
        list: null,
        newItem: ''
    },
    view: ({ newItem, list }) =>
        m('div',
            list ? m(List, { list }) : m('p', 'no list yet'),
            // m(List, { list }),
            // m(Input, { value: newItem, update: valueStream('newItem') }),
            m('button', { onclick: getFullList }, 'get list')
        )
    ,
    node: LIST_CONTAINER
});