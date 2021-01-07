import m from '../../m.js';
import { preventDefault, itemListOnDrop } from '../../actions.js';
import SectionControls from './SectionControls.js';

const Section = ({ section }, children) => 
    m('div.section',
        m('header.section-header',
            m('h2', section.sectionname),
            m(SectionControls)
        ),

        m('table.item-list', {
            ondragover: preventDefault(),
            ondrop: preventDefault([itemListOnDrop, { sectionid: section.sectionid }])
        },
            m('tbody',
                children
            )
        )
    )
;

export default Section;