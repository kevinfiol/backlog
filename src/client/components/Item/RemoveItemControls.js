import m from '../../m.js';
import Button from '../Button.js';
import { removeItem, resetRemoveItemForm } from '../../actions/Item.js';

const RemoveItemControls = ({ removeForm }) => [
    m(Button, {
        label: 'confirm',
        icon: 'delete',
        className: 'item-control',
        onclick: [removeItem, {
            itemid: removeForm.itemid,
            sectionid: removeForm.sectionid
        }]
    }),

    m(Button, {
        label: 'cancel',
        icon: 'cancel',
        className: 'item-control',
        onclick: resetRemoveItemForm
    })
];

export default RemoveItemControls;