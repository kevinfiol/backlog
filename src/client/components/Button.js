import m from '../m.js';

const Button = ({ onclick, className, disabled, label, icon, children }) => 
    m('button', {
        className,
        onclick,
        disabled
    },
        icon !== undefined &&
            m(`i.${icon}`)
        ,
        label !== undefined ? label : children
    )
;

export default Button;