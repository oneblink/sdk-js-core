# OneBlink SDK - JavaScript Core | Usage

## User Service

Helper functions for handling users

```js
import { userService } from '@oneblink/sdk-core'
```

- [`getUserFriendlyName()`](#getuserfriendlyname)
- [`parseUserProfile()`](#parseuserprofile)

### `getUserFriendlyName()`

A friendly `string` that represents the a [User Profile](#user-profile). Uses first name, last name, full name, email address or username.

```js
const userProfile = userService.parseUserProfile(jwtPayload)
const name = userService.getUserFriendlyName(userProfile)
if (name) {
  // Display current user's name
}
```

### `parseUserProfile()`

Parse a [User Profile](#user-profile) based on a JWT payload. Will return undefined if not a valid JWT payload

```js
import jwtDecode from 'jwt-decode'

const jwtPayload = jwtDecode('a valid token from a user')
const userProfile = userService.parseUserProfile(jwtPayload)
if (userProfile) {
  // continue
}
```

#### User Profile

| Property                    | Type                                          | Description                                                 |
| --------------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| `isSAMLUser`                | `boolean`                                     | `true` if the user logged in using a SAML provider          |
| `providerType`              | `"Cognito"` &#124; `"SAML"` &#124; `"Google"` | Which provider was used to login                            |
| `providerUserId`            | `string`                                      | The id of the user from the login provider                  |
| `userId`                    | `string`                                      | The id of the user from OneBlink                            |
| `username`                  | `string`                                      | The username used to login                                  |
| `email`                     | `string` &#124; `undefined`                   | The user's email address                                    |
| `firstName`                 | `string` &#124; `undefined`                   | The user's first name                                       |
| `lastName`                  | `string` &#124; `undefined`                   | The user's last name                                        |
| `fullName`                  | `string` &#124; `undefined`                   | The user's full name                                        |
| `picture`                   | `string` &#124; `undefined`                   | A URL to a picture of the user                              |
| `role`                      | `string` &#124; `undefined`                   | The user's role from a SAML configuration                   |
| `supervisor`                | `object` &#124; `undefined`                   | The user's supervisor information from a SAML configuration |
| `supervisor.fullName`       | `string` &#124; `undefined`                   | The user's supervisor's full name                           |
| `supervisor.email`          | `string` &#124; `undefined`                   | The user's supervisor's full email address                  |
| `supervisor.providerUserId` | `string` &#124; `undefined`                   | The user's supervisor's user id from the login provider     |
