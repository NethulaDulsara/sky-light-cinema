import uuid from 'uuid/v4';

// A stable per-browser session id used to hold seats without requiring login.
// Persisted in localStorage so a page refresh keeps the same holds.
const KEY = 'seatSessionId';

export const getSessionId = () => {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = uuid();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch (e) {
    // Private mode / storage disabled: fall back to an ephemeral id.
    return uuid();
  }
};

export default getSessionId;
