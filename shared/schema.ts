import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull().unique(),
  title: text("title").notNull(),
  overview: text("overview"),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  releaseDate: text("release_date"),
  voteAverage: text("vote_average"),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), 
  movieId: integer("movie_id").notNull().references(() => movies.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const moodHistory = pgTable("mood_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  mood: text("mood").notNull(),
  generatedGenres: jsonb("generated_genres"), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const moviesRelations = relations(movies, ({ many }) => ({
  favoritedBy: many(favorites),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  movie: one(movies, {
    fields: [favorites.movieId],
    references: [movies.id],
  }),
}));

export const insertMovieSchema = createInsertSchema(movies).omit({ id: true });
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true, createdAt: true });
export const insertMoodHistorySchema = createInsertSchema(moodHistory).omit({ id: true, createdAt: true });

export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type MoodHistory = typeof moodHistory.$inferSelect;
