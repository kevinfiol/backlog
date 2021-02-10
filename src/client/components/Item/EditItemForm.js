import m from '../../m.js';
import Input from '../Input.js';
import { setState } from '../../actions/init.js';
import { editItem, resetEditItemForm } from '../../actions/Item.js';

const EditItemForm = ({ editForm }) => [
    m('td.item-name',
        m(Input, {
            placeholder: 'name...',
            value: editForm.itemname,
            oninput: (state, e) => [setState, {
                item: { editForm: { itemname: e.target.value } }
            }]
        })
    ),

    m('td.item-data',
        m(Input, {
            placeholder: 'url...',
            value: editForm.url,
            oninput: (state, e) => [setState, {
                item: { editForm: { url: e.target.value } }
            }]
        })
    )
];

export default EditItemForm;