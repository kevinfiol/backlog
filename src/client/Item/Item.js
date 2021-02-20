import m from '../m.js';
import cc from 'classcat';
import { useState } from 'preact/hooks';
import Button from '../components/Button.js';
import ConfirmBtn from '../components/ConfirmBtn.js';

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

    const isBeingUsed = state.isAdding || state.isEditing || state.isRemoving;

    return [
        m('tr.item', {
            className: cc({ hide: !showItems, 'cursor-grab': isSorting }),
            key: item.itemid
        },
            m('td.item-name', item.itemname),
            m('td.item-data', 'link/review'),
            m('td.item-controls',
                m(ItemControls, {
                    item,
                    initEditing: initChanges('isEditing'),
                    initAdding: initChanges('isAdding'),
                    initRemoving: initChanges('isRemoving')
                })
            )
        )
    ];
};

export default Item;

const ItemControls = ({ item, initEditing, initAdding, initRemoving }) => [
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