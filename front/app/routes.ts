import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [index('routes/lp.tsx'), route('app', 'routes/home.tsx')] satisfies RouteConfig
