import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  APP_URL: Env.schema.string(),
  DRIVE_DISK: Env.schema.enum(['local'] as const),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  TZ: Env.schema.string(),
  SCHOOL_GUARDIAN_AUTHENTICATOR_USERNAME: Env.schema.string(),
  SCHOOL_GUARDIAN_AUTHENTICATOR_PASSWORD: Env.schema.string(),
  PLAGIARISM_SEARCH_API_URL: Env.schema.string(),
  PLAGIARISM_SEARCH_API_USER: Env.schema.string(),
  PLAGIARISM_SEARCH_API_KEY: Env.schema.string(),
  VIACEP_API: Env.schema.string(),
  NTFY_API: Env.schema.string(),
  NTFY_TOPIC_NEW_SCHOOL: Env.schema.string(),
})
