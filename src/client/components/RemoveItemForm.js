import m from '../m.js';
import { setState, removeItem, resetRemoveItemForm } from '../actions.js';

const RemoveItemForm = ({ removeForm }, children) => 
    m('div.flex',
        children,

        m('button.item-control', {
            onclick: resetRemoveItemForm
        },
            m('i.cancel'),
            'cancel'
        ),

        m('button.item-control', {
            onclick: [removeItem, {
                itemid: removeForm.itemid,
                sectionid: removeForm.sectionid
            }]
        },
            m('i.remove'),
            'confirm'
        )
    )
;

export default RemoveItemForm;