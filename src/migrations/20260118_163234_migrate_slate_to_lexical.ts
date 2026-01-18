import {
  MigrateDownArgs,
  MigrateUpArgs,
} from '@payloadcms/db-mongodb'
import { migrateSlateToLexical } from '@payloadcms/richtext-lexical/migrate'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await migrateSlateToLexical({ payload })
}

export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  payload.logger.info('No down migration available for Slate to Lexical conversion')
  payload.logger.info('You would need to restore from a database backup to revert')
}
