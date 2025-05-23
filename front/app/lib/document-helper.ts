import type { UploadProgressEvent } from '~/types/document'

/**
 * Creates a function that can be used as an onChange handler for file inputs
 *
 * @param onFileSelected Callback that will receive the prepared document upload
 * @returns A function that can be used as an onChange handler for file inputs
 */
export function createFileInputHandler(callback: (file: File) => void) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      console.error('No file selected')
      return
    }

    // Call the callback with the actual File object
    callback(file)

    // Reset the input to allow selecting the same file again
    event.target.value = ''
  }
}

/**
 * Creates a progress handler that formats the progress as a percentage
 *
 * @param onProgressPercent Callback that will receive the progress as a percentage (0-100)
 * @returns A function that can be used as a progress handler
 */
export function createProgressHandler(
  onProgressPercent: (percent: number) => void,
): (event: UploadProgressEvent) => void {
  return (event: UploadProgressEvent) => {
    const percent = Math.round(event.progress * 100)
    onProgressPercent(percent)
  }
}
