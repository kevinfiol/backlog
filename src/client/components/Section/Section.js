import m from '../../m.js';
import SectionControls from './SectionControls.js';

const Section = ({ section, isSortingSections }, children) => 
    m('div.section',
        m('header.section-header',
            m('h2', section.sectionname),
            !isSortingSections && m(SectionControls)
        ),

        m('table.item-table',
            m('tbody.item-list', { id: section.sectionid },
                children
            )
        )
    )
;

export default Section;