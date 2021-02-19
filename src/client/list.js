import m from './m.js';
import { render } from 'preact';
import { store, actions, connect, Provider } from './store.js';

import Section from './Section/Section.js';
import Item from './Item/Item.js';

const List = connect(state => state, actions)(
    (state) => 
        m('div',
            state.list.sections.map(section =>
                m(Section, {
                    section
                },
                    section.items.map((item, index) =>
                        m(Item, {
                            item,
                            itemPos: index,
                            isSorting: state.isSorting,
                            isUserMakingChanges: state.isUserMakingChanges,
                            showItems: state.showItems
                        })
                    )
                )
            )
        )
);


const App = () => 
    m(Provider, { store },
        m(List)
    )
;

const LIST_CONTAINER = document.getElementById('list');
render(m(App), LIST_CONTAINER);