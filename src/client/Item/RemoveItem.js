import m from '../m.js';
import Button from '../components/Button.js';

const RemoveItem = ({ removeItem, onFinish, item }) => [
    m('div.item-name', { role: 'cell' },
        m('em',
            'Remove ',
            m('b', item.itemname),
            '?'
        )
    ),

    m('div.item-controls.is-being-used', { role: 'cell' },
        m(Button, {
            className: 'item-control',
            label: 'confirm',
            icon: 'delete',
            onclick: async () => {
                await removeItem({ itemid: item.itemid, sectionid: item.sectionid });
                onFinish();
            }
        }),

        m(Button, {
            className: 'item-control',
            label: 'cancel',
            icon: 'cancel',
            onclick: onFinish
        })
    )
];

export default RemoveItem;