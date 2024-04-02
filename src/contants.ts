/**
 * This function is not available in Node.js environment
 */
export const STATUS_IS_NODE_JS = 1;
/**
 * No SMS hrefs found
 */
export const STATUS_NO_SMS_HREFS = 2;
/**
 * SMS hrefs fixed
 */
export const STATUS_SMS_HREFS_FIXED = 3;
/**
 * Separator is not defined.
 */
export const STATUS_SEPARATOR_NOT_DEFINED = 4;

export const translateMessages = (code: number) => new Map([
    [STATUS_IS_NODE_JS, 'This function is not available in Node.js environment'],
    [STATUS_NO_SMS_HREFS, 'Anchors with sms: href value doesn\'t exist'],
    [STATUS_SMS_HREFS_FIXED, 'SMS href values in anchors on this webpage was updated'],
    [STATUS_SEPARATOR_NOT_DEFINED, 'Separator is not defined or current platform doesn\'t support sms: href protocol.'],
]).get(code) || 'Unknown message';

/**
 * Separator used in generating SMS hrefs for different platforms.
 */
export const SEPARATOR_ANDROID = '?';
export const SEPARATOR_IOS = '&';
export const SEPARATOR_IOS_7 = ';';
