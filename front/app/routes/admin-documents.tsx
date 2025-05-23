import { useEffect } from 'react'
import { AdminDocumentList } from '~/components/admin/document-list'
import { Loading } from '~/components/ui/loading'
import { useAdminDocuments } from '~/hooks/use-documents'

export default function AdminDocumentsPage() {
  const { data, isLoading, error, refetch } = useAdminDocuments()

  useEffect(() => {
    refetch()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading label='Carregando documentos...' />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        Erro ao carregar documentos. Tente novamente.
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Documentos Submetidos</h1>
      <AdminDocumentList documents={data ?? []} />
    </div>
  )
}
