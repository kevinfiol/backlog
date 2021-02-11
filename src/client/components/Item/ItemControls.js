import m from '../../m.js';
import Button from '../Button.js';
import { initEditItemForm, initAddItemForm, initRemoveItem } from '../../actions/Item.js';

const ItemControls = ({ item, itemPosition }) => [
    m(Button, {
        label: 'edit',
        icon: 'edit',
        className: 'item-control',
        onclick: [initEditItemForm, { item }]
    }),

    m(Button, {
        label: 'add',
        icon: 'add',
        className: 'item-control',
        onclick: [initAddItemForm, { item, itemPosition }]
    }),

    m(Button, {
        label: 'remove',
        icon: 'remove',
        className: 'item-control',
        onclick: [initRemoveItem, { item }]
    })
];

export default ItemControls;