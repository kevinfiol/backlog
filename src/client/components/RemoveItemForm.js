import m from '../m.js';
import { setState, removeItem, resetRemoveItemForm } from '../actions.js';

const RemoveItemForm = ({ removeForm }) => 
    m('div.flex',
        m('button.item-control', {
            onclick: [removeItem, {
                itemid: removeForm.itemid,
                sectionid: removeForm.sectionid
            }]
        },
            m('i.remove'),
            'confirm'
        ),

        m('button.item-control', {
            onclick: resetRemoveItemForm
        },
            m('i.cancel'),
            'cancel'
        )
    )
;

export default RemoveItemForm;