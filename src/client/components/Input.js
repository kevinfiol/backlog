import m from '../m.js';

const Input = ({ value, update }) => 
    m('input', { type: 'text', oninput: update, value })
;

module.exports = Input;