import m from '../../m.js';
import Input from '../Input.js';
import { setState } from '../../actions/init.js';
import { editSection, removeSection, resetEditSectionForm } from '../../actions/Section.js';

const SectionControls = ({ section, sectionState }) => 
    m('div.section-controls',
        (!sectionState.isEditing && !sectionState.isRemoving) && [
            m('button.section-control', {
                onclick: [setState, {
                    section: {
                        isEditing: true,
                        editForm: {
                            sectionid: section.sectionid,
                            sectionname: section.sectionname
                        }
                    }
                }]
            },
                m('i.edit'),
                'rename'
            ),

            m('button.section-control', {
                onclick: [setState, { section: { isRemoving: true } }]
            },
                m('i.remove'),
                'remove'
            )
        ],

        sectionState.isRemoving && [
            m('button.section-control', {
                onclick: [removeSection, { sectionid: section.sectionid }]
            },
                m('i.delete'),
                'confirm'
            ),

            m('button.section-control', {
                onclick: [setState, { section: { isRemoving: false } }]
            },
                m('i.cancel'),
                'cancel'
            )
        ],

        sectionState.isEditing && [
            m(Input, {
                className: 'section-control',
                placeholder: 'name...',
                value: sectionState.editForm.sectionname,
                oninput: (state, e) => [setState, {
                    section: { editForm: { sectionname: e.target.value } }
                }]
            }),

            m('button.section-control', {
                disabled: sectionState.editForm.sectionname.trim().length < 1,
                onclick: sectionState.editForm.sectionname.trim().length < 1 ? null : [editSection, {
                    sectionid: sectionState.editForm.sectionid,
                    sectionname: sectionState.editForm.sectionname
                }]
            },
                m('i.save'),
                'save'
            ),

            m('button.section-control', {
                onclick: resetEditSectionForm
            },
                m('i.cancel'),
                'cancel'
            )
        ]
    )
;

export default SectionControls;