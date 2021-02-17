import m from '../../m.js';
import Button from '../Button.js';
import AddItemForm from './AddItemForm.js';
import AddItemControls from './AddItemControls.js';
import { initAddItemForm } from '../../actions/Item.js';

const EmptyItemRow = ({ itemState, sectionid, isUserMakingChanges }) => {
    const isAdding = itemState.isAdding && sectionid === itemState.addForm.sectionid;

    return (
        m('tr.item.sortable-ignore',
            !isAdding &&
                m('td.item-data',
                    m(Button, {
                        label: 'add item',
                        icon: 'add',
                        disabled: isUserMakingChanges,
                        className: 'item-control',
                        onclick: [initAddItemForm, {
                            item: { itemid: null, sectionid },
                            itemPosition: -1
                        }]
                    })
                )
            ,

            isAdding && [
                m(AddItemForm, {
                    addForm: itemState.addForm
                }),

                m('td.item-controls.is-being-used',
                    m(AddItemControls, {
                        addForm: itemState.addForm
                    })
                )
            ],
        )
    );
};

export default EmptyItemRow;