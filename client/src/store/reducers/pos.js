import { GET_POS_RESERVATIONS, GET_POS_HELD } from '../types';

const initialState = {
  reservations: [],
  held: []
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_POS_RESERVATIONS:
      return { ...state, reservations: payload };
    case GET_POS_HELD:
      return { ...state, held: payload };
    default:
      return state;
  }
};
