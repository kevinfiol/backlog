import m from '../../m.js';
import Input from '../Input.js';
import Button from '../Button.js';
import {
    editSection,
    removeSection,
    initEditSectionForm,
    editSectionFormInput,
    initRemoveSection,
    resetEditSectionForm,
    resetRemoveSection
} from '../../actions/Section.js';

const SectionControls = ({ section, sectionState, isUserMakingChanges }) => {
    const showMainControls = !sectionState.isEditing && !sectionState.isRemoving;
    const isRemoving = sectionState.isRemoving && sectionState.removeForm.sectionid === section.sectionid;
    const isEditing = sectionState.isEditing && sectionState.editForm.sectionid === section.sectionid;
    const isEditFormValid = sectionState.editForm.sectionname.trim().length > 0;
    const isBeingUsed = isRemoving || isEditing;

    return (
        (isBeingUsed || !isUserMakingChanges) &&
            m('div', {
                class: {
                    'section-controls': true,
                    'is-being-used': isBeingUsed
                }
            },
                showMainControls && [
                    m(Button, {
                        label: 'rename',
                        icon: 'edit',
                        className: 'section-control',
                        onclick: [initEditSectionForm, { section }]
                    }),

                    m(Button, {
                        label: 'remove',
                        icon: 'remove',
                        className: 'section-control',
                        onclick: [initRemoveSection, { sectionid: section.sectionid }]
                    })
                ],

                isRemoving && [
                    m(Button, {
                        label: 'confirm',
                        icon: 'delete',
                        className: 'section-control',
                        onclick: [removeSection, { sectionid: section.sectionid }]
                    }),

                    m(Button, {
                        label: 'cancel',
                        icon: 'cancel',
                        className: 'section-control',
                        onclick: resetRemoveSection
                    })
                ],

                isEditing && [
                    m(Input, {
                        className: 'section-control',
                        placeholder: 'name...',
                        value: sectionState.editForm.sectionname,
                        oninput: editSectionFormInput('sectionname')
                    }),

                    m(Button, {
                        label: 'save',
                        icon: 'save',
                        className: 'section-control',
                        disabled: !isEditFormValid,
                        onclick: !isEditFormValid
                            ? null
                            : [editSection, {
                                sectionid: sectionState.editForm.sectionid,
                                sectionname: sectionState.editForm.sectionname
                            }]
                        ,
                    }),

                    m(Button, {
                        label: 'cancel',
                        icon: 'cancel',
                        className: 'section-control',
                        onclick: resetEditSectionForm
                    })
                ]
            )
    );
};

export default SectionControls;