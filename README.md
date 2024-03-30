# <img src="sms-href_logo.svg" alt="SMS Href" style="height:1.27em;vertical-align:top;" /> <span>SMS Href</span>

SMS Href creates SMS URL strings, updates existing SMS URL strings, or updates all href attributes containing SMS URLs
on a web page or in a defined DOM context.

[![Latest NPM version](https://img.shields.io/npm/v/sms-href?label=npm%20version&style=flat-square&logo=npm)](https://www.npmjs.com/package/sms-href)
[![Latest GIT version](https://img.shields.io/github/package-json/version/weroro-sk/sms-href/main?label=github%20version&style=flat-square&logo=github)](https://github.com/weroro-sk/sms-href)

> 💡 **Tip:** You can avoid this library and use the universal separator `;?&` (_all three characters in that order_),
> but it doesn't work everywhere.

|                                              |                                      |                                                            |
|----------------------------------------------|--------------------------------------|------------------------------------------------------------|
| Minified & GZIP-ed build size: **660 Bytes** | 💻 **[Installation](#installation)** | ✨ **[Basic usage](#basic-usage-without-catching-outputs)** |




---

[![Live demo](https://img.shields.io/badge/Try_SMS_Href-Live_demo-fe7d37?style=for-the-badge&logo=github)](https://weroro-sk.github.io/sms-href/demo/)

---

### Table of Contents

- **API**
  - [Instance](#instance)
      - [Constructor options](#)
        - [Custom separator](#custom-separator-definition)
        - [Except](#)
        - [Transform phone number](#)
        - [Encode message](#)
  - [fixAll](#fixall)
  - [fixValue](#fixvalue)
  - [create](#create)

- **Types**
    - [ResultCode](#resultcode)
    - [Options](#options)
    - [Devices](#devices)
    - [SmsConfiguration](#smsconfiguration)

---

> ### Installation
> 
> |           |                     |
> |-----------|---------------------|
> | **NPM:**  | `npm add sms-href`  |
> | **YARN:** | `yarn add sms-href` |
> | **PNPM:** | `pnpm add sms-href` |
> | **BUN:**  | `bun add sms-href`  |

---

## Basic usage (without catching outputs)

```typescript
import {SmsHref} from "sms-href";

const smsHref: SmsHref = new SmsHref();

// As promise
smsHref.fixAll().catch();

// OR sync
try {
    await smsHref.fixAll();
} catch (e) {
}

```

### 📲 Tested platforms

| Android                    | iOS | iPadOS |
|----------------------------|-----|--------|
| 10 (Quince Tart)           | 6   | 6      |
| 12 (Snow Cone)             | 8   | 8      |
| 13 (Tiramisu)              | 12  | 12     |
| 14 (Upside Down Cake)      | 15  | 15     |
| 15 DP2 (Vanilla Ice Cream) | 16  | 16     |
|                            | 17  | 17     |

---

> ## API

### Instance

Syntax:

#### ``` new SmsHref( [ options: Options ] ) ```

Instance of `SmsHref`

Example:

```typescript
const smsHref: SmsHref = new SmsHref();
```

Constructor parameters:

|                                    | type                  | default | description                                                                                                                                                                                                                                          |
|------------------------------------|-----------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`options`]                        | [`Options`](#options) |         | Configuration of custom separator and allowed devices - [Show detail](#options)                                                                                                                                                                      |
| [`options.allow`]                  | [`Devices`](#devices) |         | List of enable/disable devices - [Show detail](#devices)                                                                                                                                                                                             |
| [`options.allow.mobile` = true ]   | `boolean`             | `true`  | Enable/disable href update for mobile devices                                                                                                                                                                                                        |
| [`options.allow.tablet` = true ]   | `boolean`             | `true`  | Enable/disable href update for tablet devices                                                                                                                                                                                                        |
| [`options.allow.facebook` = true ] | `boolean`             | `true`  | Enable/disable href update for Facebook app web view                                                                                                                                                                                                 |
| [`options.separator` = null ]      | `string` `null`       | `null`  | User defined SMS body (`body=`) separator. [Read more](#custom-separator-definition) <br/>**NOTE**: Internal platform detection and allowed devices list will be disabled.                                                                           |
| [`options.encode` = true ]         | `boolean`             | `true`  | Enable/disable message text encoding globally ( e.g., `encodeURIComponent` )<br/>**NOTE**: Methods [fixValue()](#fixvalue) and [create()](#create) have their own parameter for enable/disable encoding and this global parameter can be overridden. |

Example (disable tablets and facebook app web view):

```typescript
const smsHref: SmsHref = new SmsHref({
    allow: {
        facebook: false,
        tablet: false
    }
});
```

### Custom separator definition

If you want to define your own separator, you can use existed separator constants

| constant name                | value | type     | description                                                                            |
|------------------------------|-------|----------|----------------------------------------------------------------------------------------|
| `ANDROID_SEPARATOR`          | `?`   | `string` | Body separator `?body=` for `Android` platform                                         |
| `IOS_7_AND_LOWER_SEPARATOR`  | `;`   | `string` | Body separator `;body=` for `IOS <= 7` platform                                        |
| `IOS_8_AND_HIGHER_SEPARATOR` | `&`   | `string` | Body separator `&body=` for `IOS >= 8` platform                                        |
| `MIN_IOS_VERSION`            | `7`   | `number` | Value is **`7`** - because **`iOS7`** allegedly doesn't support **`sms:`** href links. |

**NOTE:** `IOS 7` allegedly does not support `sms:` protocol.

Example:

```typescript
import {
    SmsHref,
    MIN_IOS_VERSION,
    ANDROID_SEPARATOR,
    IOS_7_AND_LOWER_SEPARATOR,
    IOS_8_AND_HIGHER_SEPARATOR
} from "sms-href";

// Custom
function customSeparatorMechanism(): string | null {
    const platform: CustomPlatformDetection = new CustomPlatformDetection();

    if (platform.name === 'Android')
        return ANDROID_SEPARATOR;

    if (platform.name === 'IOS') {
        if (platform.version.major <= MIN_IOS_VERSION)
            return IOS_7_AND_LOWER_SEPARATOR
        return IOS_8_AND_HIGHER_SEPARATOR;
    }

    return null;
}

// Instance
const smsHref: SmsHref = new SmsHref({
    separator: customSeparatorMechanism()
});
```

---

### fixAll

Syntax:

#### ``` async fixAll( [ context: Element | HTMLElement | Document ] ) : Promise<ResultCode> ```

Finds and update all anchor links with `sms:` protocol value by current platform in set DOM context.

|                         | type                               | default    | description                        |
|-------------------------|------------------------------------|------------|------------------------------------|
| [`context` = document ] | `Element` `HTMLElement` `Document` | `document` | Defines parent DOM node for search |
| returns                 | `Promise<ResultCode>`              |            |                                    |
| throws                  | `Promise.catch<ResultCode>`        |            |                                    |

Example:

```typescript
await smsHref.fixAll();
```

Example with custom defined context:

```typescript
const context: HTMLElement = document.querySelector('.context-element');

await smsHref.fixAll(context);
```

Example with using `resultCode` in `Promise<ResultCode>`.

```typescript
import {
    SmsHref,
    ResultCode,
    CODE_SUCCESS,
    CODE_NOT_FOUND,
    CODE_UNSUPPORTED_OS
} from "sms-href";

const smsHref: SmsHref = new SmsHref();

smsHref.fixAll()
    .then((resultCode: ResultCode): void => {
        if (resultCode === CODE_SUCCESS)
            console.log(`All sms: href values in anchors was updated`);
    })
    .catch((resultCode: any): void => {
        if (resultCode === CODE_NOT_FOUND)
            console.log(`'Anchors with sms: href value doesn't exist'`);
        else if (resultCode === CODE_UNSUPPORTED_OS)
            console.log(`Current platform doesn't support sms: href protocol`);
    });
```

[ResultCode](#resultcode) constants list:

| constant name         | value | type     | status              | description                                         |
|-----------------------|-------|----------|---------------------|-----------------------------------------------------|
| `CODE_SUCCESS`        | `200` | `number` | **Ok**              | All sms: href values in anchors was updated         |
| `CODE_NOT_FOUND`      | `404` | `number` | **Not found**       | Anchors with sms: href value doesn't exist          |
| `CODE_UNSUPPORTED_OS` | `501` | `number` | **Not Implemented** | Current platform doesn't support sms: href protocol |

---

### fixValue

Syntax:

#### ``` async fixValue( smsValue: string [, encode: boolean ] ) : Promise<string> ```

Update input string value by current platform.

|            | type              | default                            | description                                                         |
|------------|-------------------|------------------------------------|---------------------------------------------------------------------|
| `smsValue` | `string`          |                                    | Input string for update                                             |
| [`encode`] | `boolean`         | Constructor `options.encode` value | Enable/disable message text encoding ( e.g., `encodeURIComponent` ) |
| returns    | `Promise<string>` |                                    | Valid SMS Href `sms:`anchor string                                  |

Example:

```typescript
await smsHref.fixValue('1234@body=Your message');
// Android  --> sms:1234?body=Your%20message
// IOS <= 7 --> sms:1234;body=Your%20message
// IOS >= 8 --> sms:1234&body=Your%20message
```

Example (with disabled message encoding):

```typescript
await smsHref.fixValue('1234@body=Your message', false);
// Android  --> sms:1234?body=Your message
// IOS <= 7 --> sms:1234;body=Your message
// IOS >= 8 --> sms:1234&body=Your message
```

---

### create

Syntax:

#### ``` async create( smsConfiguration: SmsConfiguration [, encode: boolean] ) : Promise<string> ```

Creates `sms:` href string from phone number and sms message text.

|                              | type                                                   | default                            | description                                                         |
|------------------------------|--------------------------------------------------------|------------------------------------|---------------------------------------------------------------------|
| `smsConfiguration`           | [`SmsConfiguration`](#smsconfiguration)                |                                    |                                                                     |
| `smsConfiguration[.phone]`   | `string` `number`                                      |                                    | SMS Phone number                                                    |
| `smsConfiguration[.message]` | `string`                                               |                                    | SMS message text                                                    |
| [ `encode` ]                 | `boolean`                                              | Constructor `options.encode` value | Enable/disable message text encoding ( e.g., `encodeURIComponent` ) |
| returns                      | `Promise<string>` - Valid SMS Href `sms:`anchor string |                                    |                                                                     |
| throws                       | `Promise.reject<TypeError>`                            |                                    | If `phone` and `message` are both not provided                      |

**NOTES**:

- Phone and message are both optional, but one of them must be provided.
- Phone number format validation is not implemented. You should use own validation.
- SMS message format validation is not implemented. You should use own validation.

Example:

```typescript
await smsHref.create({
    phone: 1234,
    message: 'Your message'
});
// Android  --> sms:1234?body=Your%20message
// IOS <= 7 --> sms:1234;body=Your%20message
// IOS >= 8 --> sms:1234&body=Your%20message
```

Example (with disabled message encoding):

```typescript
await smsHref.create({
    phone: 1234,
    message: 'Your message'
}, false);
// Android  --> sms:1234?body=Your message
// IOS <= 7 --> sms:1234;body=Your message
// IOS >= 8 --> sms:1234&body=Your message
```

---

---

---

> ## Types

### ResultCode

```typescript
type ResultCode = number;
```

### Options

```typescript
type Options = {
    allow?: Devices;
    separator?: string | null;
    encode?: boolean;
}
```

### Devices

```typescript
type Devices = {
    mobile?: boolean;
    tablet?: boolean;
    facebook?: boolean;
};
```

### SmsConfiguration

```typescript
type SmsConfiguration = {
    phone?: string | number;
    message?: string;
}
```

---

---

---

## License

[MIT](LICENSE) © [Dárius Bokor](https://www.weroro.sk/)

---
**References**

- [The "sms" URI Scheme](https://www.rfc-editor.org/rfc/rfc5724#section-2)
- [Apple IOS - SMS Links](https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/SMSLinks/SMSLinks.html)
- [stackoverflow -> 58131833](https://stackoverflow.com/a/58131833/2276415)
- [stackoverflow -> 19126326](https://stackoverflow.com/a/19126326/2276415)
