import m from '../../m.js';
import { removeSection } from '../../actions.js';

const SectionControls = ({ sectionid }) => 
    m('div.section-controls',
        m('button.section-control', {
            onclick: undefined
        },
            m('i.edit'),
            'rename'
        ),

        m('button.section-control', {
            onclick: [removeSection, { sectionid: sectionid }]
        },
            m('i.remove'),
            'remove'
        )
    )
;

export default SectionControls;