/**
 * @description Check if value is an object (Object | Array)
 *
 * @param value
 */
export const isObject = (value: any): boolean => {
    return typeof value !== null && typeof value === 'object'
}

/**
 * @description Merges two objects
 *
 * @param target Will be updated
 * @param source Object with update data
 */
export const merge = (target: any, source: any): void => {
    if (!isObject(target) || !isObject(source))
        return;

    for (const key in source) {
        const value: any = source[key];
        if (isObject(value))
            merge(target[key], value);
        else
            target[key] = value;
    }
}
