import m from '../m.js';
import { setState, removeItem } from '../actions.js';

const RemoveItemForm = ({ itemToRemove }) => 
    m('div.flex',
        m('button.item-control', {
            onclick: [removeItem, {
                itemid: itemToRemove.itemid,
                sectionid: itemToRemove.sectionid
            }]
        },
            m('i.remove'),
            'confirm'
        ),

        m('button.item-control', {
            onclick: [setState, {
                isRemovingItem: false,
                itemToRemove: { itemid: null, sectionid: null }
            }]
        },
            m('i.cancel'),
            'cancel'
        )
    )
;

export default RemoveItemForm;