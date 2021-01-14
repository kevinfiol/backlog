import m from '../../m.js';
import { preventDefault, itemListOnDrop } from '../../actions.js';
import SectionControls from './SectionControls.js';

const Section = ({ section }, children) => 
    m('div.section',
        m('header.section-header',
            m('h2', section.sectionname),
            m(SectionControls)
        ),

        m('table.item-list',
            m('tbody', {
                ondragover: preventDefault(),
                ondrop: preventDefault([itemListOnDrop, { sectionid: section.sectionid }])
            },
                children
            )
        )
    )
;

export default Section;