import { MiscTypes } from '@oneblink/types'

export function parseUserProfile(
  data: unknown,
): MiscTypes.UserProfile | undefined {
  if (typeof data !== 'object' || !data) {
    return
  }
  const jwtPayload = data as Record<string, unknown>
  if (typeof jwtPayload.sub !== 'string') {
    return
  }
  const userProfile: MiscTypes.UserProfile = {
    isSAMLUser: false,
    providerType: 'Cognito',
    providerUserId: jwtPayload.sub,
    userId: jwtPayload.sub,
    email: typeof jwtPayload.email === 'string' ? jwtPayload.email : undefined,
    firstName:
      typeof jwtPayload.given_name === 'string'
        ? jwtPayload.given_name
        : undefined,
    lastName:
      typeof jwtPayload.family_name === 'string'
        ? jwtPayload.family_name
        : undefined,
    fullName: typeof jwtPayload.name === 'string' ? jwtPayload.name : undefined,
    picture:
      typeof jwtPayload.picture === 'string' ? jwtPayload.picture : undefined,
    role:
      typeof jwtPayload['custom:role'] === 'string'
        ? jwtPayload['custom:role']
        : undefined,
    username:
      typeof jwtPayload.email === 'string' ? jwtPayload.email : jwtPayload.sub,
    supervisor: {
      fullName:
        typeof jwtPayload['custom:supervisor_name'] === 'string'
          ? jwtPayload['custom:supervisor_name']
          : undefined,
      email:
        typeof jwtPayload['custom:supervisor_email'] === 'string'
          ? jwtPayload['custom:supervisor_email']
          : undefined,
      providerUserId:
        typeof jwtPayload['custom:supervisor_user_id'] === 'string'
          ? jwtPayload['custom:supervisor_user_id']
          : undefined,
    },
  }

  if (
    !userProfile.supervisor?.fullName &&
    !userProfile.supervisor?.email &&
    !userProfile.supervisor?.providerUserId
  ) {
    userProfile.supervisor = undefined
  }

  if (
    jwtPayload.identities &&
    Array.isArray(jwtPayload.identities) &&
    jwtPayload.identities.length
  ) {
    const { providerType, userId } = jwtPayload.identities[0]
    userProfile.providerType = providerType
    userProfile.providerUserId = userId
    userProfile.isSAMLUser = providerType === 'SAML'
    if (userProfile.isSAMLUser) {
      userProfile.username = jwtPayload.preferred_username || userId
    }
  }

  return userProfile
}

export function getUserFriendlyName(
  userProfile: MiscTypes.UserProfile,
): string {
  if (userProfile.fullName) {
    return userProfile.fullName
  }

  if (userProfile.firstName || userProfile.lastName) {
    return [userProfile.firstName, userProfile.lastName].join(' ').trim()
  }

  if (userProfile.email) {
    return userProfile.email
  }

  if (userProfile.username) {
    return userProfile.username
  }

  return userProfile.userId
}
