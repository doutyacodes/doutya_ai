import {
  boolean,
  date,
  datetime,
  decimal,
  float,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  time,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

// UserDetails Table
export const USER_DETAILS = mysqlTable('user_details', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  mobile: varchar('mobile', { length: 15 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
  is_active: boolean('is_active').default(true),
});

// Courses Table
export const COURSES = mysqlTable('courses', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  language: varchar('language', { length: 100 }).notNull(),
  type: varchar('type', { length: 100 }).notNull().default("story"),
  genre: varchar('genre', { length: 250 }).notNull().default("Any"),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  chapter_content: text('chapter_content').notNull().default(''),
  label: text('label').notNull().default(''),
  created_at: timestamp('created_at').defaultNow(),
  age: int('age').notNull(),
  slug: text('slug').notNull().default(''),
  user_id: int('user_id').references(() => USER_DETAILS.id), // Foreign key referencing the user
  child_id: int('child_id').references(() => CHILDREN.id), // Foreign key referencing the child
});

// Modules Table
export const MODULES = mysqlTable('modules', {
  id: int('id').primaryKey().autoincrement(),
  course_id: int('course_id').notNull(), // Foreign key referencing the course
  module_number: int('module_number').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
});

// Subtopics Table
export const SUBTOPICS = mysqlTable('subtopics', {
  id: int('id').primaryKey().autoincrement(),
  module_id: int('module_id').notNull(), // Foreign key referencing the module
  title: varchar('title', { length: 255 }).notNull(),
  slug: text('slug').notNull().default(''),
  content: text('content').notNull(),
});

// Keywords Table
export const KEYWORDS = mysqlTable('keywords', {
  id: int('id').primaryKey().autoincrement(),
  keyword: varchar('keyword', { length: 100 }).notNull().unique(),
});

// Courses_Keywords Table
export const COURSES_KEYWORDS = mysqlTable('courses_keywords', {
  course_id: int('course_id').notNull(),
  keyword_id: int('keyword_id').notNull(),
});

// Children Table
export const CHILDREN = mysqlTable('children', {
  id: int('id').primaryKey().autoincrement(),
  user_id: int('user_id').references(() => USER_DETAILS.id), // Foreign key referencing the user
  name: varchar('name', { length: 255 }).notNull(),
  gender: mysqlEnum('gender', ['male', 'female', 'other']).notNull(), // Enum for gender
  age: int('age').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});
