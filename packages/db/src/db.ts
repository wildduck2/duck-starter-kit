import 'dotenv/config'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { _relations, tables } from './tables'

const client = postgres(process.env.DATABASE_URL!)

// @ts-ignore
export const db = drizzle(client, { ...tables, ..._relations })
