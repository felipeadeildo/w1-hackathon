import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  index('routes/lp.tsx'),
  route('auth', 'routes/auth.tsx'),
  layout(
    'layouts/protected.tsx',
    prefix('app', [
      index('routes/dashboard.tsx'),
      route('onboarding', 'routes/onboarding.tsx'),
      ...prefix('admin', [route('documents', 'routes/admin-documents.tsx')]),
    ]),
  ),
] satisfies RouteConfig
