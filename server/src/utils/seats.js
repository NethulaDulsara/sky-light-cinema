// Pure seat helpers shared by the reservation and seat-lock routes, kept here
// so the double-booking guard can be unit tested without a database.

// Canonical "row-col" key for a seat coordinate.
const seatKey = coord => (Array.isArray(coord) ? `${coord[0]}-${coord[1]}` : String(coord));

// Returns the first requested seat that collides with an already-taken set
// (a Set of seat keys), or null when there is no conflict.
const findSeatConflict = (takenKeys, requestedCoords) => {
  for (const coord of requestedCoords || []) {
    if (takenKeys.has(seatKey(coord))) return seatKey(coord);
  }
  return null;
};

module.exports = { seatKey, findSeatConflict };
