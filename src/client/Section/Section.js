import m from '../m.js';
import cc from 'obj-str';
import { useState } from 'preact/hooks';
import Button from '../components/Button.js';

import EditSection from './EditSection.js';
import RemoveSection from './RemoveSection.js';

const Section = ({
    // actions
    setIsChanging,
    editSection,
    removeSection,

    // props
    section,
    isSorting,
    isChanging,
    children
}) => {
    const [state, setState] = useState({
        isEditing: false,
        isRemoving: false
    });

    const initChanges = key => () => {
        setIsChanging(true);
        setState({ [key]: true });
    };

    const finishChanges = key => () => {
        setIsChanging(false);
        setState({ [key]: false });
    };

    return (
        m('div.section', {
            key: section.sectionid,
            className: cc({ 'cursor-grab': isSorting })
        },
            m('header.section-header',
                (!state.isEditing && !state.isRemoving) && [
                    m('h2', section.sectionname),

                    !isSorting &&
                        m('div.section-controls',
                            m(Controls, {
                                initEditing: initChanges('isEditing'),
                                initRemoving: initChanges('isRemoving')
                            })
                        )
                    ,
                ],

                state.isEditing &&
                    m(EditSection, {
                        editSection,
                        onFinish: finishChanges('isEditing'),
                        section
                    })
                ,

                state.isRemoving &&
                    m(RemoveSection, {
                        removeSection,
                        onFinish: finishChanges('isRemoving'),
                        section
                    })
                ,
            ),

            m('table.item-table',
                m('tbody.item-list',
                    children
                )
            )
        )
    );
}

export default Section;

const Controls = ({ initEditing, initRemoving }) => [
    m(Button, {
        label: 'rename',
        icon: 'edit',
        className: 'section-control',
        onclick: initEditing
    }),

    m(Button, {
        label: 'remove',
        icon: 'remove',
        className: 'section-control',
        onclick: initRemoving
    })
];