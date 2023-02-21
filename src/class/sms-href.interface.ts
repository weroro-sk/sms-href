import {ResultCode, SmsConfiguration} from "../mixed/types";

export interface ISmsHref {

    /**
     * @description Finds and update all anchor links with `sms:` protocol value
     *              by current platform in set `DOM` context.
     *
     * @param [context] _[optional]_ - Defines parent `DOM` node for search [default - `document`]
     */
    fixAll(context?: Element | HTMLElement | Document): Promise<ResultCode>;

    /**
     * @description Update input string value by current platform.
     *
     * @param smsValue Input string for update
     * @param [encode] _[optional]_ - Enable/Disable message text encoding ( e.g., `encodeURIComponent` )
     */
    fixValue(smsValue: string, encode?: boolean): string;

    /**
     * @description Creates `sms:` href string from phone number and sms message text
     *
     * @param smsConfiguration
     * @param [encode] _[optional]_ - Enable/Disable message text encoding ( e.g., `encodeURIComponent` )
     */
    create(smsConfiguration: SmsConfiguration, encode?: boolean): string;
}
