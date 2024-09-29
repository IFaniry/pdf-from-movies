import { z } from 'zod';

export const MovieDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  homepage: z.string(),
  release_date: z.string(),
  vote_average: z.number(),
  poster_path: z.string(),
});

export type MovieDetailsType = {
  id: number;
  title: string;
  homepage: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
};

export const MovieNotFoundSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
});

export type MovieNotFoundType = {
  statusCode: number;
  message: string;
};
