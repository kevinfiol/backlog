import m from '../m.js';
import { setState } from '../actions.js';

const Item = ({ item, itemPosition, isAdding, isRemoving, isEditing }) => 
    m('li.item',
        m('span', item.itemname),

        !(isAdding || isRemoving || isEditing) &&
            m('div.item-controls',
                m('button.item-control', {
                    onclick: [setState, {
                        item: {
                            isEditing: true,
                            editForm: { itemid: item.itemid, itemname: item.itemname, url: item.url }
                        }
                    }]
                },
                    m('i.edit'),
                    'edit'
                ),

                m('button.item-control', {
                    onclick: [setState, {
                        item: {
                            isAdding: true,
                            addForm: {
                                sectionid: item.sectionid,
                                itemPosition: itemPosition + 1
                            }
                        }
                    }]
                },
                    m('i.add'),
                    'add'
                ),

                m('button.item-control', {
                    onclick: [setState, {
                        item: {
                            isRemoving: true,
                            removeForm: {
                                itemid: item.itemid,
                                sectionid: item.sectionid
                            }
                        }
                    }]
                },
                    m('i.remove'),
                    'remove'
                )
            )
        ,
    )
;

export default Item;