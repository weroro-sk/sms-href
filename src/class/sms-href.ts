import {ISmsHref} from "./sms-href.interface";
import {Devices, Options, ResultCode, SmsConfiguration} from "../mixed/types";
import {
    ANDROID_SEPARATOR,
    BODY, BODY_REGEX,
    CODE_NOT_FOUND,
    CODE_SUCCESS,
    CODE_UNSUPPORTED_OS,
    IOS_7_AND_LOWER_SEPARATOR,
    IOS_8_AND_HIGHER_SEPARATOR,
    MIN_IOS_VERSION,
    PROTOCOL,
    PROTOCOL_REGEX,
} from "../mixed/constants";

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
    private readonly _separator: string | null = null;

    /**
     * @param [options] _[optional]_ Configuration of custom separator and allowed devices.
     *                  Read documentation for more information.
     */
    public constructor(options?: Options) {
        Object.assign(this._options, options);
        this._separator = this._getSeparator();
    }

    public fixAll(context: Element | HTMLElement | Document = document): Promise<ResultCode> {
        return new Promise((resolve: (resultCode: (ResultCode | PromiseLike<ResultCode>)) => void, reject: (reason?: any) => void): void => {

            // Separator was not set
            if (!this._separator)
                return resolve(CODE_UNSUPPORTED_OS);

            const elements: NodeListOf<HTMLAnchorElement> = context.querySelectorAll(`a[href^="${PROTOCOL}"]`);

            // Anchors with sms: href doesn't exist
            if (!elements.length)
                return resolve(CODE_NOT_FOUND);

            elements.forEach((element: HTMLAnchorElement): void => {

                const content: string = element.href.replace(PROTOCOL_REGEX, '');

                // sms: content is empty
                if (!content?.trim())
                    return;

                try {
                    element.href = this.fixValue(content, this._options.encode);
                } catch (err) {
                    reject(err);
                }

            });

            // All sms: href anchors was updated
            resolve(CODE_SUCCESS);
        });
    }

    public fixValue(smsValue: string, encode?: boolean): string {

        if (!smsValue?.trim())
            throw new TypeError('SMS href text must be provided.');

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

    public create(smsConfiguration: SmsConfiguration, encode?: boolean): string {

        const phone: string | undefined = smsConfiguration?.phone!?.toString().trim();
        const message: string | undefined = smsConfiguration?.message?.trim();

        if (!phone && !message)
            throw new TypeError('Phone number or message must be provided.');

        let smsValue: string = PROTOCOL;

        if (!!phone)
            smsValue += phone;

        if (!!message)
            smsValue += '@' + BODY + message;

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
     * @returns `TRUE` for facebook app web view or `FALSE` if it's not.
     * @private
     */
    private _isFacebookApp(UA: string): boolean {
        return /fba[nv]/gi.test(UA);
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
    private _getSeparator(): string | null {

        // Custom defined separator
        if (!!this._options.separator?.trim())
            return this._options.separator!;

        const UA: string = navigator.userAgent;

        // Facebook app web view
        if (!this._options.allow?.facebook && this._isFacebookApp(UA))
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
