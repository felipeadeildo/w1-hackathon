import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { useAuth } from '~/hooks/use-auth'
import { useOnboardingFlow } from '~/hooks/use-onboarding'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: flow } = useOnboardingFlow()

  // Mock estruturado conforme schemas do LLM chat
  const imoveis = [
    { tipo: 'Apartamento', localizacao: 'São Paulo', valor: 900000, status: 'próprio', area: '120m²' },
    { tipo: 'Casa', localizacao: 'Campinas', valor: 450000, status: 'alugado', area: '85m²' },
  ]
  const participacoes = [
    { empresa: 'XPTO Ltda', segmento: 'Tecnologia', participacao: '40%', faturamento: 'R$ 2M', cnpj: '12.345.678/0001-99' },
    { empresa: 'Agro S/A', segmento: 'Agronegócio', participacao: '15%', faturamento: 'R$ 1M', cnpj: '98.765.432/0001-11' },
  ]
  const investimentos = [
    { tipo: 'CDB', valor: 120000, instituicao: 'Banco XP', data_aplicacao: '2023-01-10' },
    { tipo: 'Ações', valor: 80000, instituicao: 'Clear', data_aplicacao: '2022-08-15' },
  ]
  const outrosAtivos = [
    { tipo: 'Veículo', descricao: 'BMW X1', valor: 150000 },
    { tipo: 'Obra de Arte', descricao: 'Quadro Portinari', valor: 300000 },
  ]
  const estruturaFamiliar = {
    estado_civil: 'Casado',
    regime_bens: 'Comunhão parcial',
    conjuge: { nome: 'Ana Silva', idade: 38, ocupacao: 'Médica' },
    filhos: [
      { nome: 'Lucas', idade: 12, ocupacao: null },
      { nome: 'Marina', idade: 8, ocupacao: null },
    ],
    outros_dependentes: [{ nome: 'Joaquim', idade: 65, ocupacao: 'Pensionista' }],
    observacoes: 'Pessoa com deficiência visual.',
  }

  const patrimonio =
    imoveis.reduce((acc, i) => acc + i.valor, 0) +
    investimentos.reduce((acc, i) => acc + i.valor, 0) +
    outrosAtivos.reduce((acc, a) => acc + a.valor, 0)

  const onboardingPercent = flow
    ? Math.round(
        (flow.user_steps.filter((s) => s.is_completed).length / flow.user_steps.length) * 100,
      )
    : 0

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-2">
        Bem-vindo, {user?.profile.full_name || user?.email || 'Usuário'}!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patrimônio Total</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold text-primary">
              R$ {patrimonio.toLocaleString('pt-BR')}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Progresso do Onboarding</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={onboardingPercent} className="mb-2" />
            <span className="text-sm">
              {onboardingPercent}% concluído
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Imóveis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {imoveis.map((i) => (
                <li key={i.tipo + i.localizacao} className="flex justify-between">
                  <span>
                    {i.tipo} - {i.localizacao} ({i.area})
                  </span>
                  <span className="font-semibold">R$ {i.valor.toLocaleString('pt-BR')}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Participações Societárias</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>Participação</TableHead>
                  <TableHead>Faturamento</TableHead>
                  <TableHead>CNPJ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participacoes.map((p) => (
                  <TableRow key={p.empresa}>
                    <TableCell>{p.empresa}</TableCell>
                    <TableCell>{p.segmento}</TableCell>
                    <TableCell>{p.participacao}</TableCell>
                    <TableCell>{p.faturamento}</TableCell>
                    <TableCell>{p.cnpj}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Instituição</TableHead>
                  <TableHead>Data Aplicação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investimentos.map((inv, idx) => (
                  <TableRow key={inv.tipo + idx}>
                    <TableCell>{inv.tipo}</TableCell>
                    <TableCell>R$ {inv.valor.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{inv.instituicao}</TableCell>
                    <TableCell>{inv.data_aplicacao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Outros Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outrosAtivos.map((a, idx) => (
                  <TableRow key={a.tipo + idx}>
                    <TableCell>{a.tipo}</TableCell>
                    <TableCell>{a.descricao}</TableCell>
                    <TableCell>R$ {a.valor.toLocaleString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Estrutura Familiar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <span className="font-semibold">Estado civil:</span> {estruturaFamiliar.estado_civil}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Regime de bens:</span> {estruturaFamiliar.regime_bens}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Cônjuge:</span> {estruturaFamiliar.conjuge.nome} ({estruturaFamiliar.conjuge.idade} anos, {estruturaFamiliar.conjuge.ocupacao})
            </div>
            <div className="mb-2">
              <span className="font-semibold">Filhos:</span>{' '}
              {estruturaFamiliar.filhos.map((f) => `${f.nome} (${f.idade} anos)`).join(', ')}
            </div>
            <div>
              <span className="font-semibold">Outros dependentes:</span>{' '}
              {estruturaFamiliar.outros_dependentes.length
                ? estruturaFamiliar.outros_dependentes.map((d) => d.nome).join(', ')
                : 'Nenhum'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
