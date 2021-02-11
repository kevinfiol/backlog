import m from '../../m.js';
import Input from '../Input.js';
import { addItemFormInput } from '../../actions/Item.js';

const AddItemForm = ({ addForm }) => [
    m('td.item-name',
        m(Input, {
            placeholder: 'new item name...',
            value: addForm.item.itemname,
            oninput: addItemFormInput('itemname')
        })
    ),

    m('td.item-data',
        m(Input, {
            placeholder: 'url...',
            value: addForm.item.url,
            oninput: addItemFormInput('url')
        })
    )
];

export default AddItemForm;