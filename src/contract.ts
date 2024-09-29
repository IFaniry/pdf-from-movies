import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { Readable } from 'node:stream';
import { MovieNotFoundSchema } from '~/movies/movie-details.type';

const c = initContract();

export const contract = c.router({
  getMoviesList: {
    method: 'GET',
    path: '/movies',
    responses: {
      200: z.instanceof(Readable),
    },
    summary: 'Generate a PDF from popular movies',
  },
  getMovieDetails: {
    method: 'GET',
    path: `/movies/:id`,
    responses: {
      200: z.instanceof(Readable),
      404: MovieNotFoundSchema,
    },
    summary: 'Generate a PDF from a movie by id',
  },
});
