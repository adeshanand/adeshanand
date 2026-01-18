import * as migration_20260118_163234_migrate_slate_to_lexical from './20260118_163234_migrate_slate_to_lexical';

export const migrations = [
  {
    up: migration_20260118_163234_migrate_slate_to_lexical.up,
    down: migration_20260118_163234_migrate_slate_to_lexical.down,
    name: '20260118_163234_migrate_slate_to_lexical',
  },
];
