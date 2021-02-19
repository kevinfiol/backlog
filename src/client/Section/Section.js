import m from '../m.js';
import cc from 'classcat';


const Section = ({ section, isSorting, isEditing, children }) => {
    return (
        m('div.section', {
            className: cc({ 'cursor-grab': isSorting })
        },
            m('header.section-header',
                m('h2', { className: cc({ 'opacity-25': isEditing }) }, section.sectionname)
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