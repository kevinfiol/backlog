import { app } from 'hyperapp';
import m from './m.js';
import Input from './components/Input.js';

const listContainer = document.getElementById('list');
const { list } = window.viewData;

const SetValue = (state, { key, value }) => {
    let newState = { ...state, [key]: value };
    console.log(newState);
    return newState;
};

const InputSetter = key => (state, e) => SetValue(state, { key, value: e.target.value });

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

const AddToSection = (state, { sectionid, newItem }) => {
    const sections = state.list.sections;
    const idx = sections.findIndex(section => section.sectionid == sectionid);
    sections[idx].items = [...sections[idx].items, { itemid: 5, itemname: newItem, slug: 'nah', url: 'huh' }];
    state.list.sections = sections;
    return { ...state };
};

app({
    init: {
        list,
        newItem: ''
    },
    view: ({ newItem, list }) =>
        m('div',
            m(List, { list }),
            m(Input, { value: newItem, update: InputSetter('newItem') }),
            m('button', { onclick: [AddToSection, { sectionid: 2, newItem }] }, 'add')
        )
    ,
    node: listContainer
});