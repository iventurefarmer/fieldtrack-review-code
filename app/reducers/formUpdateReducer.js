import { LOGIN_CLICKED, LOGIN_FAILED, LOGIN_SUCCESS } from '../actions/ActionType';

const initialState = {
  form: [],
  datePicker: false,
  timePicker: false,
  formDataObj: params,
  signatureDialogVisible: false,
  formInputValues: {
    profilepic: '',
    signature: ''
  },
  form_status: params.form_status,
  form_id: params.id,
  checkedItems: [],
  lastLocation: {
    latitude: '',
    longitude: '',
    odometer: 0.0
  },
  startButtonText: 'Start',
  startedDisable: true,
  startLocation: 'startLocation',
  radiocheckboxDropdownItems: [],
  selectedDateOrTimeObject: {}
};

const FormUpdateReducer = (state = initialState, action) => {
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

export default FormUpdateReducer;
