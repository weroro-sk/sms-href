import "@total-typescript/ts-reset";

import {ISmsHref} from "./sms-href.interface";
import {
    Options,
    Devices,
    ResultCode,
    SmsConfiguration,

    TSmsAnchor,
    TSeparator,
    TSmsAnchors,
    TRejectType,
    TResolveType,
    TContextType,
    TSmsHrefValue
} from "../mixed/types";
import {
    PROTOCOL,
    CODE_SUCCESS,
    CODE_NOT_FOUND,
    PROTOCOL_REGEX,
    MIN_IOS_VERSION,
    BODY, BODY_REGEX,
    ANDROID_SEPARATOR,
    CODE_UNSUPPORTED_OS,
    IOS_7_AND_LOWER_SEPARATOR,
    IOS_8_AND_HIGHER_SEPARATOR,
} from "../mixed/constants";
import {merge} from "../mixed/helpers";


export class SmsHref implements ISmsHref {

    /**
     * @private
     * @readonly
     */
    private readonly _options: Options = {
        allow: {
            mobile: true,
            tablet: true,
            facebook: true
        },
        separator: null,
        encode: true
    };

    /**
     * @private
     * @readonly
     */
    private readonly _separator: TSeparator = null;

    /**
     * @param [options] _[optional]_ Configuration of custom separator and allowed devices.
     *                  Read documentation for more information.
     */
    public constructor(options?: Options) {
        merge(this._options, options);
        this._separator = this._getSeparator();
    }

    /**
     * @description Finds and update all anchor links with `sms:` protocol value
     *              by current platform in set `DOM` context.
     *
     * @param [context] _[optional]_ - Defines parent `DOM` node for search [default - `document`]
     */
    public fixAll(context: TContextType = document): Promise<ResultCode> {
        return new Promise((resolve: TResolveType, reject: TRejectType): void => {

            // Separator was not set
            if (!this._separator)
                return reject(CODE_UNSUPPORTED_OS);

            const elements: TSmsAnchors = context?.querySelectorAll(`a[href^="${PROTOCOL}"]`);

            // Anchors with sms: href doesn't exist
            if (!elements?.length)
                return reject(CODE_NOT_FOUND);

            elements.forEach(async (element: TSmsAnchor): Promise<void> => {

                const content: string = element.href.replace(PROTOCOL_REGEX, '')?.trim();

                // sms: content is empty
                if (!content)
                    return;

                element.href = await this.fixValue(content, this._options.encode);

            });

            // All sms: href anchors was updated
            resolve(CODE_SUCCESS);
        });
    }

    /**
     * @description Update input string value by current platform.
     *
     * @param smsValue Input string for update
     * @param [encode] _[optional]_ - Enable/Disable message text encoding ( e.g., `encodeURIComponent` )
     */
    public async fixValue(smsValue: string, encode?: boolean): Promise<TSmsHrefValue> {

        if (typeof this._separator !== 'string' || !BODY_REGEX.test(smsValue))
            return smsValue;

        if (typeof encode !== "boolean")
            encode = this._options.encode;

        if (encode)
            smsValue = this._encode(smsValue);

        const protocol: string = PROTOCOL_REGEX.test(smsValue) ? '' : PROTOCOL;

        return protocol + smsValue
            ?.replace(/&amp;/gi, '&')
            .replace(BODY_REGEX, this._separator + BODY);
    }

    /**
     * @description Creates `sms:` href string from phone number and sms message text
     *
     * @param smsConfiguration
     * @param [encode] _[optional]_ - Enable/Disable message text encoding ( e.g., `encodeURIComponent` )
     */
    public async create(smsConfiguration: SmsConfiguration, encode?: boolean): Promise<TSmsHrefValue> {

        const phone: string | undefined = smsConfiguration?.phone?.toString().trim();
        const message: string | undefined = smsConfiguration?.message?.trim();

        if (!phone && !message)
            throw new TypeError('Phone number or message must be provided.');

        let smsValue: string = '';

        if (!!phone)
            smsValue += phone;

        if (!!message)
            smsValue += ANDROID_SEPARATOR + BODY + message;

        return this.fixValue(smsValue, encode);
    }

    /**
     * @description IOS platform detection
     *
     * @returns IOS major version or `-1` if it's not IOS
     * @private
     */
    private _isIOS(UA: string): number {

        const version: string | undefined = UA
            .match(/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i)?.[1]
            ?.replace('undefined', '3_2')
            .replace('_', '.')
            .replace('_', '');

        if (!version || isNaN(+version))
            return -1;

        const majorVersion: number = parseInt(version);
        const isTablet: boolean = /ipad/i.test(UA);

        return this._getResultByAllowedDevice(majorVersion, isTablet);
    }

    /**
     * @description Android platform detection
     *
     * @returns `1` for Android or `-1` if it's not Android
     * @private
     */
    private _isAndroid(UA: string): number {

        if (!/android/i.test(UA))
            return -1;

        const result: number = 1;
        const isTablet: boolean = !/mobile/i.test(UA);

        return this._getResultByAllowedDevice(result, isTablet);
    }

    /**
     * @description Facebook APP web view detection
     *
     * @returns `1` for facebook app web view or `-1` if it's not.
     * @private
     */
    private _isFacebookApp(UA: string): number {
        return /fba[nv]/gi.test(UA) ? 1 : -1;
    }

    /**
     * @private
     */
    private _encode(smsString: string): string {

        if (smsString.search(BODY) < BODY.length)
            return smsString;

        const pieces: Array<string> = smsString.split(BODY);

        return pieces.shift() + BODY + encodeURIComponent(decodeURIComponent(pieces.join(BODY)));
    }

    /**
     * @private
     */
    private _getResultByAllowedDevice(result: number, isTablet: boolean): number {

        const allow: Devices = this._options.allow!;

        // Mobile only
        if (allow.mobile && !allow.tablet)
            return isTablet ? -1 : result;

        // Tablet only
        if (allow.tablet && !allow.mobile)
            return isTablet ? result : -1;

        return result;
    }

    /**
     * @private
     */
    private _getSeparator(): TSeparator {

        // Custom defined separator
        if (!!this._options.separator?.trim())
            return this._options.separator!;

        const UA: string = navigator.userAgent;

        // Facebook app web view
        if (!this._options.allow?.facebook && this._isFacebookApp(UA) > 0)
            return null;

        // Platform detection

        if (this._isAndroid(UA) > 0)
            return ANDROID_SEPARATOR;

        const ios: number = this._isIOS(UA);
        if (ios > 0)
            return ios <= MIN_IOS_VERSION ? IOS_7_AND_LOWER_SEPARATOR : IOS_8_AND_HIGHER_SEPARATOR;

        return null;
    }

}
