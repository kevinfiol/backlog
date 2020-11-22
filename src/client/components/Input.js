import m from '../m.js';

const Input = ({ value, oninput, placeholder, className }) => 
    m('input.mr1', {
        type: 'text',
        oninput,
        value,
        placeholder,
        className
    })
;

export default Input;