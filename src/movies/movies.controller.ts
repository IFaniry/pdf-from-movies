import {
  Controller,
  Get,
  StreamableFile,
  Header,
  Res,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { MoviesService } from '~/movies/movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get('/')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="movies.pdf"')
  async getMoviesList(): Promise<StreamableFile> {
    const pdf = await this.moviesService.generateMoviesList();

    return new StreamableFile(pdf);
  }

  @Get('/:id')
  async getMovieDetails(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const pdf = await this.moviesService.generateMovieDetailsPdf(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="movie-${id}.pdf"`,
    });

    return new StreamableFile(pdf);
  }
}
