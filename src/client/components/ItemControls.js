import m from '../m.js';
import { setState } from '../actions.js';

const ItemControls = ({ item, itemPosition }) => 
    m('div.item-controls',
        m('button.item-control', {
            onclick: [setState, {
                item: {
                    itemid: item.itemid,
                    isEditing: true,
                    editForm: {
                        itemid: item.itemid,
                        itemname: item.itemname,
                        url: item.url
                    }
                }
            }]
        },
            m('i.edit'),
            'edit'
        ),

        m('button.item-control', {
            onclick: [setState, {
                item: {
                    itemid: item.itemid,
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
                    itemid: item.itemid,
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
;

export default ItemControls;