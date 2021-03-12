import m from '../m.js';
import { useState } from 'preact/hooks';
import Button from '../components/Button.js';
import Input from '../components/Input.js';

const EditSection = ({ editSection, onFinish, section }) => {
    const [sectionname, setSectionname] = useState(section.sectionname);
    const isDisabled = sectionname.trim().length < 1;

    async function saveChanges() {
        await editSection({ sectionid: section.sectionid, sectionname });
        onFinish();
    }

    return [
        m(Input, {
            className: 'section-control',
            placeholder: 'name...',
            value: sectionname,
            oninput: (ev) => setSectionname(ev.target.value)
        }),

        m('div.section-controls',
            m(Button, {
                label: 'save',
                icon: 'save',
                className: 'section-control',
                disabled: isDisabled,
                onclick: isDisabled ? null : saveChanges
            }),

            m(Button, {
                label: 'cancel',
                icon: 'cancel',
                className: 'section-control',
                onclick: onFinish
            })
        )
    ];
};

export default EditSection;