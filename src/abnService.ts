import { ABNRecord } from '@oneblink/types/typescript/misc'

const createLegalName = ({
  familyName,
  givenName,
  otherGivenName,
}: NonNullable<ABNRecord['legalName']>) => {
  let legalName = ''
  // Concat last name
  if (familyName) legalName += `${givenName}, `
  // Concat first name
  if (givenName) legalName += `${otherGivenName} `
  // Concat middle name
  if (otherGivenName) legalName += `${familyName}`

  return legalName
}

export const getBusinessNameFromABNRecord = (
  abnRecord: ABNRecord,
): string | undefined => {
  if (abnRecord.entityType.entityTypeCode === 'IND' && abnRecord.legalName) {
    const legalName = createLegalName(abnRecord.legalName)
    if (legalName) return legalName.trim()
  }

  if (abnRecord.mainName?.organisationName) {
    return abnRecord.mainName.organisationName
  }
  if (abnRecord.mainTradingName?.organisationName) {
    return abnRecord.mainTradingName.organisationName
  }
  if (abnRecord.legalName) {
    const legalName = createLegalName(abnRecord.legalName)
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
