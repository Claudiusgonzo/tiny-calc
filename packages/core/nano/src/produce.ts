/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IVectorProducer, IProducer } from "./types";

const unitFn = () => {};

const props = {
    open: { value: function() { return this; }},
    removeConsumer: { value: unitFn },
    get: { value: function(key: PropertyKey) { return (this as any)[key]; }},
}

const vectorProps = {
    ...props,
    openVector: props.open,
    removeVectorConsumer: props.removeConsumer,
    getItem: props.get,
}

export function produce<T>(subject: ArrayLike<T>): IProducer<ArrayLike<T>> & IVectorProducer<T>;
export function produce<T extends Readonly<object>>(subject: T): IProducer<T>;
export function produce<T extends Readonly<object>>(subject: T): IProducer<T> {
    if ((subject as any).removeConsumer === unitFn) {
        return subject as any;
    }

    Object.defineProperties(subject,
        Array.isArray(subject)
            ? vectorProps
            : props);

    for (const value of Object.values(subject)) {
        if (typeof value === "object" && value) {
            produce(value);
        }
    }

    return subject as any;
}
