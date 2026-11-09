// Extract a YouTube video id from common URL shapes (watch?v=, youtu.be/,
// embed/, v/). Returns null when no 11-char id is present.
export const youTubeId = url => {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
};

export default youTubeId;
