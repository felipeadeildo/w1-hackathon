import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

const clientes = [
  {
    nome: 'Maria Silva',
    email: 'maria@exemplo.com',
    ativo: true,
    onboarding: 100,
    documentos: { enviados: 5, validados: 5, rejeitados: 0 },
    perfil: { cpf: '123.456.789-00', telefone: '(11) 99999-0000', estado_civil: 'Casada' },
    dependentes: 2,
    holdings: 1,
    consultor: false,
    admin: false,
  },
  {
    nome: 'João Souza',
    email: 'joao@exemplo.com',
    ativo: false,
    onboarding: 60,
    documentos: { enviados: 3, validados: 2, rejeitados: 1 },
    perfil: { cpf: '987.654.321-00', telefone: '(21) 98888-1111', estado_civil: 'Solteiro' },
    dependentes: 0,
    holdings: 2,
    consultor: false,
    admin: false,
  },
  {
    nome: 'Ana Admin',
    email: 'ana@admin.com',
    ativo: true,
    onboarding: 100,
    documentos: { enviados: 10, validados: 10, rejeitados: 0 },
    perfil: { cpf: '111.222.333-44', telefone: '(31) 97777-2222', estado_civil: 'Casada' },
    dependentes: 1,
    holdings: 3,
    consultor: false,
    admin: true,
  },
  {
    nome: 'Carlos Consultor',
    email: 'carlos@consultor.com',
    ativo: true,
    onboarding: 100,
    documentos: { enviados: 8, validados: 8, rejeitados: 0 },
    perfil: { cpf: '555.666.777-88', telefone: '(41) 96666-3333', estado_civil: 'Divorciado' },
    dependentes: 0,
    holdings: 0,
    consultor: true,
    admin: false,
  },
]

const totalClientes = clientes.length
const totalConsultores = clientes.filter((c) => c.consultor).length
const totalAdmins = clientes.filter((c) => c.admin).length
const totalAtivos = clientes.filter((c) => c.ativo).length
const totalDocs = clientes.reduce((acc, c) => acc + c.documentos.enviados, 0)
const totalValidados = clientes.reduce((acc, c) => acc + c.documentos.validados, 0)
const totalRejeitados = clientes.reduce((acc, c) => acc + c.documentos.rejeitados, 0)

export default function AdminDashboardPage() {
  return (
    <div className='container mx-auto py-8 space-y-8'>
      <h1 className='text-3xl font-bold mb-4'>Dashboard Administrativo</h1>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <span className='text-2xl font-semibold'>{totalClientes}</span>
            <div className='text-xs text-muted-foreground'>Ativos: {totalAtivos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Consultores</CardTitle>
          </CardHeader>
          <CardContent>
            <span className='text-2xl font-semibold'>{totalConsultores}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <span className='text-2xl font-semibold'>{totalAdmins}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className='text-2xl font-semibold'>{totalDocs}</span>
            <div className='text-xs text-muted-foreground'>
              Validados: {totalValidados} | Rejeitados: {totalRejeitados}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Onboarding</TableHead>
                <TableHead>Documentos</TableHead>
                <TableHead>Dependentes</TableHead>
                <TableHead>Consultor</TableHead>
                <TableHead>Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((c) => (
                <TableRow key={c.email}>
                  <TableCell>{c.nome}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>
                    <Badge variant={c.ativo ? 'default' : 'destructive'}>
                      {c.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Progress value={c.onboarding} className='mb-1' />
                    <span className='text-xs'>{c.onboarding}%</span>
                  </TableCell>
                  <TableCell>
                    <span className='block text-xs'>Enviados: {c.documentos.enviados}</span>
                    <span className='block text-xs'>Validados: {c.documentos.validados}</span>
                    <span className='block text-xs'>Rejeitados: {c.documentos.rejeitados}</span>
                  </TableCell>
                  <TableCell>{c.dependentes}</TableCell>
                  <TableCell>{c.consultor && <Badge variant='secondary'>Sim</Badge>}</TableCell>
                  <TableCell>{c.admin && <Badge variant='secondary'>Sim</Badge>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
