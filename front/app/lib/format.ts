/**
 * Format a number as Brazilian currency (R$)
 */
export function formatCurrency(value?: number | null): string {
  if (value == null) return 'N/A'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Format a date string to Brazilian format (DD/MM/YYYY)
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'N/A'

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  } catch {
    return dateString
  }
}
