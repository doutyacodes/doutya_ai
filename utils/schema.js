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
    id: int('id').primaryKey().autoincrement(), // Unique identifier for each user
    name: varchar('name', { length: 255 }).notNull(), // User's name
    email: varchar('email', { length: 255 }).notNull().unique(), // User's email, must be unique
    password: varchar('password', { length: 255 }).notNull(), // User's hashed password
    profile_picture: varchar('profile_picture', { length: 255 }).default(''), // URL to user's profile picture (optional)
    created_at: timestamp('created_at').defaultNow(), // Timestamp for when the user was created
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(), // Timestamp for when the user details were last updated
    is_active: boolean('is_active').default(true), // Flag to indicate if the user is active
  });
  
  // Courses Table
  export const COURSES = mysqlTable('courses', {
    id: int('id').primaryKey().autoincrement(), // Unique identifier for each course
    name: varchar('name', { length: 255 }).notNull(), // Course name
    language: varchar('language', { length: 100 }).notNull(), // Language of the course
    type: varchar('type', { length: 100 }).notNull().default("story"), // Language of the course
    difficulty: varchar('difficulty', { length: 50 }).notNull(), // Difficulty level
    chapter_content: text('chapter_content').notNull().default(''), // Provide a default empty string
    created_at: timestamp('created_at').defaultNow(), // Timestamp for when the course was created
    age: int('age').notNull()
  });
  
  // Keywords Table
  export const KEYWORDS = mysqlTable('keywords', {
    id: int('id').primaryKey().autoincrement(), // Unique identifier for each keyword
    keyword: varchar('keyword', { length: 100 }).notNull().unique(), // Keyword text
  });
  
  // Courses_Keywords Table
  export const COURSES_KEYWORDS = mysqlTable('courses_keywords', {
    course_id: int('course_id').notNull(), // Foreign key referencing courses table
    keyword_id: int('keyword_id').notNull(), // Foreign key referencing keywords table
  });
  