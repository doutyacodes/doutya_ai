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
export const USER_DETAILS = mysqlTable("user_details", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  mobile: varchar("mobile", { length: 15 }).notNull().unique(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  is_active: boolean("is_active").default(true),
});

// Courses Table
export const COURSES = mysqlTable("courses", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  language: varchar("language", { length: 100 }).notNull(),
  type: varchar("type", { length: 100 }).notNull().default("story"),
  genre: varchar("genre", { length: 250 }).notNull().default("Any"),
  difficulty: varchar("difficulty", { length: 50 }).notNull(),
  chapter_content: text("chapter_content").notNull().default(""),
  label: text("label").notNull().default(""),
  created_at: timestamp("created_at").defaultNow(),
  age: int("age").notNull(),
  slug: text("slug").notNull().default(""),
  user_id: int("user_id").references(() => USER_DETAILS.id), // Foreign key referencing the user
  child_id: int("child_id").references(() => CHILDREN.id), // Foreign key referencing the child
});

// Modules Table
export const MODULES = mysqlTable("modules", {
  id: int("id").primaryKey().autoincrement(),
  course_id: int("course_id").notNull(), // Foreign key referencing the course
  module_number: int("module_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
});

// Subtopics Table
export const SUBTOPICS = mysqlTable("subtopics", {
  id: int("id").primaryKey().autoincrement(),
  module_id: int("module_id").notNull(), // Foreign key referencing the module
  title: varchar("title", { length: 255 }).notNull(),
  slug: text("slug").notNull().default(""),
  content: text("content").notNull(),
});

// Keywords Table
export const KEYWORDS = mysqlTable("keywords", {
  id: int("id").primaryKey().autoincrement(),
  keyword: varchar("keyword", { length: 100 }).notNull().unique(),
});

// Courses_Keywords Table
export const COURSES_KEYWORDS = mysqlTable("courses_keywords", {
  course_id: int("course_id").notNull(),
  keyword_id: int("keyword_id").notNull(),
});

// Children Table
export const CHILDREN = mysqlTable("children", {
  id: int("id").primaryKey().autoincrement(),
  user_id: int("user_id").references(() => USER_DETAILS.id), // Foreign key referencing the user
  name: varchar("name", { length: 255 }).notNull(),
  gender: mysqlEnum("gender", ["male", "female", "other"]).notNull(), // Enum for gender
  age: int("age").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const ACTIVITIES = mysqlTable("activities", {
  id: int("id").primaryKey().autoincrement(),
  course_id: int("course_id")
    .references(() => COURSES.id)
    .notNull(), // Foreign key referencing the course
  title: text("title").notNull(), // Title as text type
  language: varchar("language", { length: 100 }).notNull(),
  genre: varchar("genre", { length: 250 }).notNull(),
  difficulty: varchar("difficulty", { length: 50 }).notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const USER_ACTIVITIES = mysqlTable("user_activities", {
  id: int("id").primaryKey().autoincrement(),
  user_id: int("user_id")
    .references(() => USER_DETAILS.id)
    .notNull(),
  course_id: int("course_id")
    .references(() => COURSES.id)
    .notNull(),
  activity_id: int("activity_id")
    .references(() => ACTIVITIES.id)
    .notNull(),
  image: varchar("image", { length: 255 }),
  completion_status: boolean("completion_status").default(false),
  feedback: text("feedback"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const QUIZ_SEQUENCES = mysqlTable("quiz_sequences", {
  id: int("id").primaryKey().autoincrement(),
  type_sequence: text("type_sequence").notNull().default(""),
  user_id: int("user_id")
    .references(() => USER_DETAILS.id)
    .notNull(), // Foreign key referencing the user
  child_id: int("child_id")
    .references(() => CHILDREN.id)
    .notNull(), // Foreign key referencing the child
  quiz_id: int("quiz_id").notNull(), // New column for quiz identification
  createddate: datetime("createddate").notNull(),
  isCompleted: boolean("isCompleted").notNull().default(false), // New boolean column
  isStarted: boolean("isStarted").notNull().default(false), // New boolean column
});

// Learn Table
export const LEARN = mysqlTable("learn", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 }), // Stores the URL or path for the image
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Learn Topics Table
export const LEARN_TOPICS = mysqlTable("learn_topics", {
  id: int("id").primaryKey().autoincrement(),
  learn_id: int("learn_id")
    .references(() => LEARN.id)
    .notNull(), // Foreign key to 'learn' table
  title: varchar("title", { length: 255 }).notNull(),
  slug: text("slug").notNull().default(""),
  image: varchar("image", { length: 255 }), // Stores the URL or path for the image
  age: int("age").notNull(), // Recommended age for the topic
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const LEARN_DATA = mysqlTable("learn_data", {
  id: int("id").primaryKey().autoincrement(),
  learn_topic_id: int("learn_topic_id")
    .references(() => LEARN_TOPICS.id)
    .notNull(), // Foreign key to 'learn_topics' table
  explanation: text("explanation").notNull(), // Detailed explanation text
  activity_title: varchar("activity_title", { length: 255 }).notNull(), // Title of the activity
  activity_materials: json("activity_materials").notNull(), // JSON field for materials list
  activity_steps: text("activity_steps").notNull(), // Steps for the activity
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const QUESTIONS = mysqlTable("questions", {
  id: int("id").primaryKey().autoincrement(),
  learn_topic_id: int("learn_topic_id")
    .references(() => LEARN_TOPICS.id)
    .notNull(), // Foreign key to 'learn_topics' table
  question_text: text("question_text").notNull(), // Question text
  type: mysqlEnum("type", ["text", "image", "video", "audio"]).notNull(), // Type of question
  image: varchar("image", { length: 255 }), // Optional image URL
  video: varchar("video", { length: 255 }), // Optional video URL
  audio: varchar("audio", { length: 255 }), // Optional audio URL
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Options Table
export const OPTIONS = mysqlTable("options", {
  id: int("id").primaryKey().autoincrement(),
  question_id: int("question_id")
    .references(() => QUESTIONS.id)
    .notNull(), // Foreign key to 'questions' table
  learn_topic_id: int("learn_topic_id")
    .references(() => LEARN_TOPICS.id)
    .notNull(), // Foreign key to 'learn_topics' for redundancy
  option_text: text("option_text").notNull(), // Option text
  is_answer: boolean("is_answer").notNull().default(false), // Indicates if this option is the correct answer
});

// User Progress Table
export const USER_PROGRESS = mysqlTable("user_progress", {
  id: int("id").primaryKey().autoincrement(),
  user_id: int("user_id")
    .references(() => USER_DETAILS.id)
    .notNull(), // Foreign key referencing the user
  child_id: int("child_id")
    .references(() => CHILDREN.id)
    .notNull(), // Foreign key referencing the child
  question_id: int("question_id")
    .references(() => QUESTIONS.id)
    .notNull(), // Foreign key referencing the question
  completed: boolean("completed").default(false), // Indicates if the question is completed
  score: decimal("score", { precision: 5, scale: 2 }), // Optional score for the question
  created_at: timestamp("created_at").defaultNow(), // Timestamp when the progress record was created
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(), // Timestamp for the last update
});

// Badges Table
export const BADGES = mysqlTable("badges", {
  id: int("id").primaryKey().autoincrement(),
  child_id: int("child_id")
    .references(() => CHILDREN.id)
    .notNull(), // Foreign key to children
  badge_type: mysqlEnum("badge_type", [
    "search",
    "quiz",
    "achievement",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 }),
  learn_topic_id: int("learn_topic_id").references(() => LEARN_TOPICS.id), // Optional foreign key to learn topics
  search_count: int("search_count"),
  condition: varchar("condition", { length: 255 }), // Condition or criteria for badge
  condition_title: varchar("condition_title", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const USER_BADGES = mysqlTable("user_badges", {
  id: int("id").primaryKey().autoincrement(), // Unique identifier for each record
  child_id: int("child_id")
    .references(() => CHILDREN.id)
    .notNull(), // Foreign key referencing the child
  badge_id: int("badge_id")
    .references(() => BADGES.id)
    .notNull(), // Foreign key referencing the badge
  earned_at: timestamp("earned_at").defaultNow(), // Timestamp for when the badge was earned
});
