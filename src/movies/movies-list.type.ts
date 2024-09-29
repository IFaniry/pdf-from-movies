import { z } from 'zod';
import {
  type MovieDetailsType,
  MovieDetailsSchema,
} from '~/movies/movie-details.type';

export const MoviesListSchema = z.object({
  page: z.number(),
  results: z.array(MovieDetailsSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type MoviesListType = {
  page: number;
  results: MovieDetailsType[];
  total_pages: number;
  total_results: number;
};
