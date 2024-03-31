/**
 * Takes a string and produces a union of its individual characters.
 *
 * @template T - The input string type.
 * @param {string} value - The string from which to derive the union.
 * @returns {string} Union of individual characters from the input string.
 * @example
 * type HelloUnion = UnionFromString<'hello'>; // 'h' | 'e' | 'l' | 'o'
 */
type UnionFromString<T extends string> = T extends `${infer L}${infer R}` ? L | UnionFromString<R> : Exclude<T, string>;

/**
 * Converts letters to their corresponding phone numbers as per the standard telephone keypad mapping.
 * Non-alphabetic characters remain unchanged.
 *
 * @param {string} value - The string containing letters to be converted.
 * @returns {string} The string with letters converted to phone numbers.
 * @example
 * lettersToPhoneNumber("Hello, World!"); // Returns '43556, 96753!'
 */
export const lettersToPhoneNumber = <T extends string, U = UnionFromString<T>>(value: T): string => {
    // Indicates whether the current letter is found in any group
    let foundFlag: 0 | 1;
    // Represents the current letter being processed
    let letter: U | string;
    // Represents the index of the letter group in the letterGroups array
    let groupIndex: keyof typeof letterGroups;

    // Output string containing converted letters
    let output: string = '';
    // Array of letter groups corresponding to phone keypad numbers
    let letterGroups = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'] as const;

    // Iterate through each letter in the input value
    for (letter of [...(value || '').toUpperCase()]) {
        // Reset found flag for each letter
        foundFlag = 0;

        // Iterate through each letter group to find a match
        for (groupIndex in letterGroups) {
            // If the current letter is found in the current letter group
            if (letterGroups[groupIndex].includes(letter)) {
                // Append the corresponding phone keypad number to the output
                output += +(groupIndex as string) + 2; // +2 because the phone keypad numbers start from 2
                // Set found flag to true
                foundFlag = 1;
                // Exit the loop once a match is found
                break;
            }
        }

        // If the current letter is not found in any group
        if (!foundFlag) {
            // Append the original letter to the output
            output += letter;
        }
    }

    // Return the final converted string
    return output;
}


/**
 * Encodes/decodes a value.
 *
 * @param {string} value - The value to encode.
 * @param {0|1} [decode] - The type of encoding to use.
 *                          - `0 | undefined` - Encode
 *                          - `1` - Decode
 * @returns {string} The encoded or decoded value.
 *
 * @private
 * @example
 * const encodedValue = messageCoder("Hello, world!"); // Example encoding a value
 * console.log(encodedValue); // Output: 'Hello%2C%20world%21'
 *
 * const decodedValue = messageCoder("Hello%2C%20world%21", 1); // Example decoding a value
 * console.log(decodedValue); // Output: 'Hello, world!'
 *
 * const errorDecodeValue = messageCoder("Tax is 20%", 1); // Example error decoding a value
 * console.log(errorDecodeValue); // Output: 'Tax is 20%'
 */
export const messageCoder = (value: string, decode?: 0 | 1): string => {
    try {
        value = decode
            ? decodeURIComponent(value)
            : encodeURIComponent(value);
    } catch {
    }
    return value;
}
