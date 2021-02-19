import m from '../m.js';
import cc from 'classcat';
import { useState } from 'preact/hooks';

const Item = ({ item, itemPos, isSorting, isUserMakingChanges, showItems }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const isBeingUsed = isAdding || isEditing || isRemoving;

    return [
        m('tr.item', {
            className: cc({ hide: !showItems, 'cursor-grab': isSorting }),
            key: item.itemid
        },
            m('td.item-name', item.itemname),
            m('td.item-data', 'link/review'),

            m('td.item-controls', {
                className: cc({ 'is-being-used': isBeingUsed })
            },
                m('p', 'controls go here')
            )
        )
    ];
};

export default Item;