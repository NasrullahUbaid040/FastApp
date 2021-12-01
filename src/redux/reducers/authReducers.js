import {
  USER_TYPE, TESTING, USER_DATA, ERROR_MESSAGE, LOADING, UPDATE_USERDATA, FORGOT_PASSWORD, FORGOT_PASSWORD_CODE, RESET_PASSWORD,
  LOGIN_ERROR, BUTTON_LOADING, LOGOUT, UPDATE_FOLLOWER, SOCIAL_LOGIN, UPDATE_NOTIFICATION_DATA, TIMER30SEC
} from '../types';

const initialState = {
  userType: null,
  token: null,
  errorMessage: '',
  loading: false,
  user: null, // setting userData on login
  social: true,
  timer: 30,
  //=======================
  type: null,
  message: null,
  login: false,
  loginToken: 123,
  registerToken: null,
  forgotpassword: null,
  forgotpasswordcode: null,
  resetpassword: null,
}
export default function (state = initialState, action) {
  switch (action.type) {

    case BUTTON_LOADING:
      return {
        ...state,

        loading: action.payload
      };
    case USER_TYPE:
      return {
        ...state,

        userType: action.payload
      };

    case USER_DATA:
      return {
        ...state,
        // : TODO:
        token: action.payload.token,
        user: action.payload.user,
      };
    case TESTING:
      console.log('testing called')
      return {
        ...state,
        // : TODO:
        // token: action.payload.token,
        // user: action.payload.user,
      };

    case UPDATE_USERDATA:
      console.log('UPDATE_USERDATA..  ', action.payload.user)
      return {
        ...state,
        // token: action.payload.token,
        user: action.payload.user,
      };
    case UPDATE_FOLLOWER:
      console.log('UPDATE_FOLLOWER.. ', action.payload)
      return {
        ...state,
        user: action.payload,
      };

    case ERROR_MESSAGE:
      console.log('ERROR_MESSAGE_______', action.payload)
      return {
        ...state,
        errorMessage: action.payload
      }
    case LOADING: {
      console.log("loading", state.loading);
      const loading = state.loading;
      return { ...state, loading: !loading }
    }

    case FORGOT_PASSWORD_CODE: {
      return {
        ...state,
        forgotpasswordcode: action.payload
      };
    }
    case LOGOUT: {
      console.log('LOUGOUT called')
      return {
        userType: null,
        token: null,
        errorMessage: '',
        loading: false,
        social: true
        // user: null

      };
    }
    case SOCIAL_LOGIN: {
      console.log('SOCIAL_LOGIN called')
      return {
        ...state,
        social: false
        // user: null

      };
    }




    case FORGOT_PASSWORD: {
      return {
        ...state,
        forgotpassword: action.payload
      };
    }

    case RESET_PASSWORD: {
      return {
        ...state,
        resetpassword: action.payload
      };
    }
    case
      LOGIN_ERROR: {
        console.log(' TODO: LOGIN_ERROR')
        return {
          ...state,
          login: action.payload
        };
      }
    case
      UPDATE_NOTIFICATION_DATA: {
        console.log(' ........... UPDATE_NOTIFICATION_DATA2222222222222222222', action.payload);
        const newUser = { ...user }
        newUser.enableNotifications = action.payload

        return {
          ...state,
          // const newUser: {...user}
          user: newUser
        };
      }


    case
      TIMER30SEC: {
        console.log(' ........... TIMER30SEC', action.payload);

        return {
          ...state,
          timer: action.payload
        };
      }


    default:
      return state;
  }
}