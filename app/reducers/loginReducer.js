import { LOGIN_CLICKED, LOGIN_FAILED, LOGIN_SUCCESS } from '../actions/ActionType';

const initialState = {
  emailText: 'ft1@gmail.com',
  passwordText: '12345',
  loginText: 'Login',
  loading: false,
  isButtonDisabled: false,
  userResponse: null
};

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_CLICKED:
      return { ...state, loading: true, isButtonDisabled: true, loginText: '', userResponse: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: true, isButtonDisabled: true, loginText: '', userResponse: state };
    case LOGIN_FAILED:
      return { ...state, loading: false, isButtonDisabled: false, loginText: 'Login', userResponse: null };
    default:
      return state;
  }
};

export default LoginReducer;
