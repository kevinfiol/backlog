import m from '../../m.js';
import SectionControls from './SectionControls.js';

const Section = ({ section, isSorting }, children) => 
    m('div.section', { id: section.sectionid },
        m('header.section-header',
            isSorting && m('div.section-handle', m('i.move')),
            m('h2', section.sectionname),
            !isSorting && m(SectionControls, { sectionid: section.sectionid })
        ),

        m('table.item-table',
            m('tbody.item-list', { id: section.sectionid },
                children
            )
        )
    )
;

export default Section;