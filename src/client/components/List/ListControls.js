import m from '../../m.js';
import Input from '../Input.js';
import Button from '../Button.js';
import { beginSorting, saveSorting, stopSorting } from '../../actions/Sortable.js';
import { initAddSectionForm, addSection, addSectionFormInput, resetAddSectionForm } from '../../actions/Section.js';

const ListControls = ({ isSorting, sectionState }) => {
    const isAddFormValid = sectionState.addForm.sectionname.trim().length > 0;

    return (
        m('div.list-controls',
            // Default Controls
            !sectionState.isAdding && [
                m(Button, {
                    label: isSorting ? 'save' : 'sort',
                    icon: 'sort',
                    className: 'list-control',
                    onclick: isSorting ? saveSorting : beginSorting
                }),

                !isSorting &&
                    m(Button, {
                        label: 'add section',
                        icon: 'add',
                        className: 'list-control',
                        onclick: initAddSectionForm
                    })
                ,

                isSorting &&
                    m(Button, {
                        label: 'cancel',
                        icon: 'cancel',
                        className: 'list-control',
                        onclick: stopSorting
                    })
                ,
            ],

            sectionState.isAdding && [
                m(Input, {
                    className: 'list-control',
                    placeholder: 'new section name...',
                    value: sectionState.addForm.sectionname,
                    oninput: addSectionFormInput('sectionname')
                }),

                m(Button, {
                    label: 'save',
                    icon: 'save',
                    className: 'list-control',
                    disabled: !isAddFormValid,
                    onclick: !isAddFormValid
                        ? null
                        : [addSection, {
                            sectionname: sectionState.addForm.sectionname
                        }]
                }),

                m(Button, {
                    label: 'cancel',
                    icon: 'cancel',
                    className: 'list-control',
                    onclick: resetAddSectionForm
                })
            ]
        )
    );
}

export default ListControls;