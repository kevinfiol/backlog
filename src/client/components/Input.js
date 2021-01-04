import m from '../m.js';

const Input = ({ value, oninput, placeholder, className }) => 
    m('input', {
        type: 'text',
        oninput,
        value,
        placeholder,
        className
    })
;

export default Input;