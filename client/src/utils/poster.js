// Shared movie-poster URL helper + a self-contained placeholder used when a
// movie has no image, or its uploaded image file is missing (e.g. the DB has a
// /uploads/... path but that file doesn't exist on this server).

// Inline SVG placeholder (always loads — no network needed).
export const POSTER_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1b2140"/>
          <stop offset="1" stop-color="#0c1022"/>
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#g)"/>
      <g fill="none" stroke="#3a4a7a" stroke-width="6">
        <rect x="150" y="235" width="100" height="110" rx="10"/>
        <circle cx="200" cy="290" r="26"/>
      </g>
      <text x="200" y="400" fill="#5a6aa0" font-family="Arial, sans-serif" font-size="24" font-weight="700" text-anchor="middle">NO POSTER</text>
    </svg>`
  );

// Resolve a movie's poster URL. Uploaded files are served from the API host.
export const getPosterUrl = image => {
  if (!image) return POSTER_PLACEHOLDER;
  if (image.startsWith('/uploads')) return `http://localhost:8080${encodeURI(image)}`;
  return encodeURI(image);
};

// onError handler for <img> tags: swap to the placeholder once, and stop.
export const onPosterError = e => {
  if (e.target.src !== POSTER_PLACEHOLDER) {
    e.target.onerror = null;
    e.target.src = POSTER_PLACEHOLDER;
  }
};
