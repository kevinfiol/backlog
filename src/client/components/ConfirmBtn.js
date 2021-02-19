import m from '../m.js';
import Button from './Button.js';
import { useState } from 'preact/hooks';

const ConfirmBtn = ({ onclick, className, disabled, label, icons: { init, confirm } }) => {
    const [isConfirming, setIsConfirming] = useState(false);

    return [
        isConfirming ? [
            m(Button, {
                className,
                onclick: () => {
                    onclick(),
                    setIsConfirming(false);
                },
                label: 'confirm',
                icon: confirm
            }),

            m(Button, {
                onclick: () => setIsConfirming(false),
                className,
                label: 'cancel',
                icon: 'cancel',
            })
        ]
        :
        m(Button, {
            onclick: () => setIsConfirming(true),
            label,
            className,
            disabled,
            icon: init
        })
    ];
};

export default ConfirmBtn;