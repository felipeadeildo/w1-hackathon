import { BarChart3, LineChart, PieChart } from 'lucide-react'

const SimulatorSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id='simulator' className='py-16 bg-muted scroll-mt-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <div className='flex justify-center gap-4 mb-4'>
            <BarChart3 className='h-8 w-8 text-primary' />
            <LineChart className='h-8 w-8 text-primary' />
            <PieChart className='h-8 w-8 text-primary' />
          </div>
          <h2 className='text-3xl font-light text-foreground mb-2'>Calcule sua Economia</h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Use nosso simulador para descobrir quanto você pode economizar com uma holding
            patrimonial
          </p>
        </div>
        <div className='max-w-3xl mx-auto'>{children}</div>
      </div>
    </div>
  )
}

export default SimulatorSection
