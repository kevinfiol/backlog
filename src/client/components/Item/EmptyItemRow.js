import m from '../../m.js';
import Button from '../Button.js';
import AddItemForm from './AddItemForm.js';
import AddItemControls from './AddItemControls.js';
import { initAddItemForm } from '../../actions/Item.js';

const EmptyItemRow = ({ itemState, sectionid }) =>
    m('tr.item',
        !itemState.isAdding &&
            m('td.item-data',
                m(Button, {
                    label: 'add item',
                    icon: 'add',
                    className: 'item-control',
                    onclick: [initAddItemForm, {
                        item: { itemid: null, sectionid },
                        itemPosition: -1
                    }]
                })
            )
        ,

        itemState.isAdding && [
            m(AddItemForm, {
                addForm: itemState.addForm
            }),

            m('td.item-controls',
                m(AddItemControls, {
                    addForm: itemState.addForm
                })
            )
        ],
    )
;

export default EmptyItemRow;