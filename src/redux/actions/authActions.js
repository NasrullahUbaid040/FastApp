import {
  LOGIN_TOKEN, TESTING,
  REGISTER_SUCCESS, LOADING, FORGOT_PASSWORD,
  FORGOT_PASSWORD_CODE, RESET_PASSWORD, USER_TYPE, UserData, ERROR_MESSAGE, BUTTON_LOADING, USER_DATA, UPDATE_USERDATA, UPDATE_FOLLOWER, SOCIAL_LOGIN, UPDATE_NOTIFICATION_DATA, TIMER30SEC
} from '../types';
import Auth from '../../services/Auth';

export function setType(payload) {
  return {
    type: REGISTER_SUCCESS,
    payload: payload
  }
};
export function setError(payload) {
  console.log('setError called ***', payload)
  return (dispatch) => {
    dispatch({
      type: ERROR_MESSAGE,
      payload,
    })
  }
};
export function updateData(payload) {
  console.log('updateData called ***', payload)
  return (dispatch) => {
    dispatch({
      type: UPDATE_USERDATA,
      payload,
    })
  }
};
export function updateFollower(payload) {
  console.log('updateData called ********', payload)
  return (dispatch) => {
    dispatch({
      type: UPDATE_FOLLOWER,
      payload,
    })
  }
};

export function userType(payload) {
  console.log('userType..', payload.type)
  return {
    type: USER_TYPE,
    payload: payload.type
  }

};

export function registerUser(payload) {
  console.log('registerUser payload_______', payload)
  return (dispatch) => {
    dispatch({
      type: BUTTON_LOADING,
      payload: true,
    })
    dispatch({
      type: ERROR_MESSAGE,
      payload: '',
    })
    Auth.Register(payload.username, payload.email, payload.password, payload.phone, payload.newUserType, payload.type, payload.callingCode)
      .then(res => res.data)
      .then(data => {
        console.log('Register data_____________', data)
        dispatch({
          type: USER_DATA,
          payload: data,
        })
      })
      .catch(err => {
        dispatch({
          type: ERROR_MESSAGE,
          payload: err.response.data.message,
        })
      })
      .finally(() => {
        dispatch({
          type: BUTTON_LOADING,
          payload: false,
        })
      })
  };
}


export function socialLogin(payload) {
  console.log('socialLogin', payload)
  return (dispatch) => {
    // const result =
    Auth.Social(
      payload.email,
      payload.id,
      payload.imageUrl,
      payload.type,
      payload.username
    )
      .then(res => {
        console.log('res_________', res)
        dispatch({
          type: USER_DATA,
          payload: res.data,
        })
      })
  }
}
export function twitterLogin(payload) {
  console.log('loginData.email:::', payload.email)
  console.log('loginData.userID::::', payload.id)
  // console.log('twitterLogin', userData.email)
  return (dispatch) => {
    // const result =
    Auth.Social(
      payload.email,
      payload.id,
      payload.imageUrl,
      payload.type,
      payload.username
    )
      .then(res => {
        console.log('res_________', res)
        dispatch({
          type: USER_DATA,
          payload: res.data,
        })
      })
  }
}
export function _instagramLoginn(payload) {
  console.log('instagramLogin....', payload)
  return (dispatch) => {
    // const result =
    Auth.Social(
      payload.email,
      payload.id,
      payload.imageUrl,
      payload.type,
      payload.username
    )
      .then(res => {
        console.log('res_________', res)
        dispatch({
          type: USER_DATA,
          payload: res.data,
        })
      })
  }
}


export function loginUser(payload) {
  return (dispatch) => {
    dispatch({
      type: BUTTON_LOADING,
      payload: true,
    })
    dispatch({
      type: ERROR_MESSAGE,
      payload: '',
    })

    Auth.Login(payload.email, payload.password)
      .then(res => res.data)
      // .then(res => console.log('ressssss', res))
      .then(res => {
        console.log('login success', res)
        dispatch({
          type: USER_DATA,
          payload: res,
        })
        dispatch({
          type: SOCIAL_LOGIN,
          payload: false,
        })
      })
      .catch(err => {
        console.log('Register Error_______________________', err.response.data)

        dispatch({
          type: ERROR_MESSAGE,
          payload: err.response.data,
        })
      })
      .finally(() => {
        dispatch({
          type: BUTTON_LOADING,
          payload: false,
        })
      })

  };
}


export function forgotPassword(payload, onSuccess) {
  return (dispatch) => {
    dispatch({
      type: BUTTON_LOADING,
      payload: true,
    })
    dispatch({
      type: ERROR_MESSAGE,
      payload: '',
    })
    console.log(payload)
    Auth.ForgotPassword(payload.email)
      // .then(res => res.data)
      .then(data => {
        // :TODO:
        console.log('data.....>', data.data);
        onSuccess()
        dispatch({
          type: ERROR_MESSAGE,
          payload: data.data,
        })
      })
      .catch(err => {
        console.log('err..>', err)
        // setError(
        //   "User does not exist"
        // )

        // dispatch({
        //   type: ERROR_MESSAGE,
        //   payload: err.response.data,
        // })
      })
      .finally(() => {
        dispatch({
          type: BUTTON_LOADING,
          payload: false,
        })
      })
  };
}
export function forgotPasswordCode(payload, onSuccess) {

  return (dispatch) => {
    dispatch({
      type: BUTTON_LOADING,
      payload: true,
    })
    dispatch({
      type: ERROR_MESSAGE,
      payload: '',
    })

    console.log("PAYLOAD DIDGIT ", payload.digit)
    console.log("PAYLOAD Email ", payload.email)
    Auth.ForgotPasswordCode(payload.digit, payload.email)
      // .then(res => res.data)
      .then(res => {
        console.log('res>>>>>>>>>>>>>', res.data)
        onSuccess()
        // code(data.msg)
        // console.log('data from forgot auth actions', data)
        // onSuccess()

        // dispatch({
        //   type: FORGOT_PASSWORD_CODE,
        //   payload: res.data,
        // })
      })
      .catch(err => {
        console.log('err Forgot Password code..>', err)

        // dispatch({
        //   type: ERROR_MESSAGE,
        //   payload: err.response.data.msg,
        // })


      })
      .finally(() => {
        dispatch({
          type: BUTTON_LOADING,
          payload: false,
        })
      })
  };
}

export function updatePassword(payload, resetpassword) {
  return (dispatch) => {
    dispatch({
      type: BUTTON_LOADING,
      payload: true,
    })
    dispatch({
      type: ERROR_MESSAGE,
      payload: '',
    })

    Auth.UpdatePassword(payload.password, payload.email)
      .then(res => res.data)
      .then(data => {
        resetpassword(data)
        dispatch({
          type: RESET_PASSWORD,
          payload: data,
        })
      })
      .catch(err => {
        console.error('Error:', err.response.data);
      }).finally(() => {
        dispatch({
          type: BUTTON_LOADING,
          payload: false,
        })
      })
  };
}


export function updateNotiiData(payload) {
  console.log('updateNotiiData......', payload)
  return {
    type: UPDATE_NOTIFICATION_DATA,
    payload: payload,
  }

};
export function timer30sec(payload) {
  console.log('timer30sec......', payload)
  return {
    type: TIMER30SEC,
    payload: payload,
  }

};