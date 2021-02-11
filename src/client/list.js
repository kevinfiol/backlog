import { app } from 'hyperapp';
import m from './m.js';

import { setIsUserMakingChanges } from './actions/init.js';
import { mountSortableItems, mountSortableList } from './actions/Sortable.js';
import ListControls from './components/List/ListControls.js';
import Item from './components/Item/Item.js';
import Section from './components/Section/Section.js';

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
        m(ListControls, { isSorting: state.isSorting, sectionState: state.section }),

        state.list.sections.map(section =>
            m(Section, {
                section,
                sectionState: state.section,
                isSorting: state.isSorting
            },
                section.items.map((item, index) =>
                    m(Item, {
                        item,
                        showItems: state.showItems,
                        itemPosition: index,
                        itemState: state.item,
                        isSorting: state.isSorting,
                    })
                )
            )
        )
    )
;

app({
    init: initialState,
    view: List,
    node: LIST_CONTAINER,
    // subscriptions: state => [
    //     [
    //         (dispatch, props) => {
    //             const isUserMakingChanges

    //             const isUserMakingChanges = anyTrue([
    //                 props.isSorting,
    //                 props.item.isEditing,
    //                 props.item.isAdding,
    //                 props.item.isRemoving,
    //                 props.section.isEditing,
    //                 props.section.isAdding,
    //                 props.section.isRemoving
    //             ]);

    //             dispatch(setIsUserMakingChanges, { isUserMakingChanges });
    //             return () => undefined;
    //         },
    //         state
    //     ]
    // ]
});

function anyTrue(bools) {
    for (let i = 0, len = bools.length; i < len; i++) {
        if (bools[i]) return true;
    }

    return false;
}