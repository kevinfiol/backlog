import { app } from 'hyperapp';
import m from './m.js';

app({
    init: { num: 0 },
    view: ({ num }) =>
        m('div',
            m('p', 'hello'),
            m('p', num)
        )
    ,
    node: document.body
});