import m from '../m.js';
import Button from '../components/Button.js';

const RemoveSection = ({ removeSection, onFinish, section }) => [
    m('h2', m('em', `remove ${section.sectionname}?`)),

    m(Button, {
        label: 'confirm',
        icon: 'delete',
        className: 'section-control',
        onclick: async () => {
            await removeSection(section.sectionid);
            onFinish();
        }
    }),

    m(Button, {
        label: 'cancel',
        icon: 'cancel',
        className: 'section-control',
        onclick: onFinish
    })
];

export default RemoveSection;