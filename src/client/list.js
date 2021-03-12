import m from './m.js';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';
import { render } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { store, connect, Provider } from './store.js';
import actions from './actions.js';

import EmptyRow from './Item/EmptyRow.js';
import ListControls from './List/ListControls.js';
import Section from './Section/Section.js';
import Item from './Item/Item.js';

const List = connect(store => store, actions)(
    (store) => {
        const sortable = useRef(null);
        const sortableEl = useRef(null);

        const setIsChanging = isChanging => store.setVal(['isChanging', isChanging]);
        const setIsSorting = isSorting => store.setVal(['isSorting', isSorting]);
        const isListEmpty = store.list.sections.length < 1;

        useEffect(() => {
            if (store.isSorting && sortableEl.current && !sortable.current) {
                sortable.current = Sortable.create(sortableEl.current, {
                    animation: 100,
                    draggable: '.draggable',
                    dataIdAttr: 'data-id',
                    onSort: () => { window.sortorderHasChanged = true; },
                    onStart: () => {
                        document.querySelectorAll('.section').forEach(el => el.classList.add('short-section'));
                    },
                    onEnd: () => {
                        document.querySelectorAll('.section').forEach(el => el.classList.remove('short-section'));
                    }
                });
            }

            return () => {
                if (sortable.current) {
                    sortable.current.destroy();
                    sortable.current = null;
                }
            };
        }, [store.isSorting]);

        return (
            m('div', { ref: sortableEl },
                m(ListControls, {
                    // actions
                    setIsChanging,
                    setIsSorting,
                    addSection: store.addSection,
                    updateListOrders: store.updateListOrders,

                    // props
                    listid: store.list.listid,
                    isListEmpty,
                    isSorting: store.isSorting
                }),

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
                        (section.items.length < 1 && !store.isSorting) &&
                            m(EmptyRow, {
                                // actions
                                setIsChanging,
                                addItem: store.addItem,

                                // props
                                sectionid: section.sectionid,
                                isChanging: store.isChanging
                            })
                        ,

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