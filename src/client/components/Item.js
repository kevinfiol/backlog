import m from '../m.js';
import { setState } from '../actions.js';

const Item = ({ item, sectionid, itemPosition, isAddingItem, isRemovingItem, isEditingItem }) => 
    m('li.item',
        m('span', item.itemname),

        !(isAddingItem || isRemovingItem || isEditingItem) &&
            m('div.item-controls',
                m('button.item-control', {
                    onclick: [setState, {
                        isEditingItem: true,
                        itemToEdit: {
                            itemid: item.itemid,
                            itemname: item.itemname,
                            url: item.url
                        }
                    }]
                },
                    m('i.edit'),
                    'edit'
                ),

                m('button.item-control', {
                    onclick: [setState, {
                        isAddingItem: true,
                        itemToAdd: {
                            sectionid,
                            itemPosition: itemPosition + 1
                        }
                    }]
                },
                    m('i.add'),
                    'add'
                ),

                m('button.item-control', {
                    onclick: [setState, {
                        isRemovingItem: true
                    }]
                },
                    m('i.remove'),
                    'remove'
                )
            )
    )
;

export default Item;