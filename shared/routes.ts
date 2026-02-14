import { z } from 'zod';
import { insertMovieSchema, movies, favorites, moodHistory } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  recommendations: {
    get: {
      method: 'GET' as const,
      path: '/api/recommendations' as const,
      input: z.object({
        mood: z.string(),
      }),
      responses: {
        200: z.object({
          movies: z.array(z.custom<typeof movies.$inferSelect>()),
          mood: z.string(),
          genres: z.array(z.string()),
        }),
      },
    },
  },
  favorites: {
    list: {
      method: 'GET' as const,
      path: '/api/favorites' as const,
      responses: {
        200: z.array(z.object({
            id: z.number(), 
            movie: z.custom<typeof movies.$inferSelect>(),
            userId: z.string(),
            movieId: z.number(),
            createdAt: z.date().nullable(),
        })),
      },
    },
    add: {
      method: 'POST' as const,
      path: '/api/favorites' as const,
      input: insertMovieSchema, 
      responses: {
        201: z.custom<typeof favorites.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    remove: {
      method: 'DELETE' as const,
      path: '/api/favorites/:id' as const, 
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  history: {
    list: {
      method: 'GET' as const,
      path: '/api/history' as const,
      responses: {
        200: z.array(z.custom<typeof moodHistory.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
