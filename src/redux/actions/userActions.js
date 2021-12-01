export function userProfile(payload) {
    console.log('payload', payload)
    return (dispatch) => {
        //   dispatch({
        //     type: BUTTON_LOADING,
        //     payload: true,
        //   })
        //   dispatch({
        //     type: ERROR_MESSAGE,
        //     payload: '',
        //   })
        //   Auth.Register(payload.username, payload.email, payload.password, payload.phone, payload.type)
        //     .then(res => res.data)
        //     .then(data => {
        //       console.log('Register data_____________', data)
        //       dispatch({
        //         type: USER_DATA,
        //         payload: data,
        //       })
        //     })
        //     .catch(err => {
        //       dispatch({
        //         type: ERROR_MESSAGE,
        //         payload: err.response.data.message,
        //       })
        //     })
        //     .finally(() => {
        //       dispatch({
        //         type: BUTTON_LOADING,
        //         payload: false,
        //       })
        //     })
    };
}