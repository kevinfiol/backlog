import m from '../m.js';
import cc from 'obj-str';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';
import { useState, useRef, useEffect } from 'preact/hooks';
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
    const sortable = useRef(null);
    const sortableEl = useRef(null);

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

    useEffect(() => {
        if (isSorting && sortableEl.current && !sortable.current) {
            sortable.current = Sortable.create(sortableEl.current, {
                animation: 100,
                draggable: '.draggable',
                dataIdAttr: 'data-id'
            });
        }

        return () => {
            if (sortable.current) {
                sortable.current.destroy();
                sortable.current = null;
            }
        };
    }, [isSorting]);

    return (
        m('div.section', {
            key: section.sectionid,
            className: cc({ 'draggable': isSorting }),
            draggable: isSorting,
            'data-id': section.sectionid
        },
            m('header.section-header',
                (!state.isEditing && !state.isRemoving) && [
                    m('h2', section.sectionname),

                    (!isSorting && !isChanging) &&
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
                m('tbody.item-list', { ref: sortableEl },
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