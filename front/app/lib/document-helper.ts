import type { UUID } from 'crypto'
import type { DocumentUpload, UploadProgressEvent } from '~/types/document'

/**
 * Helper function to prepare document upload data from a file input
 *
 * @param requirementId The ID of the document requirement
 * @param file The file from the file input
 * @returns A DocumentUpload object with file data
 */
export function prepareDocumentUpload(
  requirementId: UUID,
  file: File,
): DocumentUpload & { file: File } {
  return {
    requirement_id: requirementId,
    file_path: '', // Will be set by the server
    original_filename: file.name,
    file_type: file.name.split('.').pop() || '',
    file_size: file.size,
    content_type: file.type,
    file: file,
  }
}

/**
 * Creates a function that can be used as an onChange handler for file inputs
 *
 * @param onFileSelected Callback that will receive the prepared document upload
 * @returns A function that can be used as an onChange handler for file inputs
 */
export function createFileInputHandler(
  onFileSelected: (documentUpload: DocumentUpload & { file: File }) => void,
  requirementId: UUID,
): (event: React.ChangeEvent<HTMLInputElement>) => void {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const documentUpload = prepareDocumentUpload(requirementId, file)
      onFileSelected(documentUpload)
    }
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
