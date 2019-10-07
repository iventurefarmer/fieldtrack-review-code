import {
  CONFIRM_PASSWORD_CHANGE,
  NEW_PASSWORD_CHANGE,
  OLD_PASSWORD_CHANGE,
  UPDATE_PASSWORD_CALL,
  UPDATE_PASSWORD_FAILED,
  UPDATE_PASSWORD_SUCCESS
} from '../actions/ActionType';

const initialState = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  loading: false
};

const passwordReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case OLD_PASSWORD_CHANGE:
      return { ...state, oldPassword: action.payload };
    case NEW_PASSWORD_CHANGE:
      return { ...state, newPassword: action.payload };
    case CONFIRM_PASSWORD_CHANGE:
      return { ...state, confirmPassword: action.payload };
    case UPDATE_PASSWORD_CALL:
      return { ...state, loading: true };
    case UPDATE_PASSWORD_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_PASSWORD_FAILED:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default passwordReducer;
