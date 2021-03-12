import m from '../m.js';
import { useState } from 'preact/hooks';
import Button from '../components/Button.js';

import AddItem from './AddItem.js';

const EmptyRow = ({ setIsChanging, addItem, sectionid, isChanging }) => {
    const [isAdding, setIsAdding] = useState(false);

    const initAdding = () => {
        setIsChanging(true);
        setIsAdding(true);
    };

    const finishAdding = () => {
        setIsChanging(false);
        setIsAdding(false);
    };

    return [
        !isAdding &&
            m('div.item.sortable-ignore', { role: 'row' },
                m('div.item-data', { role: 'cell' },
                    m(Button, {
                        label: 'add item',
                        icon: 'add',
                        disabled: isChanging,
                        className: 'item-control',
                        onclick: isChanging ? null : initAdding
                    })
                ),
                m('div.item-data',  { role: 'cell' }, ''),
                m('div.item-data',  { role: 'cell' }, '')
            )
        ,

        isAdding && 
            m(AddItem, {
                // actions
                addItem,
                onFinish: finishAdding,

                // props
                sectionid,
                itemPosition: 0
            })
        ,
    ];
};

export default EmptyRow;