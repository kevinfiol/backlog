import m from '../m.js';
import { useRef, useEffect } from 'preact/hooks';
import Etto from 'etto';

const AutoInput = ({ initialValue, config, choices }) => {
    const ettoContainer = useRef(null);
    const etto = useRef(null);

    // on mount, initialize Etto
    useEffect(() => {
        if (ettoContainer.current && !etto.current) {
            etto.current = new Etto(
                ettoContainer.current,
                (config || {}),
                choices || undefined
            );

            // initial value
            if (initialValue && initialValue.trim()) etto.current.value = initialValue;
        }

        return () => {
            etto.current.destroy();
            delete etto.current;
        };
    }, []);

    return m('div', { ref: ettoContainer });
};

export default AutoInput;