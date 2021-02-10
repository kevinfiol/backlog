import m from '../../m.js';
import { setState } from '../../actions/init.js';
import { removeItem, resetRemoveItemForm } from '../../actions/Item.js';

const RemoveItemControls = ({ removeForm }) => [
    m('button.item-control', {
        onclick: [removeItem, {
            itemid: removeForm.itemid,
            sectionid: removeForm.sectionid
        }]
    },
        m('i.delete'),
        'confirm'
    ),

    m('button.item-control', {
        onclick: resetRemoveItemForm
    },
        m('i.cancel'),
        'cancel'
    )
];

export default RemoveItemControls;