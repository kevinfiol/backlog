import m from '../../m.js';
import SectionControls from './SectionControls.js';

const Section = ({ section }, children) => 
    m('div.section',
        m('header.section-header',
            m('h2', section.sectionname),
            m(SectionControls)
        ),

        m('table',
            m('tbody.item-list',
                children
            )
        )
    )
;

export default Section;