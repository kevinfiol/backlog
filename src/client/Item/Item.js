import m from '../m.js';
import cc from 'classcat';
import { useState } from 'preact/hooks';
import Button from '../components/Button.js';

import AddItem from './AddItem.js';
import EditItem from './EditItem.js';
import RemoveItem from './RemoveItem.js';

const Item = ({ setIsChanging, item, itemPos, isSorting, isChanging, showItems }) => {
    const [state, setState] = useState({
        isAdding: false,
        isEditing: false,
        isRemoving: false
    });

    const initChanges = key => () => {
        setIsChanging(true);
        setState(state => ({ ...state, [key]: true }));
    };

    const finishChanges = key => () => {
        setIsChanging(false);
        setState(state => ({ ...state, [key]: false }));
    };

    const isBeingUsed = state.isAdding || state.isEditing || state.isRemoving;

    return [
        m('tr.item', {
            className: cc({ hide: !showItems, 'cursor-grab': isSorting }),
            key: item.itemid
        },
            (!state.isEditing && !state.isRemoving) && [
                m('td.item-name', item.itemname),
                m('td.item-data', 'link/review'),
                m('td.item-controls',
                    !isChanging &&
                        m(Controls, {
                            item,
                            initEditing: initChanges('isEditing'),
                            initAdding: initChanges('isAdding'),
                            initRemoving: initChanges('isRemoving')
                        })
                    ,
                )
            ],

            state.isEditing &&
                m(EditItem, {
                    onFinish: finishChanges('isEditing'),
                    currentItemname: item.itemname,
                    currentUrl: item.url
                })
            ,

            state.isRemoving &&
                m(RemoveItem, {
                    onFinish: finishChanges('isRemoving'),
                    itemname: item.itemname
                })
            ,
        ),

        state.isAdding &&
            m(AddItem, {
                onFinish: finishChanges('isAdding')
            })
        ,
    ];
};

export default Item;

const Controls = ({ item, initEditing, initAdding, initRemoving }) => [
    m(Button, {
        label: 'edit',
        icon: 'edit',
        className: 'item-control',
        onclick: initEditing
    }),

    m(Button, {
        label: 'add',
        icon: 'add',
        className: 'item-control',
        onclick: initAdding
    }),

    m(Button, {
        label: 'remove',
        icon: 'remove',
        className: 'item-control',
        onclick: initRemoving
    })
];