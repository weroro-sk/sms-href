# SMS href

Generates an SMS protocol link, updates an exist SMS protocol string or updates all SMS protocol links on webpage or
defined DOM context.

[Live demo](https://weroro-sk.github.io/sms-href/demo/)

_You can avoid this library and use the universal `;?&` separator `sms:1234;?&body=Your%20message`, but this is not work
everywhere._

|                    |           |
|--------------------|-----------|
| Webpack build size | `1.77 kB` |

---

- [Installation](#installation)
- [Usage](#basic-usage)
- [API](#api)
    - [Instance](#instance)
        - [Custom separator](#custom-separator-definition)
    - [fixAll](#fixall)
    - [fixValue](#fixvalue)
    - [create](#create)
- [Types](#types)
    - [ResultCode](#resultcode)
    - [Options](#options)
    - [Devices](#devices)
    - [SmsConfiguration](#smsconfiguration)

---

---

## Installation

`npm install sms-href`

## DEV runners

| runner               | output                                  | description                             |
|----------------------|-----------------------------------------|-----------------------------------------|
| `npm run build`      | `./lib/**/*`                            | Transpile from Typescript to Javascript |
| `npm run build:pack` | `./sms-href-{package-json-version}.tgz` | Create NPM package file (`*.tgz`)       |
| `npm run demo`       | `./demo/dist/demo.js`                   | Build demo                              |

## Basic usage

```typescript
import {SmsHref} from "sms-href";

const smsHref: SmsHref = new SmsHref();

(async () => await smsHref.fixAll())();
```

| Tested platforms         |
|--------------------------|
| Android 10 (Quince Tart) |
| Android 12 (Snow Cone)   |
| iOS 6                    |
| iOS 8                    |
| iOS 12                   |
| iOS 15 / iPadOS 15       |
| iOS 16 / iPadOS 16       |

---

## API

---

### Instance

Syntax:

### ``` new SmsHref( [ options: Options ] ) ```

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
        if (MIN_IOS_VERSION < platform.version.major)
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

### ``` fixAll( [ context: Element | HTMLElement | Document ] ) ```

Finds and update all anchor links with `sms:` protocol value by current platform in set DOM context.

|                         | type                               | default    | description                        |
|-------------------------|------------------------------------|------------|------------------------------------|
| [`context` = document ] | `Element` `HTMLElement` `Document` | `document` | Defines parent DOM node for search |
| returns                 | `Promise<ResultCode>`              |            |                                    |
| throws                  | `TypeError`                        |            |                                    |

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
        switch (resultCode) {
            case CODE_SUCCESS:
                console.log(`All sms: href values in anchors was updated`);
                break;
            case CODE_NOT_FOUND:
                console.log(`'Anchors with sms: href value doesn't exist'`);
                break;
            case CODE_UNSUPPORTED_OS:
                console.log(`Current platform doesn't support sms: href protocol`);
                break;
        }
    })
    .catch(err => console.error(err.message));
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

### ``` fixValue( smsValue: string [, encode: boolean ] ) ```

Update input string value by current platform.

|            | type        | default                            | description                                                         |
|------------|-------------|------------------------------------|---------------------------------------------------------------------|
| `smsValue` | `string`    |                                    | Input string for update                                             |
| [`encode`] | `boolean`   | Constructor `options.encode` value | Enable/disable message text encoding ( e.g., `encodeURIComponent` ) |
| returns    | `string`    |                                    |                                                                     |
| throws     | `TypeError` |                                    | If `smsValue` is empty or not provided.                             |

Example:

```typescript
smsHref.fixValue('1234@body=Your message');
// Android  --> sms:1234?body=Your%20message
// IOS <= 7 --> sms:1234;body=Your%20message
// IOS >= 8 --> sms:1234&body=Your%20message
```

Example (with disabled message encoding):

```typescript
smsHref.fixValue('1234@body=Your message', false);
// Android  --> sms:1234?body=Your message
// IOS <= 7 --> sms:1234;body=Your message
// IOS >= 8 --> sms:1234&body=Your message
```

---

### create

Syntax:

### ``` create( smsConfiguration: [SmsConfiguration](#smsconfiguration) [, encode: boolean] ) ```

Creates `sms:` href string from phone number and sms message text.

|                              | type                                    | default                            | description                                                         |
|------------------------------|-----------------------------------------|------------------------------------|---------------------------------------------------------------------|
| `smsConfiguration`           | [`SmsConfiguration`](#smsconfiguration) |                                    |                                                                     |
| `smsConfiguration[.phone]`   | `string` `number`                       |                                    | SMS Phone number                                                    |
| `smsConfiguration[.message]` | `string`                                |                                    | SMS message text                                                    |
| [ `encode` ]                 | `boolean`                               | Constructor `options.encode` value | Enable/disable message text encoding ( e.g., `encodeURIComponent` ) |
| returns                      | `string` - sms href valid string        |                                    |                                                                     |
| throws                       | `TypeError`                             |                                    | If `phone` and `message` are both not provided                      |

**NOTE**: Phone and message are both optional, but one of them must be provided.

Example:

```typescript
smsHref.create({
    phone: 1234,
    message: 'Your message'
});
// Android  --> sms:1234?body=Your%20message
// IOS <= 7 --> sms:1234;body=Your%20message
// IOS >= 8 --> sms:1234&body=Your%20message
```

Example (with disabled message encoding):

```typescript
smsHref.create({
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

## Types

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
