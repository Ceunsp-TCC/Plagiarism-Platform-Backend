import Server from '@ioc:Adonis/Core/Server'

Server.middleware.register([() => import('@ioc:Adonis/Core/BodyParser')])

Server.middleware.registerNamed({
  auth: () => import('App/Middleware/Auth'),
  basicAuth: () => import('App/Middleware/BasicAuth'),
  permission: () => import('App/Middleware/PermissionMiddleware'),
})
