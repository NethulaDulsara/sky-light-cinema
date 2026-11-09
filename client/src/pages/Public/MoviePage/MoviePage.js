// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  Typography,
  Dialog,
  IconButton,
  Avatar,
  Grid
} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CloseIcon from '@material-ui/icons/Close';
import MovieBanner from '../components/MovieBanner/MovieBanner';
import MovieGridCard from '../components/MovieGridCard/MovieGridCard';
import { getMovie, onSelectMovie, getMovies } from '../../../store/actions';
import { youTubeId } from '../../../utils/youtube';
import { onPosterError } from '../../../utils/poster';

const HEAD_FONT = "'Poppins', 'Montserrat', sans-serif";

const useStyles = makeStyles(theme => ({
  body: { background: '#070a10', color: '#fff' },
  inner: { maxWidth: 1080, margin: '0 auto', padding: theme.spacing(7, 3, 10) },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(6)
  },
  metaChip: {
    padding: theme.spacing(0.5, 1.8),
    borderRadius: 999,
    fontSize: '0.78rem',
    fontWeight: 600,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    color: '#bfe9ff',
    border: '1px solid rgba(0,198,255,0.35)',
    background: 'rgba(0,198,255,0.06)'
  },
  section: { marginBottom: theme.spacing(7) },
  sectionHead: {
    fontFamily: HEAD_FONT,
    fontSize: '1.6rem',
    fontWeight: 700,
    marginBottom: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5)
  },
  headBar: {
    width: 6,
    height: 26,
    borderRadius: 3,
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    display: 'inline-block'
  },
  sectionSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.9rem',
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(2.5)
  },
  synopsis: {
    fontSize: '1.08rem',
    lineHeight: 1.85,
    color: 'rgba(255,255,255,0.85)',
    maxWidth: 820,
    marginLeft: theme.spacing(2.5)
  },
  factGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: theme.spacing(2.5),
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(2.5)
  },
  fact: {
    padding: theme.spacing(1.75, 2),
    borderRadius: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)'
  },
  factLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 4
  },
  factValue: {
    fontSize: '0.98rem',
    fontWeight: 600,
    textTransform: 'capitalize'
  },
  castGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: theme.spacing(2),
    marginLeft: theme.spacing(2.5)
  },
  castCard: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.25),
    borderRadius: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    transition: 'border-color .2s ease, transform .2s ease',
    '&:hover': { borderColor: 'rgba(0,198,255,0.4)', transform: 'translateY(-2px)' }
  },
  castAvatar: {
    width: 44,
    height: 44,
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)'
  },
  castName: { fontSize: '0.92rem', fontWeight: 600, textTransform: 'capitalize', lineHeight: 1.2 },
  castRole: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' },
  tabs: { display: 'flex', gap: theme.spacing(1), marginLeft: theme.spacing(2.5), marginBottom: theme.spacing(3) },
  tab: {
    fontFamily: HEAD_FONT,
    cursor: 'pointer',
    padding: theme.spacing(0.7, 2.2),
    borderRadius: 999,
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.14)',
    transition: 'all .2s ease'
  },
  tabActive: {
    color: '#fff',
    border: '1px solid transparent',
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)'
  },
  mediaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
    gap: theme.spacing(2),
    marginLeft: theme.spacing(2.5)
  },
  mediaItem: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    cursor: 'pointer',
    aspectRatio: '16 / 10',
    background: '#0c1022',
    border: '1px solid rgba(255,255,255,0.07)',
    '&:hover $mediaImg': { transform: 'scale(1.06)' },
    '&:hover $playOverlay': { background: 'rgba(0,0,0,0.25)' }
  },
  mediaImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform .35s ease'
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background .25s ease'
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    boxShadow: '0 8px 22px rgba(0,114,255,0.5)'
  },
  empty: { color: 'rgba(255,255,255,0.5)', marginLeft: theme.spacing(2.5) },
  dialogPaper: { background: '#05070c', overflow: 'hidden', borderRadius: 14, position: 'relative' },
  dialogClose: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 3,
    color: '#fff',
    background: 'rgba(0,0,0,0.5)',
    '&:hover': { background: 'rgba(0,0,0,0.75)' }
  },
  frameWrap: { position: 'relative', width: '100%', paddingTop: '56.25%' },
  frame: { position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 },
  lightboxImg: { width: '100%', height: 'auto', display: 'block' }
}));

