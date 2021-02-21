import m from '../m.js';
import { useState } from 'preact/hooks';
import Button from '../components/Button.js';
import Input from '../components/Input.js';

const EditItem = ({ onFinish, currentItemname, currentUrl }) => {
    const [itemname, setItemname] = useState(currentItemname);
    const [url, setUrl] = useState(currentUrl);
    const isDisabled = itemname.trim().length < 1;

    return [
        m('td.item-name',
            m(Input, {
                placeholder: 'item name...',
                value: itemname,
                oninput: (ev) => setItemname(ev.target.value)
            }),
        ),

        m('td.item-data',
            m(Input, {
                placeholder: 'url...',
                value: url,
                oninput: (ev) => setUrl(ev.target.value)
            })
        ),

        m('td.item-controls.is-being-used',
            m(Button, {
                className: 'item-control',
                label: 'save',
                icon: 'save',
                disabled: isDisabled,
                onclick: isDisabled
                    ? null
                    : () => {
                        console.log('edit item', itemname);
                        onFinish();
                    }
                ,
            }),

            m(Button, {
                className: 'item-control',
                label: 'cancel',
                icon: 'cancel',
                onclick: onFinish
            })
        )
    ];
};

export default EditItem;