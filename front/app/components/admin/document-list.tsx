import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { useUpdateAdminDocumentStatus } from '~/hooks/use-documents'
import { API_BASE_URL } from '~/lib/httpClient'
import type { Document } from '~/types/document'

type Props = {
  documents: Document[]
}

export function AdminDocumentList({ documents }: Props) {
  const { mutate: updateStatus, isPending: isLoading } = useUpdateAdminDocumentStatus()

  const handleDownload = (doc: Document) => {
    window.open(`${API_BASE_URL}/admin/documents/${doc.id}/download`, '_blank')
  }

  const handleStatusChange = (doc: Document, status: 'validated' | 'invalid') => {
    if (status === 'invalid') {
      const reason = window.prompt('Motivo da rejeição:')
      if (!reason) return
      updateStatus({ documentId: doc.id, status, rejectionReason: reason })
    } else {
      updateStatus({ documentId: doc.id, status })
    }
  }

  if (!documents.length) {
    return <div className='text-center text-muted-foreground'>Nenhum documento encontrado.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead>Arquivo</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>{doc.uploaded_by_id}</TableCell>
            <TableCell>{doc.original_filename}</TableCell>
            <TableCell>{doc.file_type}</TableCell>
            <TableCell>
              <Badge
                variant={
                  doc.status === 'validated'
                    ? 'default'
                    : doc.status === 'invalid'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {doc.status}
              </Badge>
            </TableCell>
            <TableCell className='flex gap-2'>
              <Button size='sm' variant='outline' onClick={() => handleDownload(doc)}>
                Baixar
              </Button>
              <Button
                size='sm'
                onClick={() => handleStatusChange(doc, 'validated')}
                disabled={doc.status === 'validated' || isLoading}
              >
                Aceitar
              </Button>
              <Button
                size='sm'
                variant='destructive'
                onClick={() => handleStatusChange(doc, 'invalid')}
                disabled={doc.status === 'invalid' || isLoading}
              >
                Rejeitar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
