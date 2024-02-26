/**
 * The regex used for matching `{ELEMENT:<elementName>}` tags in the OneBlink
 * platform. Ignores nested elements based on the '|' character. Will match
 * `"{ELEMENT:Parent_Name}"` but will NOT match `"{ELEMENT:Children|Name}"`.
 */
export const RootElementRegex = /({ELEMENT:)([^|}]+)(})/g
/**
 * The regex used for matching `{ELEMENT:<elementName>|<nestedElementName>}`
 * tags in the OneBlink platform. Includes nested elements based on the '|'
 * character. {ELEMENT:Children|Name} would be matched. Will match
 * `"{ELEMENT:Parent_Name}"` and `"{ELEMENT:Children|Name}"`.
 */
export const NestedElementRegex = /({ELEMENT:)([^}]+)(})/g

/**
 * Takes a string and calls a provided handler function for each found instance
 * of `{ELEMENT:<elementName>}` in the string. Used to replace values in
 * OneBlink calculation and info (HTML) elements.
 *
 * #### Example
 *
 * ```js
 * formElementsService.matchElementsTagRegex(
 *   myString,
 *   ({ elementName, elementMatch }) => {
 *     const v = submission[elementName]
 *     myString = myString.replace(elementMatch, v)
 *   },
 * )
 * ```
 *
 * @param data
 * @param handler
 * @returns
 */
export function matchElementsTagRegex(
  data: string,
  matchHandler: (options: {
    elementName: string
    elementMatch: string
  }) => void,
  /**
   * Determine if only root level elements should be matched.
   *
   * `false` will match `"{ELEMENT:Parent_Name}"` and
   * `"{ELEMENT:Children|Name}"`.
   *
   * `true` will match `"{ELEMENT:Parent_Name}"` but will NOT replace
   * `{ELEMENT:Children|Name}`.
   */
  rootFormElementsOnly: boolean,
) {
  let matches
  while (
    (matches = (
      rootFormElementsOnly ? RootElementRegex : NestedElementRegex
    ).exec(data)) !== null
  ) {
    if (matches?.length < 3) continue

    const elementName = matches[2]
    matchHandler({ elementName, elementMatch: matches[0] })
  }
}
