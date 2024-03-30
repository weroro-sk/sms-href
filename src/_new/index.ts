/**
 *
 */
// classes
export {SmsHref_PIAPI} from "./new-app";
// constants
export {SEPARATOR_ANDROID, SEPARATOR_IOS, SEPARATOR_IOS_7} from "./new-app";
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
} from "./new-app-detectors";
