import {TSeparator} from "./private.types";

export type ResultCode = number;

export type Options = {
    /**
     * @description List for Enable/Disable devices
     *
     * @default Devices
     */
    allow?: Devices;

    /**
     * @description User defined SMS body separator.
     *              Internal platform detection will be disabled
     *
     * @default null
     */
    separator?: TSeparator;

    /**
     * @description Enable/Disable message text encoding ( e.g., `encodeURIComponent` )
     *
     * @default true
     */
    encode?: boolean;
}

/**
 * @description List for Enable/Disable devices
 */
export type Devices = {
    /**
     * @description Enable/disable href update for mobile devices
     *
     * @default true
     */
    mobile?: boolean;

    /**
     * @description Enable/disable href update for tablet devices
     *
     * @default true
     */
    tablet?: boolean;

    /**
     * @description Enable/disable href update for Facebook app web view
     *
     * @default true
     */
    facebook?: boolean;
};

export type SmsConfiguration = {
    /**
     * @description SMS Phone number
     */
    phone?: string | number;

    /**
     * @description SMS message text
     */
    message?: string;
}
