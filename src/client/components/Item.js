import m from '../m.js';
import { setState } from '../actions.js';

const Item = ({ item, isAddingItem, isRemovingItem, isEditingItem }) => 
    m('li.item',
        m('span', item.itemname),

        !(isAddingItem || isRemovingItem || isEditingItem) &&
            m('div.item-controls',
                m('button.item-control',
                    m('i.edit'), 'edit'
                ),
                m('button.item-control',
                    { onclick: [setState, { isAddingItem: true }] },
                    m('i.add'), 'add'
                ),
                m('button.item-control',
                    m('i.remove'), 'remove'
                )
            )
    )
;

export default Item;