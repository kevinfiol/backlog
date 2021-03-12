import m from '../m.js';
import cc from 'obj-str';
import { Fragment } from 'preact';
import { useState } from 'preact/hooks';
import Button from '../components/Button.js';

import AddItem from './AddItem.js';
import EditItem from './EditItem.js';
import RemoveItem from './RemoveItem.js';

const Item = ({
    // actions
    setIsChanging,
    addItem,
    editItem,
    removeItem,

    // props
    item,
    itemPos,
    isSorting,
    isChanging,
    showItems
}) => {
    const [state, setState] = useState({
        isAdding: false,
        isEditing: false,
        isRemoving: false
    });

    const initChanges = key => () => {
        setIsChanging(true);
        setState({ [key]: true });
    };

    const finishChanges = key => () => {
        setIsChanging(false);
        setState({ [key]: false });
    };

    return m(Fragment, { key: item.itemid },
        m('div.item', {
            role: 'row',
            className: cc({ hide: !showItems, draggable: isSorting }),
            key: item.itemid,
            'data-id': item.itemid
        },
            (!state.isEditing && !state.isRemoving) && [
                m('div.item-name', { role: 'cell' }, item.itemname),
                m('div.item-data', { role: 'cell' },
                    item.url && m('a.item-url', { href: item.url }, m('i.internet'))
                ),
                m('div.item-controls', { role: 'cell' },
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
                    editItem,
                    onFinish: finishChanges('isEditing'),
                    item
                })
            ,

            state.isRemoving &&
                m(RemoveItem, {
                    removeItem: removeItem,
                    onFinish: finishChanges('isRemoving'),
                    item
                })
            ,
        ),

        state.isAdding &&
            m(AddItem, {
                addItem,
                onFinish: finishChanges('isAdding'),
                itemPosition: itemPos + 1,
                sectionid: item.sectionid
            })
        ,
    );
};

export default Item;

const Controls = ({ initEditing, initAdding, initRemoving }) => [
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