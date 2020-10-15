import { h, text } from 'hyperapp';
import microh from 'microh';

export default microh((tag, props, ...children) => {
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
});