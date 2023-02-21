/** SMS HREF CONSTANTS */
import {ResultCode} from "./types";

///////////
// RESULT CODES
///////////

/**
 * @description Code for status - `OK`
 */
export const CODE_SUCCESS: ResultCode = 200;

/**
 * @description Code for status - `Not Found`
 */
export const CODE_NOT_FOUND: ResultCode = 404;

/**
 * @description Code for status - `Not Implemented`
 */
export const CODE_UNSUPPORTED_OS: ResultCode = 501;

///////////
// CONTENT BODY SEPARATORS
///////////

/**
 * @description Body separator for Android platform
 * @see https://stackoverflow.com/a/19126326
 */
export const ANDROID_SEPARATOR: string = '?';

/**
 * @description Body separator for IOS platform version 7 and lower
 * @see https://stackoverflow.com/a/19126326
 */
export const IOS_7_AND_LOWER_SEPARATOR: string = ';';

/**
 * @description Body separator for IOS platform version 8 and higher
 * @see https://stackoverflow.com/a/19126326
 */
export const IOS_8_AND_HIGHER_SEPARATOR: string = '&';

///////////
// IOS MIN VERSION
///////////

/**
 * @description **`iOS7`** allegedly doesn't support **`sms:`** href links.
 */
export const MIN_IOS_VERSION: number = 7;

///////////
// PROTOCOL CONSTANTS
///////////

export const PROTOCOL: string = 'sms:';
export const PROTOCOL_REGEX: RegExp = /^sms:/i;
export const BODY: string = 'body=';
export const BODY_REGEX: RegExp = /.body=/i;

