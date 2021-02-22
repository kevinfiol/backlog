import m from '../m.js';
import { useState } from 'preact/hooks';
import Button from '../components/Button.js';
import Input from '../components/Input.js';

const AddItem = ({ addItem, onFinish, itemPosition, sectionid }) => {
    const [itemname, setItemname] = useState('');
    const [url, setUrl] = useState('');
    const isDisabled = itemname.trim().length < 1;

    async function saveChanges() {
        await addItem({ item: { itemname, url }, sectionid, itemPosition });
        onFinish();
    }

    return (
        m('tr.item',
            m('td.item-name',
                m(Input, {
                    placeholder: 'new item name...',
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
                    onclick: isDisabled ? null : saveChanges
                }),

                m(Button, {
                    className: 'item-control',
                    label: 'cancel',
                    icon: 'cancel',
                    onclick: onFinish
                })
            )
        )
    );
};

export default AddItem;