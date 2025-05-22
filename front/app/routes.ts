import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  index('routes/lp.tsx'),
  route('auth', 'routes/auth.tsx'),
  layout(
    'layouts/protected.tsx',
    prefix('app', [
      index('routes/dashboard.tsx'),
      route('holding/:holdingId', 'routes/holding.tsx'),
      route('onboarding', 'routes/onboarding.tsx'),
    ]),
  ),
] satisfies RouteConfig
