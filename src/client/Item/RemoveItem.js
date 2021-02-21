import m from '../m.js';
import Button from '../components/Button.js';

const RemoveItem = ({ onFinish, itemname }) => [
    m('td.item-name',
        m('em',
            'Remove ',
            m('b', itemname),
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
            onclick: () => {
                console.log('delete: ' + itemname);
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