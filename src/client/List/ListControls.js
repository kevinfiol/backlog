import m from '../m.js';
import { useState } from 'preact/hooks';
import Button from '../components/Button.js';
import Input from '../components/Input.js';

const ListControls = ({
    // actions
    setIsChanging,
    setIsSorting,
    addSection,
    updateListOrders,

    // props
    listid,
    isListEmpty,
    isSorting
}) => {
    const [isAdding, setIsAdding] = useState(false);

    const initSorting = () => {
        window.sortorderHasChanged = false; // prevent api calls when no sorting was done
        setIsSorting(true);
        setIsChanging(true);
    };

    const finishSorting = async () => {
        if (window.sortorderHasChanged) await updateListOrders();
        window.sortorderHasChanged = false;
        setIsSorting(false);
        setIsChanging(false);
    };

    const initAdding = () => {
        setIsChanging(true);
        setIsAdding(true);
    };

    const finishAdding = () => {
        setIsChanging(false);
        setIsAdding(false);
    };

    return (
        m('div.list-controls',
            (!isAdding && !isSorting) && [
                m(Button, {
                    label: 'sort',
                    icon: 'sort',
                    className: 'list-control',
                    disabled: isListEmpty,
                    onclick: initSorting
                }),

                m(Button, {
                    label: 'add section',
                    icon: 'add',
                    className: 'list-control',
                    onclick: initAdding
                })
            ],

            isSorting && [
                m(Button, {
                    label: 'save sorting',
                    icon: 'save',
                    className: 'list-control',
                    onclick: finishSorting
                }),
            ],

            isAdding &&
                m(AddSection, {
                    // actions
                    addSection,
                    onFinish: finishAdding,

                    // props
                    listid
                })
            ,
        )
    );
};

export default ListControls;

const AddSection = ({ addSection, onFinish, listid }) => {
    const [sectionname, setSectionname] = useState('');
    const isDisabled = sectionname.trim().length < 1;

    async function saveChanges() {
        await addSection({ listid, sectionname });
        onFinish();
    }

    return [
        m(Input, {
            className: 'list-control',
            placeholder: 'new section name...',
            value: sectionname,
            oninput: (ev) => setSectionname(ev.target.value)
        }),

        m(Button, {
            label: 'save',
            icon: 'save',
            className: 'list-control',
            disabled: isDisabled,
            onclick: isDisabled ? null : saveChanges
        }),

        m(Button, {
            label: 'cancel',
            icon: 'cancel',
            className: 'list-control',
            onclick: onFinish
        })
    ];
};