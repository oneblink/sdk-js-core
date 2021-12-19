import { ABNRecord } from '@oneblink/types/typescript/misc'

export const getBusinessNameFromABNRecord = (abnRecord: ABNRecord): string => {
  if (abnRecord.mainName?.organisationName) {
    return abnRecord.mainName.organisationName
  }
  if (abnRecord.mainTradingName?.organisationName) {
    return abnRecord.mainTradingName.organisationName
  }
  if (abnRecord.legalName) {
    const { givenName, otherGivenName, familyName } = abnRecord.legalName

    let legalName = ''
    if (givenName) legalName += `${givenName} `
    // Concat middle name
    if (otherGivenName) legalName += `${otherGivenName} `
    // Concat last name
    if (familyName) legalName += `${familyName}`

    if (legalName) return legalName.trim()
  }

  return 'Unknown Business Name'
}