const resolveImg = img =>
  img && img.startsWith('/uploads') ? `http://localhost:8080${img}` : img;

const initials = name =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

const formatDuration = mins => {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h ? `${h}h ` : ''}${m ? `${m}m` : ''}`.trim();
};

function MoviePage(props) {
  const { movie, movies, getMovie, onSelectMovie, getMovies, match } = props;
  const classes = useStyles();
  const videoId = useMemo(() => youTubeId(movie && movie.trailerUrl), [movie]);
  const [tab, setTab] = useState('videos');
  const [videoOpen, setVideoOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getMovie(match.params.id);
    return () => onSelectMovie(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.id]);

  useEffect(() => {
    if (!movies || !movies.length) getMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTab(videoId ? 'videos' : 'photos');
  }, [videoId]);

  // Recommendations: other movies scored by shared genres.
  const recommendations = useMemo(() => {
    if (!movie || !movies || !movies.length) return [];
    const cur = new Set(
      (movie.genre || '')
        .split(',')
        .map(g => g.trim().toLowerCase())
        .filter(Boolean)
    );
    return movies
      .filter(m => m._id !== movie._id)
      .map(m => {
        const g = (m.genre || '').split(',').map(x => x.trim().toLowerCase());
        return { m, shared: g.filter(x => cur.has(x)).length };
      })
      .sort((a, b) => b.shared - a.shared)
      .slice(0, 8)
      .map(s => s.m);
  }, [movie, movies]);

  if (!movie) return null;

  const cast = (movie.cast || '')
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);

  const photos = Array.from(
    new Set([movie.image, movie.backdropImage, ...(movie.gallery || [])].filter(Boolean))
  );

  const facts = [
    ['Director', movie.director],
    ['Genre', movie.genre],
    ['Language', movie.language],
    ['Country', movie.country],
    ['Runtime', formatDuration(movie.duration)],
    ['Certification', movie.certification],
    ['IMDb', movie.imdbRating ? `${Number(movie.imdbRating).toFixed(1)} / 10` : null],
    ['Release', movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : null]
  ].filter(([, v]) => v);

  const metaChips = [
    movie.certification && `Rated ${movie.certification}`,
    movie.duration && formatDuration(movie.duration),
    movie.language,
    movie.country,
    movie.imdbRating && `IMDb ${Number(movie.imdbRating).toFixed(1)}`
  ].filter(Boolean);

  return (
    <>
      <MovieBanner movie={movie} fullDescription />

      <div className={classes.body}>
        <div className={classes.inner}>
          {metaChips.length > 0 && (
            <div className={classes.metaRow}>
              {metaChips.map((m, i) => (
                <span key={i} className={classes.metaChip}>
                  {m}
                </span>
              ))}
            </div>
          )}

          {/* Description / About */}
          <section className={classes.section}>
            <Typography className={classes.sectionHead} component="h2">
              <span className={classes.headBar} /> About the Movie
            </Typography>
            <Typography className={classes.sectionSub}>
              Everything you need to know before you book.
            </Typography>
            <Typography className={classes.synopsis}>{movie.description}</Typography>

            {facts.length > 0 && (
              <div className={classes.factGrid}>
                {facts.map(([label, value]) => (
                  <div className={classes.fact} key={label}>
                    <div className={classes.factLabel}>{label}</div>
                    <div className={classes.factValue}>{value}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Cast */}
          {cast.length > 0 && (
            <section className={classes.section}>
              <Typography className={classes.sectionHead} component="h2">
                <span className={classes.headBar} /> Cast
              </Typography>
              <Typography className={classes.sectionSub}>
                The talent behind {movie.title}.
              </Typography>
              <div className={classes.castGrid}>
                {cast.map((name, i) => (
                  <div className={classes.castCard} key={i}>
                    <Avatar className={classes.castAvatar}>{initials(name)}</Avatar>
                    <div>
                      <div className={classes.castName}>{name}</div>
                      <div className={classes.castRole}>Cast</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Photos & Videos */}
          <section className={classes.section}>
            <Typography className={classes.sectionHead} component="h2">
              <span className={classes.headBar} /> Photos &amp; Videos
            </Typography>
            <Typography className={classes.sectionSub}>
              Trailers and stills from the film.
            </Typography>

            <div className={classes.tabs}>
              <span
                className={`${classes.tab} ${tab === 'videos' ? classes.tabActive : ''}`}
                onClick={() => setTab('videos')}>
                Videos
              </span>
              <span
                className={`${classes.tab} ${tab === 'photos' ? classes.tabActive : ''}`}
                onClick={() => setTab('photos')}>
                Photos
              </span>
            </div>

            {tab === 'videos' ? (
              videoId ? (
                <div className={classes.mediaGrid}>
                  <div className={classes.mediaItem} onClick={() => setVideoOpen(true)}>
                    <img
                      className={classes.mediaImg}
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      alt={`${movie.title} trailer`}
                    />
                    <div className={classes.playOverlay}>
                      <span className={classes.playCircle}>
                        <PlayArrowIcon style={{ fontSize: 32 }} />
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <Typography className={classes.empty}>No videos available yet.</Typography>
              )
            ) : photos.length > 0 ? (
              <div className={classes.mediaGrid}>
                {photos.map((p, i) => (
                  <div
                    className={classes.mediaItem}
                    key={i}
                    onClick={() => setLightbox(resolveImg(p))}>
                    <img
                      className={classes.mediaImg}
                      src={resolveImg(p)}
                      alt={`${movie.title} still ${i + 1}`}
                      onError={onPosterError}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Typography className={classes.empty}>No photos available yet.</Typography>
            )}
          </section>

          {/* You may also like */}
          {recommendations.length > 0 && (
            <section className={classes.section}>
              <Typography className={classes.sectionHead} component="h2">
                <span className={classes.headBar} /> You May Also Like
              </Typography>
              <Typography className={classes.sectionSub}>
                More movies we think you'll enjoy.
              </Typography>
              <Grid container spacing={3} style={{ marginLeft: 0, marginTop: 4 }}>
                {recommendations.map(rec => (
                  <Grid key={rec._id} item xs={6} sm={4} md={3}>
                    <MovieGridCard movie={rec} />
                  </Grid>
                ))}
              </Grid>
            </section>
          )}
        </div>
      </div>

      {/* Trailer modal */}
      <Dialog
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ className: classes.dialogPaper }}>
        <IconButton className={classes.dialogClose} onClick={() => setVideoOpen(false)}>
          <CloseIcon />
        </IconButton>
        {videoId && (
          <div className={classes.frameWrap}>
            <iframe
              className={classes.frame}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={`${movie.title} trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Dialog>

      {/* Photo lightbox */}
      <Dialog
        open={Boolean(lightbox)}
        onClose={() => setLightbox(null)}
        maxWidth="md"
        PaperProps={{ className: classes.dialogPaper }}>
        <IconButton className={classes.dialogClose} onClick={() => setLightbox(null)}>
          <CloseIcon />
        </IconButton>
        {lightbox && (
          <img
            className={classes.lightboxImg}
            src={lightbox}
            alt={movie.title}
            onError={onPosterError}
          />
        )}
      </Dialog>
    </>
  );
}

const mapStateToProps = ({ movieState }) => ({
  movie: movieState.selectedMovie,
  movies: movieState.movies
});

const mapDispatchToProps = { getMovie, onSelectMovie, getMovies };

export default connect(mapStateToProps, mapDispatchToProps)(MoviePage);
