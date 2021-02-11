import m from '../../m.js';
import Input from '../Input.js';
import { editItem, editItemFormInput, resetEditItemForm } from '../../actions/Item.js';

const EditItemForm = ({ editForm }) => [
    m('td.item-name',
        m(Input, {
            placeholder: 'name...',
            value: editForm.itemname,
            oninput: editItemFormInput('itemname')
        })
    ),

    m('td.item-data',
        m(Input, {
            placeholder: 'url...',
            value: editForm.url,
            oninput: editItemFormInput('url')
        })
    )
];

export default EditItemForm;