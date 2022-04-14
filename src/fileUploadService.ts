/**
 * Attempts to get the content disposition for the header by compiling a string
 * of UTF-8 formatting based on the file name.
 *
 * #### Example
 *
 * ```js
 * const contentDisposition =
 *   fileUploadService.getContentDisposition(fileName)
 * ```
 *
 * @param filename The name of the file being uploaded
 * @returns
 */
export function getContentDisposition(filename: string): string {
  return `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
}
