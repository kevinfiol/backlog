import m from '../../m.js';
import Input from '../Input.js';
import { setState } from '../../actions/init.js';
import { addSection, resetAddSectionForm } from '../../actions/Section.js';

const ListControls = ({ isSorting, sectionState }) => 
    m('div.list-controls',
        !sectionState.isAdding &&
            [
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
                        onclick: [setState, {
                            section: { isAdding: true }
                        }]
                    },
                        m('i.add'),
                        'add section'
                    )
                ,
            ]
        ,

        sectionState.isAdding &&
            [
                m(Input, {
                    className: 'list-control',
                    placeholder: 'new section name...',
                    value: sectionState.addForm.sectionname,
                    oninput: (state, e) => [setState, {
                        section: { addForm: { sectionname: e.target.value } }
                    }]
                }),

                m('button.list-control.inline', {
                    onclick: [addSection, {
                        sectionname: sectionState.addForm.sectionname
                    }]
                },
                    m('i.add'),
                    'add'
                ),

                m('button.list-control.inline', {
                    onclick: resetAddSectionForm
                },
                    m('i.cancel'),
                    'cancel'
                )
            ]
        ,
    )
;

export default ListControls;