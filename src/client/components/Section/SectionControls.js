import m from '../../m.js';

const SectionControls = () => 
    m('div.section-controls',
        m('button.section-control', {
            onclick: undefined
        },
            m('i.edit'),
            'rename'
        ),

        m('button.section-control', {
            onclick: undefined
        },
            m('i.remove'),
            'remove'
        )
    )
;

export default SectionControls;