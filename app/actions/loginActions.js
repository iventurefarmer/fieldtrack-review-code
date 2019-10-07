import { LOGIN_CLICKED, LOGIN_FAILED, LOGIN_SUCCESS } from './ActionType';

function loginClicked() {
  return dispatch => {
    dispatch({ type: LOGIN_CLICKED, payload: null });
  };
}

function loginFailed() {
  return dispatch => {
    dispatch({ type: LOGIN_FAILED, payload: null });
  };
}

function loginSuccess(response) {
  return dispatch => {
    dispatch({ type: LOGIN_SUCCESS, payload: response });
  };
}

export { loginClicked, loginFailed, loginSuccess };
