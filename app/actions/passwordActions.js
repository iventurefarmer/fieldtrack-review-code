import { CONFIRM_PASSWORD_CHANGE, NEW_PASSWORD_CHANGE, OLD_PASSWORD_CHANGE, UPDATE_PASSWORD_CALL } from './ActionType';


function oldPasswordChange(oldPass) {
  return dispatch => {
    dispatch({ type: OLD_PASSWORD_CHANGE, payload: oldPass });
  };
}

function newPasswordChange(newPass) {
  return dispatch => {
    dispatch({ type: NEW_PASSWORD_CHANGE, payload: newPass });
  };
}

function confirmPasswordChange(confirmPass) {
  return dispatch => {
    dispatch({ type: CONFIRM_PASSWORD_CHANGE, payload: confirmPass });
  };
}

function updatePassword() {
  return dispatch => {
    dispatch({ type: UPDATE_PASSWORD_CALL });
  };
}


export { updatePassword, oldPasswordChange, newPasswordChange, confirmPasswordChange };
