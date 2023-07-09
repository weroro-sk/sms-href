/**
 * @description Check if value is an object (Object | Array)
 *
 * @param value
 */
export const isObject = <T>(value: T): value is T => {
    return typeof value === 'object' && value !== null;
}

/**
 * @description Merges two objects
 *
 * @param target Will be updated
 * @param source Object with update data
 */
export const objectExtend = (target: object | Array<unknown>, source: object | Array<unknown>): void => {
    if (!isObject(target) || !isObject(source))
        return;

    for (let key in source) {
        const value: any = Reflect.get(source, key);
        if (isObject(value))
            objectExtend(Reflect.get(target, key), value);
        else
            Reflect.set(target, key, value);
    }
}
