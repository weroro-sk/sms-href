/////////////////////
const UA: string = navigator.userAgent;
/////////////////////

/**
 * Checks if the user agent corresponds to an iOS device and returns its version.
 *
 * @returns {number} Returns the iOS version.
 *                   - `version` - If is iOS, and version is provided return major iOS version.
 *                   - `-1` - If is iOS, and version is not provided.
 *                   - `0` - Returns 0 if the user agent does not match iOS.
 * @example
 * // Returns 14 if the user agent matches "CPU OS 14_0"
 * const iOSVersion = isIOS();
 */
export const isIOS = (): number => {
    let value: number;

    // Check if the user agent matches the pattern of iOS devices
    if (/CPU like.*AppleWebKit.*Mobile/i.test(UA)) {
        // Return -1 if the user agent corresponds to a non-iOS device
        return -1;
    }

    // Extract iOS version number from the user agent string
    return isNaN((value = +UA.match(/CPU.*OS ([0-9]{1,5})/i)?.[1]!)) ? 0 : value;
};

/**
 * Checks if the user agent corresponds to an Android device and returns its version.
 *
 * @returns {number} Returns the Android version.
 *                   - `version` - If is Android, and version is provided return major Android version.
 *                   - `-1` - If is Android, and version is not provided.
 *                   - `0` - Returns 0 if the user agent does not match "Android".
 * @example
 * // Returns 10 if the user agent matches "Android 10"
 * const androidVersion = isAndroid();
 */
export const isAndroid = (): number => {
    let value: number;

    // Extract groups from the user agent string matching "Android" followed by version number
    let groups = UA.match(/(Android) ([0-9]{1,5})?/i);

    // If there are no groups or the first group is not present, return 0
    if (!groups?.[1]) {
        return 0;
    }

    // If the version number is present, convert it to a number, else return -1
    return isNaN((value = +groups?.[2]!)) ? -1 : value;
}

/**
 * Checks if the device is an iPhone.
 *
 * @returns {boolean} True if the device is an iPhone, otherwise false.
 * @example
 * // Returns true if the device is an iPhone
 * const isDeviceIPhone = isIPhone();
 */
export const isIPhone = (): boolean =>
    // Check if the device is iOS and not an iPod or iPad
    !!isIOS() && !isIPod() && !isIPad();

/**
 * This is an alias for {@link isIPhone} function.
 *
 * Checks if the device is an iOS mobile (iPhone).
 */
export const isAppleMobile: typeof isIPhone = isIPhone;

/**
 * Checks if the device is an iPod.
 *
 * @returns {boolean} True if the device is an iPod, otherwise false.
 * @example
 * // Returns true if the device is an iPod
 * const isIPodDevice = isIPod();
 */
export const isIPod = (): boolean =>
    // Check if the device is iOS and if the user agent contains "ipod"
    !!isIOS() && /ipod/i.test(UA);

/**
 * Checks if the device is an iPad.
 *
 * @returns {boolean} True if the device is an iPad, otherwise false.
 * @example
 * // Returns true if the device is an iPad
 * const isIPadDevice = isIPad();
 */
export const isIPad = (): boolean =>
    // Check if the device is iOS and if the user agent contains "ipad"
    !!isIOS() && /ipad/i.test(UA);

/**
 * This is an alias for {@link isIPad} function.
 *
 * Checks if the device is an iOS tablet (iPad).
 */
export const isIosTablet: typeof isIPad = isIPad;

/**
 * This is an alias for {@link isIPad} function.
 *
 * Checks if the device is an Apple tablet (iPad).
 */
export const isAppleTablet: typeof isIPad = isIPad;

/**
 * Checks if the device is an Android mobile device.
 * @returns {boolean} True if the device is an Android mobile device, otherwise false.
 * @example
 * // Returns true if the device is an Android mobile device
 * const isAndroidMobileDevice = isAndroidMobile();
 */
export const isAndroidMobile = (): boolean =>
    // Check if the device is Android and if the user agent contains "Mobile"
    !!isAndroid() && /Mobile/i.test(UA);

/**
 * Checks if the device is an Android tablet.
 *
 * @returns {boolean} True if the device is an Android tablet, otherwise false.
 * @example
 * // Returns true if the device is an Android tablet
 * const isDeviceAndroidTablet = isAndroidTablet();
 */
export const isAndroidTablet = (): boolean =>
    // Check if the device is Android and if the user agent does not contain "Mobile"
    !!isAndroid() && !isAndroidMobile();

/**
 * Checks if the device is a tablet (either Android tablet or iPad).
 *
 * @returns {boolean} True if the device is a tablet, otherwise false.
 * @example
 * // Returns true if the device is a tablet
 * const isDeviceTablet = isTablet();
 */
export const isTablet = (): boolean => isIPad() || isAndroidTablet();

/**
 * Checks if the device is a mobile device (either iPhone or Android mobile).
 *
 * @returns {boolean} True if the device is a mobile device, otherwise false.
 * @example
 * // Returns true if the device is a mobile device
 * const isDeviceMobile = isMobile();
 */
export const isMobile = (): boolean => isIPhone() || isAndroidMobile();

/**
 * Checks if the user agent corresponds to a Facebook browser.
 *
 * @returns {boolean} True if the user agent indicates a Facebook browser, otherwise false.
 * @example
 * // Returns true if the user agent indicates a Facebook browser
 * const isFacebookBrowser = isFacebook();
 */
export const isFacebook = (): boolean =>
    // Test if the user agent contains "fban" or "fbav"
    /fba[nv]/i.test(UA);

/**
 * Checks if the user agent corresponds to Instagram.
 *
 * @returns {boolean} True if the user agent indicates Instagram, otherwise false.
 * @example
 * // Returns true if the user agent indicates Instagram
 * const isInstagram = isInstagram();
 */
export const isInstagram = (): boolean =>
    // Test if the user agent contains "instagram" (case-insensitive)
    /instagram/i.test(UA);

/**
 * Checks if the user agent string contains "LinkedIn".
 *
 * @returns {boolean} Returns true if the user agent string contains "LinkedIn", otherwise false.
 * @example
 * // Returns true if UA contains "LinkedIn"
 * const result = isLinkedin();
 *
 * @see https://explore.whatismybrowser.com/useragents/explore/software_name/linkedin-app/
 */
export const isLinkedin = (): boolean =>
    // Test if the user agent contains "LinkedIn" (case-insensitive)
    /linkedin/i.test(UA);



