import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  index('routes/lp.tsx'),
  route('login', 'routes/login.tsx'),
  route('signup', 'routes/signup.tsx'),
  layout('layouts/protected.tsx', prefix('app', [index('routes/dashboard.tsx')])),
] satisfies RouteConfig
