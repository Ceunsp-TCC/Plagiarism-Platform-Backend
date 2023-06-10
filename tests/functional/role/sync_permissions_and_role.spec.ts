import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import UserFactory from 'Database/factories/UserFactory'
import RoleFactory from 'Database/factories/RoleFactory'
import PermissionFactory from 'Database/factories/PermissionFactory'
import Env from '@ioc:Adonis/Core/Env'

const url = '/v1/roles/sync-roles-permissions'
const urlLogin = '/v1/auth/login'
test.group('Sync permissions and roles', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('Should be sync roles and permissions', async ({ client }) => {
    const user = await UserFactory.apply('admin').apply('defaultPassword').create()
    const role = await RoleFactory.create()
    const permissions = await PermissionFactory.createMany(4)

    const login = await client
      .post(urlLogin)
      .basicAuth(
        Env.get('PLAGIARISM_PLATFORM_AUTHENTICATOR_USERNAME'),
        Env.get('PLAGIARISM_PLATFORM_AUTHENTICATOR_PASSWORD')
      )
      .json({
        email: user.email,
        password: 'Alpha@12',
        deviceName: 'browser',
      })
    const sut = await client
      .post(url)
      .bearerToken(login.response.body.content.accessToken.token)
      .json({
        roleName: role.name,
        permissions: permissions.map((permission) => permission.name),
      })

    sut.assertStatus(200)
    sut.assertBodyContains({ message: 'Synchronized permissions with the role successfully' })
  })

  test('Should be sync roles  permissions is empty', async ({ client }) => {
    const user = await UserFactory.apply('admin').apply('defaultPassword').create()
    const role = await RoleFactory.create()

    const login = await client
      .post(urlLogin)
      .basicAuth(
        Env.get('PLAGIARISM_PLATFORM_AUTHENTICATOR_USERNAME'),
        Env.get('PLAGIARISM_PLATFORM_AUTHENTICATOR_PASSWORD')
      )
      .json({
        email: user.email,
        password: 'Alpha@12',
        deviceName: 'browser',
      })
    const sut = await client
      .post(url)
      .bearerToken(login.response.body.content.accessToken.token)
      .json({
        roleName: role.name,
        permissions: null,
      })

    sut.assertStatus(422)
    sut.assertBody({ permissions: ['required validation failed'] })
  })
  test('Should be sync roles  role name is empty', async ({ client }) => {
    const user = await UserFactory.apply('admin').apply('defaultPassword').create()
    const permissions = await PermissionFactory.createMany(4)

    const login = await client
      .post(urlLogin)
      .basicAuth(
        Env.get('PLAGIARISM_PLATFORM_AUTHENTICATOR_USERNAME'),
        Env.get('PLAGIARISM_PLATFORM_AUTHENTICATOR_PASSWORD')
      )
      .json({
        email: user.email,
        password: 'Alpha@12',
        deviceName: 'browser',
      })
    const sut = await client
      .post(url)
      .bearerToken(login.response.body.content.accessToken.token)
      .json({
        roleName: null,
        permissions: permissions.map((permission) => permission.name),
      })

    sut.assertStatus(422)
    sut.assertBody({ roleName: ['required validation failed'] })
  })
  test('Should be role not found', async ({ client }) => {
    const user = await UserFactory.apply('admin').apply('defaultPassword').create()
    const permissions = await PermissionFactory.createMany(4)

    const login = await client
      .post(urlLogin)
      .basicAuth(
        Env.get('PLAGIARISM_PLATFORM_AUTHENTICATOR_USERNAME'),
        Env.get('PLAGIARISM_PLATFORM_AUTHENTICATOR_PASSWORD')
      )
      .json({
        email: user.email,
        password: 'Alpha@12',
        deviceName: 'browser',
      })
    const sut = await client
      .post(url)
      .bearerToken(login.response.body.content.accessToken.token)
      .json({
        roleName: 'TESTE',
        permissions: permissions.map((permission) => permission.name),
      })

    sut.assertStatus(404)
    sut.assertBodyContains({ message: 'Role not found' })
  })
  test('Should be permission not found', async ({ client }) => {
    const user = await UserFactory.apply('admin').apply('defaultPassword').create()
    const role = await RoleFactory.create()
    const login = await client
      .post(urlLogin)
      .basicAuth(
        Env.get('PLAGIARISM_PLATFORM_AUTHENTICATOR_USERNAME'),
        Env.get('PLAGIARISM_PLATFORM_AUTHENTICATOR_PASSWORD')
      )
      .json({
        email: user.email,
        password: 'Alpha@12',
        deviceName: 'browser',
      })
    const permissions = ['TESTE1', 'TESTE2']
    const sut = await client
      .post(url)
      .bearerToken(login.response.body.content.accessToken.token)
      .json({
        roleName: role.name,
        permissions,
      })

    sut.assertStatus(404)
    sut.assertBodyContains({ message: `These permissions do not exist: ${permissions}` })
  })
  test('Should be permissions duplicated', async ({ client }) => {
    const user = await UserFactory.apply('admin').apply('defaultPassword').create()
    const role = await RoleFactory.create()
    const permissions = await PermissionFactory.createMany(4)

    const login = await client
      .post(urlLogin)
      .basicAuth(
        Env.get('PLAGIARISM_PLATFORM_AUTHENTICATOR_USERNAME'),
        Env.get('PLAGIARISM_PLATFORM_AUTHENTICATOR_PASSWORD')
      )
      .json({
        email: user.email,
        password: 'Alpha@12',
        deviceName: 'browser',
      })

    const sut = await client
      .post(url)
      .bearerToken(login.response.body.content.accessToken.token)
      .json({
        roleName: role.name,
        permissions: [...permissions.map((permission) => permission.name), permissions[0].name],
      })

    sut.assertStatus(404)
    sut.assertBodyContains({ message: `There are duplicate permissions: ${permissions[0].name}` })
  })
})
