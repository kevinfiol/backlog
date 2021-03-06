import m from '../m.js';
import { useState, useRef } from 'preact/hooks';
import Button from '../components/Button.js';
import Input from '../components/Input.js';
import AutoInput from '../components/AutoInput.js';
import createGameSource from './createGameSource.js';

const AddItem = ({ addItem, onFinish, itemPosition, sectionid }) => {
    const controller = useRef(null);
    const [itemname, setItemname] = useState('');
    const [url, setUrl] = useState('');
    const isDisabled = itemname.trim().length < 1;

    async function saveChanges() {
        await addItem({ item: { itemname, url }, sectionid, itemPosition });
        onFinish();
    }

    return (
        m('div.item', { role: 'row' },
            m('div.item-name', { role: 'cell' },
                m(AutoInput, {
                    config: {
                        placeholder: 'new item name...',
                        onSelect: (choice) => {
                            setUrl(url => {
                                if (url.trim().length < 1 && choice.url.trim().length > 1) return choice.url;
                                else return url;
                            });
                        },
                        onValue: (value) => {
                            setItemname(value);
                        },
                        source: createGameSource(controller.current)
                    }
                })
            ),

            m('div.item-data', { role: 'cell' },
                m(Input, {
                    placeholder: 'url...',
                    value: url,
                    oninput: (ev) => setUrl(ev.target.value)
                })
            ),

            m('div.item-controls.is-being-used', { role: 'cell' },
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