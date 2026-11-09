import { GET_POS_RESERVATIONS, GET_POS_HELD } from '../types';
import { setAlert } from './alert';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
  'Content-Type': 'application/json'
});

// Fetch all counter (walk-in) bookings for the POS bookings table.
export const getPosReservations = () => async dispatch => {
  try {
    const response = await fetch('/pos/reservations', {
      method: 'GET',
      headers: authHeaders()
    });
    if (response.ok) {
      const reservations = await response.json();
      dispatch({ type: GET_POS_RESERVATIONS, payload: reservations });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// Live price quote for the seats a cashier has selected (server-authoritative).
export const getPosQuote = async ({ cinemaId, seatCount, format, date, startAt }) => {
  try {
    const response = await fetch('/reservations/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cinemaId, seatCount, format, date, startAt })
    });
    if (response.ok) return await response.json();
    return null;
  } catch (error) {
    return null;
  }
};

// Create a confirmed counter sale (paid on the spot, cash/card).
export const createPosReservation = sale => async dispatch => {
  try {
    const response = await fetch('/pos/reservations', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(sale)
    });
    const body = await response.json().catch(() => ({}));
    if (response.ok) {
      dispatch(setAlert('Sale completed', 'success', 4000));
      dispatch(getPosReservations());
      return { status: 'success', data: body };
    }
    dispatch(setAlert(body.error || 'Could not complete the sale.', 'error', 5000));
    return { status: 'error', message: body.error };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error', message: error.message };
  }
};

// Fetch parked (held) counter orders awaiting payment.
export const getPosHeld = () => async dispatch => {
  try {
    const response = await fetch('/pos/reservations/held', {
      method: 'GET',
      headers: authHeaders()
    });
    if (response.ok) {
      const held = await response.json();
      dispatch({ type: GET_POS_HELD, payload: held });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// Park the current order (hold seats without taking payment) for later recall.
export const holdPosReservation = sale => async dispatch => {
  try {
    const response = await fetch('/pos/reservations/hold', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(sale)
    });
    const body = await response.json().catch(() => ({}));
    if (response.ok) {
      dispatch(setAlert('Order held', 'success', 3000));
      dispatch(getPosHeld());
      return { status: 'success', data: body };
    }
    dispatch(setAlert(body.error || 'Could not hold the order.', 'error', 5000));
    return { status: 'error', message: body.error };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error', message: error.message };
  }
};

// Settle a recalled hold with a payment method (cash/card).
export const settlePosReservation = (id, paymentMethod) => async dispatch => {
  try {
    const response = await fetch(`/pos/reservations/${id}/settle`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ paymentMethod })
    });
    const body = await response.json().catch(() => ({}));
    if (response.ok) {
      dispatch(setAlert('Payment complete', 'success', 4000));
      dispatch(getPosHeld());
      dispatch(getPosReservations());
      return { status: 'success', data: body };
    }
    dispatch(setAlert(body.error || 'Could not settle the order.', 'error', 5000));
    return { status: 'error', message: body.error };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error', message: error.message };
  }
};

// Discard a parked hold, releasing its seats.
export const voidPosReservation = id => async dispatch => {
  try {
    const response = await fetch(`/pos/reservations/${id}/void`, {
      method: 'POST',
      headers: authHeaders()
    });
    const body = await response.json().catch(() => ({}));
    if (response.ok) {
      dispatch(setAlert('Held order discarded', 'success', 3000));
      dispatch(getPosHeld());
      return { status: 'success', data: body };
    }
    dispatch(setAlert(body.error || 'Could not discard the order.', 'error', 5000));
    return { status: 'error', message: body.error };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error', message: error.message };
  }
};

// Create a cashier/staff account (superadmin only).
export const createStaff = staff => async dispatch => {
  try {
    const response = await fetch('/users/staff', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(staff)
    });
    const body = await response.json().catch(() => ({}));
    if (response.ok) {
      dispatch(setAlert('Cashier account created', 'success', 4000));
      return { status: 'success', data: body };
    }
    dispatch(setAlert(body.error || 'Could not create account.', 'error', 5000));
    return { status: 'error', message: body.error };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error', message: error.message };
  }
};
