import {isAndroid, isIOS} from "../detectors";
import {
    SEPARATOR_ANDROID,
    SEPARATOR_IOS,
    SEPARATOR_IOS_7,

    STATUS_IS_NODE_JS,
    STATUS_NO_SMS_HREFS,
    STATUS_SEPARATOR_NOT_DEFINED,
    STATUS_SMS_HREFS_FIXED
} from "../contants";
// types
import {Constructor, Message, TContext} from "./types";
import TSeparator = Message.TSeparator;
import TMiddlewareFunction = Constructor.TMiddlewareFunction;
import TExcept = Constructor.TExcept;
import TSmsHrefValue = Message.TSmsHrefValue;
import TPhone = Message.TPhone;
import TMessage = Message.TMessage;
import TSegments = Message.TSegments;
import TOptions_PIAPI = Constructor.TOptions_PIAPI;


const replace = (str: string, searchValue: string | RegExp, replaceValue: string = ''): string =>
    str?.replace(searchValue, replaceValue);

/**
 * Class representing a utility for generating and fixing SMS hrefs.
 */
export class SmsHref_PIAPI {

    /**
     * Separator to be used in SMS hrefs.
     *
     * @private
     * @readonly
     */
    private readonly _separator: TSeparator | null;

    /**
     * Function to transform phone number value.
     *
     * @private
     * @readonly
     */
    private readonly _phoneMiddleware: TMiddlewareFunction;

    /**
     * Function to transform message value.
     *
     * @private
     * @readonly
     */
    private readonly _messageMiddleware: (value: string) => string;

    /**
     *
     * @private
     * @readonly
     */
    private readonly _textEncoder: (value: string, decode?: 0 | 1) => string;

    /**
     * Constructs an instance of SmsHref_PIAPI.
     *
     * @param {TOptions} [opt] - Options for SmsHref_PIAPI.
     *
     * @example
     * const smsHrefInstance = new SmsHref_PIAPI({
     *     except: [false, true, false], // Example except array
     *     separator: SEPARATOR_ANDROID, // Example custom separator
     *     encode: true, // Example encoding enabled
     *     transform: (value: string) => '+1' + value // Example custom transform function adding country code
     * });
     */
    public constructor(opt?: TOptions_PIAPI) {
        // Determine separator based on provided options or platform
        this._separator = this._getSeparator(opt?.__separator, opt?.__except);
        const identityFunction = (value: string): string => value;
        // Assign middleware functions or use identity function
        this._phoneMiddleware = opt?.__phoneMiddleware || identityFunction;
        this._messageMiddleware = opt?.__messageMiddleware || identityFunction;

        this._textEncoder = opt?.__textEncoder || identityFunction;
    }

    /**
     * Fixes all SMS hrefs within a given context.
     *
     * @param {TContext} [context=document] - The context within which to fix SMS hrefs.
     * @param {boolean} [shouldBypassNodeJs=false] Flag indicating whether to bypass execution in Node.js environment. Default is false.
     * @returns {Promise<boolean>} A promise resolving to true if any hrefs were fixed, otherwise false.
     *
     * @example
     * await smsHrefInstance.__fixAll(document.body); // Example fixing all SMS hrefs within the document body
     */
    public async __fixAll(context?: TContext, shouldBypassNodeJs?: boolean): Promise<{
        code: number,
        errors?: HTMLAnchorElement[]
    }> {

        let anchor: HTMLAnchorElement;
        let anchors: NodeListOf<HTMLAnchorElement>;
        let value: Message.TSmsHrefValue | null;
        let errors: HTMLAnchorElement[] = [];

        // Check if running in Node.js
        if (typeof window === 'undefined' && !shouldBypassNodeJs) {
            return {code: STATUS_IS_NODE_JS};
        }

        // Check if separator is not defined
        if (!this._separator) {
            return {code: STATUS_SEPARATOR_NOT_DEFINED};
        }

        // Check if no anchor elements with SMS hrefs are found in the given context.
        if (!(anchors = (context || document).querySelectorAll('a[href^="sms:"]')).length) {
            return {code: STATUS_NO_SMS_HREFS};
        }

        // Iterate over found anchors and fix their hrefs
        for (anchor of anchors) {
            if ((value = await this.__fixValue(anchor.href as TSmsHrefValue))) {
                anchor.href = value;
            } else {
                errors.push(anchor);
            }
        }

        return {code: STATUS_SMS_HREFS_FIXED, errors};
    }

