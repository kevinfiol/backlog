import m from '../../m.js';
import Input from '../Input.js';
import { setState } from '../../actions.js';

const AddItemForm = ({ addForm }) => [
    m('td.item-name',
        m(Input, {
            placeholder: 'new item name...',
            value: addForm.item.itemname,
            oninput: (state, e) => [setState, {
                item: { addForm: { item: { itemname: e.target.value } } }
            }]
        })
    ),

    m('td.item-data',
        m(Input, {
            placeholder: 'url...',
            value: addForm.item.url,
            oninput: (state, e) => [setState, {
                item: { addForm: { item: { url: e.target.value } } }
            }]
        })
    )
];

export default AddItemForm;