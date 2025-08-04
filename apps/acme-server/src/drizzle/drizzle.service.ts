import { _relations, tables } from '@acme/db/tables'
import { ConfigService } from '@nestjs/config'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

export const schema = {
  ...tables,
  ..._relations,
}

export const DrizzleAsyncProvider = 'DrizzleAsyncProvider'

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const connectionString = configService.get<string>('DATABASE_URL')
      const pool = new Pool({ connectionString })
      const _drizzle = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>
      console.log('✅ Drizzle Connection initialized')
      return _drizzle
    },
  },
]
