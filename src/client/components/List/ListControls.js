import m from '../../m.js';
import { setState } from '../../actions.js';

const ListControls = ({ isSortingItems, isSortingSections }) => 
    m('div.list-controls',
        (!isSortingItems && !isSortingSections) &&
            m('button.list-control', {
                onclick: undefined
            },
                m('i.add'),
                'add section'
            )
        ,

        (!isSortingItems) &&
            m('button.list-control', {
                onclick: [setState, {
                    isSortingSections: !isSortingSections
                }]
            },
                m('i.sort'),
                isSortingSections ? 'finish sorting' : 'sort sections'
            )
        ,

        (!isSortingSections) &&
            m('button.list-control', {
                onclick: [setState, {
                    isSortingItems: !isSortingItems
                }]
            },
                m('i.sort'),
                isSortingItems ? 'finish sorting' : 'sort items'
            )
        ,
    )
;

export default ListControls;