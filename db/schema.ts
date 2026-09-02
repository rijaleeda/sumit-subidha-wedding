// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const rsvps = sqliteTable("rsvps", { id: integer("id").primaryKey({ autoIncrement: true }), name: text("name").notNull(), attendance: text("attendance").notNull(), guests: integer("guests").notNull().default(1), adults: integer("adults").notNull().default(0), children: integer("children").notNull().default(0), infants: integer("infants").notNull().default(0), note: text("note").notNull().default(""), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
