/**
 *
 */
// classes
export {SmsHref} from "./classes/sms-href";
export {SmsHref_PIAPI} from "./classes/sms-href-piapi";

// constants
export {
    STATUS_IS_NODE_JS,
    STATUS_NO_SMS_HREFS,
    STATUS_SMS_HREFS_FIXED,
    STATUS_SEPARATOR_NOT_DEFINED,
    SEPARATOR_ANDROID,
    SEPARATOR_IOS,
    SEPARATOR_IOS_7
} from "./contants";

// detectors
export {
    // APPLE PLATFORM
    isIOS,
    // devices
    isIPhone,
    isIPod,
    isIPad,
    // "isIPhone" aliases
    isAppleMobile,
    // "isIPad" aliases
    isAppleTablet,
    isIosTablet,

    // GOOGLE PLATFORM
    isAndroid,
    // devices
    isAndroidMobile,
    isAndroidTablet,

    // SOCIAL MEDIA APPS WEBVIEW
    isFacebook,
    isInstagram,
    isLinkedin,

    // Apple and Google devices
    isMobile, // both (Google and Apple)
    isTablet, // both (Google and Apple)
} from "./detectors";

// helpers
export {lettersToPhoneNumber, messageCoder} from "./helpers";
