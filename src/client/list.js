import { app } from 'hyperapp';
import m from './m.js';

import { setIsUserMakingChanges } from './actions/init.js';
import { mountSortableItems, mountSortableList } from './actions/Sortable.js';
import ListControls from './components/List/ListControls.js';
import Item from './components/Item/Item.js';
import Section from './components/Section/Section.js';
import EmptyItemRow from './components/Item/EmptyItemRow.js';

const LIST_CONTAINER = document.getElementById('list');
const { list } = window.viewData;

const initialState = {
    list,
    error: null,
    isUserMakingChanges: false,

    sortables: [],
    sorting: {
        movedItems: null
    },

    isSorting: false,
    showItems: true,

    section: {
        isAdding: false,
        isRemoving: false,
        isEditing: false,

        editForm: {
            sectionid: null,
            sectionname: ''
        },
        addForm: {
            sectionname: ''
        },
        removeForm: {
            sectionid: null
        }
    },

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
        m(ListControls, {
            isSorting: state.isSorting,
            isUserMakingChanges: state.isUserMakingChanges,
            sectionState: state.section,
            listIsEmpty: state.list.sections.length < 1
        }),

        state.list.sections.length < 1 &&
            m('div.my4',
                m('em', 'List is currently empty.')
            )
        ,

        state.list.sections.map(section =>
            m(Section, {
                section,
                sectionState: state.section,
                isSorting: state.isSorting,
                isUserMakingChanges: state.isUserMakingChanges
            },
                (section.items.length < 1 && !state.isSorting) &&
                    m(EmptyItemRow, {
                        itemState: state.item,
                        sectionid: section.sectionid,
                        isUserMakingChanges: state.isUserMakingChanges
                    })
                ,

                section.items.length >= 1 &&
                    section.items.map((item, index) =>
                        m(Item, {
                            item,
                            showItems: state.showItems,
                            itemPosition: index,
                            itemState: state.item,
                            isSorting: state.isSorting,
                            isUserMakingChanges: state.isUserMakingChanges
                        })
                    )
                ,
            )
        )
    )
;

app({
    init: initialState,
    view: List,
    node: LIST_CONTAINER
});