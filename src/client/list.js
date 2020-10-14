import { h, text, app } from 'hyperapp';
import microh from 'microh';

const m = microh(hyperappAdapter);

app({
    init: { num: 0 },
    view: ({ num }) =>
        m('div',
            m('p', 'hello'),
            m('p', num)
        )
    ,
    node: document.body
});

function hyperappAdapter(tag, props, ...children) {
    return typeof tag === "function"
        ? tag(props, children)
        : h(
            tag,
            props || {},
            []
                .concat(...children)
                .flat(Infinity)
                .map((any) =>
                    typeof any === "string" || typeof any === "number" ? text(any) : any
                )
        )
    ;
}