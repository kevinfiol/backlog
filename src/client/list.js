import { app } from 'hyperapp';
import m from './m.js';

import Input from './components/Input.js';
import { InputSetter, addToSection } from './actions.js';

const LIST_CONTAINER = document.getElementById('list');
const { list } = window.viewData;

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
        list,
        newItem: ''
    },
    view: ({ newItem, list }) =>
        m('div',
            m(List, { list }),
            m(Input, { value: newItem, update: InputSetter('newItem') }),
            m('button', { onclick: [addToSection, { sectionid: 2, newItem }] }, 'add')
        )
    ,
    node: LIST_CONTAINER
});