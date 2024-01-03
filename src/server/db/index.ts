import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import { env } from '~/env';
import * as schema from './schema';

const queryClient = postgres(env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });
