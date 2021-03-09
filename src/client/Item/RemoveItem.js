import m from '../m.js';
import Button from '../components/Button.js';

const RemoveItem = ({ removeItem, onFinish, item }) => [
    m('td.item-name',
        m('em',
            'Remove ',
            m('b', item.itemname),
            '?'
        )
    ),

    m('td.item-data',
        // empty cell
    ),

    m('td.item-controls.is-being-used',
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