    /**
     * Fixes a single SMS href value.
     *
     * @param {string} value - The SMS href value to fix.
     * @returns {Promise<TSmsHrefValue|null>} A promise resolving to the fixed SMS href value.
     *
     * @example
     * const fixedHref = await smsHrefInstance.__fixValue('sms:123456789?body=Hello%2C%20world'); // Example fixing a single SMS href
     * console.log(fixedHref); // Output: 'sms:123456789?body=Hello%2C%20world' (If no transformation or changes applied)
     */
    public async __fixValue(value: string): Promise<TSmsHrefValue | null> {

        // Parse the value into phone number and message segments
        const segments = this._parser(
            this._textEncoder(replace(value, /&amp;/gi, '&'), 1) as TSmsHrefValue
        );

        // Check if no segments were found
        if (!segments) {
            return segments;
        }

        // Create a new href based on the parsed segments
        return await this.__create(segments._phone, segments._message);
    }

    /**
     * Creates a new SMS href based on the provided phone number and message.
     *
     * @param {TPhone} phone - The phone number for the SMS.
     * @param {TMessage} message - The message body for the SMS.
     * @returns {Promise<TSmsHrefValue | null>} A promise resolving to the generated SMS href value.
     *
     * @example
     * const newHref = await smsHrefInstance.__create('123456789', "Hello, world!"); // Example creating a new SMS href
     * console.log(newHref); // Output: 'sms:123456789?body=Hello%2C%20world%21' (If no transformation or changes applied)
     */
    public async __create(phone: TPhone, message: TMessage): Promise<TSmsHrefValue | null> {

        let value: string = '';

        // Add phone number to the href value if provided
        if ((phone = replace(phone, /[^0-9+A-Z]+/gi))) {
            value += this._phoneMiddleware(phone);
        }

        // Add message body to the href value if provided
        if (this._separator && (message = this._messageMiddleware(message?.trim()))) {
            value += this._separator + 'body=' + this._textEncoder(message);
        }

        // Construct the final href value
        return (value ? 'sms:' + value as TSmsHrefValue : null);
    }

    /**
     * Parses an SMS href value into phone number and message segments.
     *
     * @param {TSmsHrefValue} value - The SMS href value to parse.
     * @returns {TSegments | null} An object containing phone number and message segments, or null if parsing fails.
     *
     * @private
     * @example
     * const parsedSegments = this._parser("sms:123456789?body=Hello, world!"); // Example parsing an SMS href value
     * console.log(parsedSegments); // Output: {_phone: "123456789", _message: "Hello, world!"}
     */
    private _parser(value: TSmsHrefValue): TSegments | null {
        // Regular expression to match SMS href format and extract phone number and message segments
        let [_, _phone, _message] = value.match(/^sms:\/*([0-9+A-Z]+)?(?:[^0-9A-Z]body=(.+)?)?$/i) || [];

        // Remove any white spaces from the phone number and message segments
        _phone = replace(_phone, /\s+/g);
        _message = replace(_message, /\s+/g, ' ')?.trim();

        // If either phone number and message is not present, return null
        // Return an object containing phone number and message segments
        return !_phone && !_message ? null : {_phone, _message};
    }

    /**
     * Determines the separator to be used based on options and platform.
     *
     * @param {TSeparator} [customSeparator] - An optional custom separator provided in the options.
     * @param {boolean[]} [except] - Array of booleans indicating whether to exclude particular options.
     * @returns {TSeparator | null} The determined separator or null if no separator is applicable.
     *
     * @private
     * @example
     * const separator = this._getSeparator(SEPARATOR_IOS); // Example getting separator based on custom separator
     * console.log(separator); // Output: '&'
     */
    private _getSeparator(customSeparator?: TSeparator, except?: TExcept[]): TSeparator | null {

        let ios: number;

        // If any exceptions are included, return null
        if (except?.includes(true)) {
            return null;
        }

        // If custom separator is provided, use it
        if (customSeparator) {
            return customSeparator;
        }

        // Determine separator based on platform
        if (isAndroid()) {
            return SEPARATOR_ANDROID;
        }
        if (!!(ios = isIOS())) {
            return ios < 8 ? SEPARATOR_IOS_7 : SEPARATOR_IOS;
        }

        // If no platform is detected, return null
        // If no separator is applicable, return null
        return null;
    }
}
