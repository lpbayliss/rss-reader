import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const doMigrate = async () => {
  // if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
  const connection = postgres(
    'postgresql://lpbayliss:Ahn9ROegQaZ7@ep-hidden-wildflower-31762807-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
    { max: 1 },
  );
  const client = drizzle(connection);
  await migrate(client, {
    migrationsFolder: './drizzle',
  });
};

doMigrate()
  .then(() => {
    console.log('Migration complete.');
    process.exit();
  })
  .catch((e) => {
    console.log('Migration failed.', e);
    process.exit();
  });
