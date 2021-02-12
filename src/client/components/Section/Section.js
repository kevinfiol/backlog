import m from '../../m.js';
import SectionControls from './SectionControls.js';

const Section = ({ section, sectionState, isSorting }, children) => {
    const isEditing = sectionState.isEditing && sectionState.editForm.sectionid == section.sectionid;

    return (
        m('div', {
            class: { section: true, 'cursor-grab': isSorting },
            'data-id': section.sectionid,
            key: section.sectionid
        },
            m('header.section-header',
                isSorting &&
                    m('div.section-handle', m('i.move'))
                ,

                m('h2', {
                    class: { 'opacity-25': isEditing }
                },
                    section.sectionname
                ),

                !isSorting &&
                    m(SectionControls, { section, sectionState })
                ,
            ),

            m('table.item-table',
                m('tbody.item-list', {
                    'data-id': section.sectionid
                },
                    children
                )
            )
        )
    );
};

export default Section;