import { Injectable } from '@nestjs/common';
import { Readable } from 'node:stream';
import { ofetch, $Fetch } from 'ofetch';
import { ConfigService } from '@nestjs/config';
import { parse, format } from 'date-fns';
import { EnvironmentVariables } from '~/env.interface';
import { type MovieDetailsType } from '~/movies/movie-details.type';
import { type MoviesListType } from '~/movies/movies-list.type';

function formatDate(str: string) {
  const date = parse(str, 'yyyy-MM-dd', new Date());
  return format(date, 'PPP');
}

async function importReactPdf() {
  const module = await (eval(`import('@react-pdf/renderer')`) as Promise<
    typeof import('@react-pdf/renderer')
  >);
  return module.default;
}

async function importPlimit() {
  const module = await (eval("import('p-limit')") as Promise<
    typeof import('p-limit')
  >);
  return module.default;
}

@Injectable()
export class MoviesService {
  tmdbFetch: $Fetch;

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.tmdbFetch = ofetch.create({ baseURL: configService.get('TMDB_API') });
  }

  private async fetchMoviesList() {
    const { results: movies } = await this.tmdbFetch<MoviesListType>(
      '/movie/popular',
      {
        query: { api_key: this.configService.get('TMDB_KEY') },
      },
    );

    let moviesPopulated: MovieDetailsType[] = [];

    const pLimit = await importPlimit();
    const MAX_PARALLEL_REQUESTS = Number(
      this.configService.get('MAX_PARALLEL_REQUESTS'),
    );
    const limit = pLimit(MAX_PARALLEL_REQUESTS);
    const populateMoviesList = movies.map((movie) =>
      limit(async () => {
        const kkkk = await this.fetchMovieDetails(movie.id);
        moviesPopulated = [...moviesPopulated, kkkk];
      }),
    );
    await Promise.all(populateMoviesList);

    return moviesPopulated;
  }

  private fetchMovieDetails(id: number) {
    const movie = this.tmdbFetch<MovieDetailsType>(`/movie/${id}`, {
      query: { api_key: this.configService.get('TMDB_KEY') },
    });
    return movie;
  }

  async generateMoviesList() {
    const {
      Page,
      Text,
      View,
      Document,
      StyleSheet,
      renderToStream,
      Link,
      Font,
      Image,
    } = await importReactPdf();

    Font.register({
      family: 'Work Sans',
      // https://fontsource.org/fonts/work-sans/cdn
      fonts: [
        {
          src: 'https://cdn.jsdelivr.net/fontsource/fonts/work-sans@latest/latin-700-italic.ttf',
          fontWeight: 700,
          fontStyle: 'italic',
        },
      ],
    });
    Font.register({
      family: 'Merriweather Sans',
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/merriweather-sans@latest/latin-400-normal.ttf',
    });

    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FEF1E0',
      },
      container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '16px',
        rowGap: '16px',
      },
      title: {
        fontSize: '48px',
        color: '#3F0632',
        fontFamily: 'Work Sans',
        fontStyle: 'italic',
        fontWeight: 700,
        maxHeight: '256px',
        textOverflow: 'ellipsis',
      },
      info: {
        fontSize: '24px',
        fontFamily: 'Merriweather Sans',
        color: '#A47F1A',
      },
      poster: {
        flexBasis: '500px',
        flexGrow: 0,
        borderWidth: '32px',
        borderStyle: 'solid',
        borderColor: '#3B2E2A',
      },
    });

    const MoviesList = ({ movies }: { movies: MovieDetailsType[] }) => (
      <Document>
        {movies.map((movie) => (
          <Page key={movie.id} size="A4" style={styles.page}>
            <View style={styles.container}>
              {movie.homepage ? (
                <Link style={styles.title} src={movie.homepage}>
                  {movie.title}
                </Link>
              ) : (
                <Text style={styles.title}>{movie.title}</Text>
              )}
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                style={styles.poster}
              ></Image>
              {movie.vote_average !== 0 && (
                <Text style={styles.info}>
                  Rated {movie.vote_average} on average
                </Text>
              )}
              <Text style={styles.info}>
                Available on {formatDate(movie.release_date)}
              </Text>
            </View>
          </Page>
        ))}
      </Document>
    );

    const movies = await this.fetchMoviesList();
    const MoviesListStream = await renderToStream(
      <MoviesList movies={movies} />,
    );
    const MoviesListPdf = new Readable().wrap(MoviesListStream);

    return MoviesListPdf;
  }

  async generateMovieDetailsPdf(id: number) {
    const {
      Page,
      Text,
      View,
      Document,
      StyleSheet,
      renderToStream,
      Font,
      Image,
    } = await importReactPdf();

    Font.register({
      family: 'Work Sans',
      // https://fontsource.org/fonts/work-sans/cdn
      fonts: [
        {
          src: 'https://cdn.jsdelivr.net/fontsource/fonts/work-sans@latest/latin-700-italic.ttf',
          fontWeight: 700,
          fontStyle: 'italic',
        },
      ],
    });
    Font.register({
      family: 'Merriweather Sans',
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/merriweather-sans@latest/latin-400-normal.ttf',
    });

    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FEF1E0',
      },
      container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '16px',
        rowGap: '16px',
      },
      title: {
        fontSize: '48px',
        color: '#3F0632',
        fontFamily: 'Work Sans',
        fontStyle: 'italic',
        fontWeight: 700,
        maxHeight: '256px',
        textOverflow: 'ellipsis',
      },
      info: {
        fontSize: '24px',
        fontFamily: 'Merriweather Sans',
        color: '#A47F1A',
      },
      poster: {
        flexBasis: '500px',
        flexGrow: 0,
        borderWidth: '32px',
        borderStyle: 'solid',
        borderColor: '#3B2E2A',
      },
    });

    const MovieDetails = ({
      title,
      poster_path,
      release_date,
      vote_average,
    }: MovieDetailsType) => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Image
              src={`https://image.tmdb.org/t/p/original${poster_path}`}
              style={styles.poster}
            ></Image>
            {vote_average !== 0 && (
              <Text style={styles.info}>Rated {vote_average} on average</Text>
            )}
            <Text style={styles.info}>
              Available on {formatDate(release_date)}
            </Text>
          </View>
        </Page>
      </Document>
    );

    const movie = await this.fetchMovieDetails(id);
    const MovieDetailsStream = await renderToStream(
      <MovieDetails {...movie} />,
    );
    const MovieDetailsPdf = new Readable().wrap(MovieDetailsStream);

    return MovieDetailsPdf;
  }
}
