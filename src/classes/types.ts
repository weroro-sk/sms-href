import {SEPARATOR_ANDROID, SEPARATOR_IOS, SEPARATOR_IOS_7} from "../contants";

export type TContext = Document | Element | HTMLElement | DocumentFragment;

export namespace Message {

    export type TPhone = string;
    export type TMessage = string;
    export type TSeparator = typeof SEPARATOR_ANDROID | typeof SEPARATOR_IOS | typeof SEPARATOR_IOS_7;

    export type TSegments = {
        _phone: TPhone;
        _message: TMessage;
    };

    /** Possible values for generating SMS hrefs. */
    export type TSmsHrefValue =
        | `sms:${TPhone}`
        | `sms:${TSeparator}body=${TMessage}`
        | `sms:${TPhone}${TSeparator}body=${TMessage}`;
}

export namespace Constructor {
    type TSeparator = Message.TSeparator;

    export type TOptions = {
        /** Array of booleans indicating whether to exclude particular options. */
        except?: boolean[];
        /** Separator to be used in the SMS href. */
        separator?: TSeparator;
        /** Middleware function to transform phone number value. */
        phoneMiddleware?: TMiddlewareFunction;
        /** Middleware function to transform message value. */
        messageMiddleware?: TMiddlewareFunction;
        /** */
        /** Boolean indicating whether to encode the generated href. */
        textEncoder?: TMiddlewareFunction;
    };

    export type TMiddlewareFunction = (value: string) => string;
}

