import m from './m.js';
import { render } from 'preact';
import { store, connect, Provider } from './store.js';
import actions from './actions.js';

import Section from './Section/Section.js';
import Item from './Item/Item.js';

const List = connect(store => store, actions)(
    (store) => {
        const setIsChanging = isChanging => store.setVal(['isChanging', isChanging]);

        return (
            m('div',
                store.list.sections.map(section =>
                    m(Section, {
                        // actions
                        setIsChanging: setIsChanging,
                        editSection: store.editSection,
                        removeSection: store.removeSection,

                        // props
                        section,
                        isSorting: store.isSorting,
                        isChanging: store.isChanging
                    },
                        section.items.map((item, index) =>
                            m(Item, {
                                // actions
                                setIsChanging: setIsChanging,
                                addItem: store.addItem,
                                editItem: store.editItem,
                                removeItem: store.removeItem,

                                // props
                                item,
                                itemPos: index,
                                isSorting: store.isSorting,
                                isChanging: store.isChanging,
                                showItems: store.showItems
                            })
                        )
                    )
                )
            )
        );
    }
);


const App = () => 
    m(Provider, { store },
        m(List)
    )
;

const LIST_CONTAINER = document.getElementById('list');
render(m(App), LIST_CONTAINER);