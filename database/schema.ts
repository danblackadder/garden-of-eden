import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  char,
  datetime,
  index,
  json,
  mediumint,
  mysqlTable,
  smallint,
  tinyint,
  unique,
  varchar,
} from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';

export const userTable = mysqlTable('users', {
  id: mediumint('id', { unsigned: true }).primaryKey().notNull(),
  username: varchar('username', {
    length: 32,
  }).notNull(),
  role: varchar('role', {
    length: 10,
    enum: ['user', 'owner'],
  })
    .default('user')
    .notNull(),
  registered_on: datetime('registered_on')
    .default(sql`NOW()`)
    .notNull(),
});

export const userSettingsTable = mysqlTable('user_settings', {
  user_id: mediumint('user_id', {
    unsigned: true,
  })
    .primaryKey()
    .references(() => userTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  gardenFrequency: smallint('gardenFrequency').notNull().default(30),
  gardenPerPage: smallint('gardenPerPage').notNull().default(50),
  seedTrayFrequency: smallint('seedTrayFrequency').notNull().default(30),
  seedTrayPerPage: smallint('seedTrayPerPage').notNull().default(50),
  sort: varchar('sort', {
    length: 32,
    enum: ['Youngest First', 'Oldest First'],
  })
    .notNull()
    .default('Youngest First'),
  hatchlingMinAge: tinyint('hatchlingMinAge').notNull().default(0),
  eggMinAge: tinyint('eggMinAge').notNull().default(0),
  showScrollRatio: boolean('showScrollRatio').notNull().default(false),
  autoSeedTray: boolean('autoSeedTray').notNull().default(true),
  siteName: varchar('siteName', {
    length: 5,
    enum: ['Eden', 'Elena'],
  })
    .default('Eden')
    .notNull(),
  highlightClickedDragons: boolean('highlightClickedDragons')
    .notNull()
    .default(true),
});

export const hatcheryTable = mysqlTable(
  'hatchery',
  {
    id: char('id', {
      length: 5,
    })
      .primaryKey()
      .notNull(),
    user_id: mediumint('user_id', {
      unsigned: true,
    })
      .references(() => userTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    in_seed_tray: boolean('in_seed_tray').notNull().default(false),
    in_garden: boolean('in_garden').notNull().default(false),
  },
  (table) => {
    return {
      in_seed_trayIdx: index('in_seed_tray_idx').on(
        table.in_seed_tray,
        table.user_id
      ),
      in_gardenIdx: index('in_garden_idx').on(table.in_garden, table.user_id),
    };
  }
);

export const recordingsTable = mysqlTable(
  'recordings',
  {
    recorded_on: datetime('recorded_on')
      .notNull()
      .default(sql`NOW()`),
    value: bigint('value', { mode: 'number', unsigned: true }).notNull(),
    record_type: varchar('record_type', {
      length: 24,
      enum: ['removed', 'total_dragons', 'total_scrolls'],
    }).notNull(),
    extra: json('extra'),
  },
  (table) => {
    return {
      recorded_onIdx: index('recorded_on_idx').on(table.recorded_on),
      record_typeIdx: index('record_type_idx').on(table.record_type),
    };
  }
);

export const clicksTable = mysqlTable(
  'clicks',
  {
    hatchery_id: char('hatchery_id', {
      length: 5,
    }).notNull(),
    user_id: mediumint('user_id', {
      unsigned: true,
    })
      .references(() => userTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    clicked_on: datetime('clicked_on')
      .notNull()
      .default(sql`NOW()`),
  },
  (table) => {
    return {
      hatchery_id_user_idIdx: unique('hatchery_id_user_id_idx').on(
        table.hatchery_id,
        table.user_id
      ),
    };
  }
);

export const userSettingsSchema = createSelectSchema(userSettingsTable, {
  gardenFrequency: (schema) => schema.gardenFrequency.default(30),
  gardenPerPage: (schema) => schema.gardenPerPage.min(10).default(100),
  seedTrayFrequency: (schema) => schema.seedTrayFrequency.default(30),
  seedTrayPerPage: (schema) => schema.seedTrayPerPage.min(10).default(100),
  sort: (schema) => schema.sort.default('Youngest First'),
  hatchlingMinAge: (schema) => schema.hatchlingMinAge.max(72).min(0).default(0),
  eggMinAge: (schema) => schema.eggMinAge.max(72).min(0).default(0),
  showScrollRatio: (schema) => schema.showScrollRatio.default(true),
  autoSeedTray: (schema) => schema.autoSeedTray.default(true),
  siteName: (schema) => schema.siteName.default('Eden'),
  highlightClickedDragons: (schema) =>
    schema.highlightClickedDragons.default(true),
}).omit({ user_id: true });