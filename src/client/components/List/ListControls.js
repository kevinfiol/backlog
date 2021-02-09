import m from '../../m.js';
import { setState } from '../../actions.js';

const ListControls = ({ isSorting }) => 
    m('div.list-controls',
        m('button.list-control', {
            onclick: [setState, {
                isSorting: !isSorting
            }]
        },
            m('i.sort'),
            isSorting ? 'finish sorting' : 'sort'
        ),

        !isSorting &&
            m('button.list-control', {
                onclick: undefined
            },
                m('i.add'),
                'add section'
            )
        ,
    )
;

export default ListControls;