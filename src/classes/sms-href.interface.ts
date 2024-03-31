import {Message, TContext} from "./types";
import TSmsHrefValue = Message.TSmsHrefValue;
import TPhone = Message.TPhone;
import TMessage = Message.TMessage;

export interface ISmsHref {
    /**
     * Fixes all SMS hrefs within a given context.
     *
     * @param {TContext} [context=document] - The context within which to fix SMS hrefs.
     * @param {boolean} [shouldBypassNodeJs=false] Flag indicating whether to bypass execution in Node.js environment. Default is false.
     * @returns {Promise<boolean>} A promise resolving to true if any hrefs were fixed, otherwise false.
     *
     * @example
     * await smsHrefInstance.fixAll(document.body); // Example fixing all SMS hrefs within the document body
     */
    fixAll(context?: TContext, shouldBypassNodeJs?: boolean): Promise<number>;

    /**
     * Fixes a single SMS href value.
     *
     * @param {TSmsHrefValue} value - The SMS href value to fix.
     * @returns {Promise<TSmsHrefValue>} A promise resolving to the fixed SMS href value.
     *
     * @example
     * const fixedHref = await smsHrefInstance.fixValue('sms:123456789?body=Hello%2C%20world'); // Example fixing a single SMS href
     * console.log(fixedHref); // Output: 'sms:123456789?body=Hello%2C%20world' (If no transformation or changes applied)
     */
    fixValue<T extends TSmsHrefValue>(value: T): Promise<TSmsHrefValue | null>;

    /**
     * Creates a new SMS href based on the provided phone number and message.
     *
     * @param {TPhone} phone - The phone number for the SMS.
     * @param {TMessage} message - The message body for the SMS.
     * @returns {Promise<TSmsHrefValue | null>} A promise resolving to the generated SMS href value.
     *
     * @example
     * const newHref = await smsHrefInstance.create('123456789', "Hello, world!"); // Example creating a new SMS href
     * console.log(newHref); // Output: 'sms:123456789?body=Hello%2C%20world%21' (If no transformation or changes applied)
     */
    create(phone: TPhone, message: TMessage): Promise<TSmsHrefValue | null>;
}
