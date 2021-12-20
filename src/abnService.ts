import { ABNRecord } from '@oneblink/types/typescript/misc'

export const getBusinessNameFromABNRecord = (
  abnRecord: ABNRecord,
): string | undefined => {
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
}
export const displayBusinessNameFromABNRecord = (
  abnRecord: ABNRecord,
): string => {
  const businessName = getBusinessNameFromABNRecord(abnRecord)
  return businessName || 'Unknown Business Name'
}

export const getABNNumberFromABNRecord = (
  abnRecord: ABNRecord,
): string | undefined => {
  if (!abnRecord.ABN) return
  if (Array.isArray(abnRecord.ABN)) {
    const relevantABN = abnRecord.ABN.find((abn) => abn.isCurrentIndicator)
    return relevantABN?.identifierValue
  }
  return abnRecord.ABN.identifierValue
}
export const displayABNNumberFromABNRecord = (abnRecord: ABNRecord): string => {
  const abnNumber = getABNNumberFromABNRecord(abnRecord)
  return abnNumber || 'Unknown ABN Number'
}
