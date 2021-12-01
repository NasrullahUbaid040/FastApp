import React, { useEffect, useState } from 'react'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  NativeModules,
  BackHandler
} from 'react-native'
import { CommonActions } from '@react-navigation/native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import ResponsiveText from '../../components/layout/ResponsiveText'
import Container from '../../components/layout/Container'
import Content from '../../components/layout/Content'
import Colors from '../../theme/colors'
import Input from '../../components/layout/Input'
import Icons from '../../theme/icons'
import Button from '../../components/layout/Button'
import { connect } from 'react-redux';
import { loginUser, setError, socialLogin, twitterLogin, _instagramLoginn } from "../../redux/actions/authActions"
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import InstagramLogin from 'react-native-instagram-login';
// import firebase from '../../firebase'
import { GoogleSignin, statusCodes } from "@react-native-community/google-signin";
import axios from 'axios';


const { RNTwitterSignIn } = NativeModules;
const Constants = {
  TWITTER_COMSUMER_KEY: "qWPj1TXbreMX1SsDvdiQTaF7Y",
  TWITTER_CONSUMER_SECRET: "4t0cRfGWXZvySIa5sS0M38AnT8a8B8hwcX2lZiaStSWStD4B4Z"
}
function Login(props) {
  const { navigation, loginUser, loading, login, loginToken, ErrorMesassage } = props
  console.log('from logn.................. .', ErrorMesassage)
  const [email, setEmail] = useState('test11@test11.com')
  const [password, setPassword] = useState('aaaaaaaa')
  const [hidden, setHidden] = useState(true)
  const [stayConnected, setStayConnected] = useState(false)

  const onSubmit = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
      props.setMyError(
        "Please enter valid email"
      )
    } else if (password.length === 0) {
      props.setMyError(
        "Please enter password"
      )
    }
    else {
      loginUser({
        email: email.toLowerCase(),
        password: password.trim(),
      })
    }
  }

  useEffect(() => {
    // props.setMyError("")
    // BackHandler.addEventListener('hardwareBackPress', () => props.navigation.navigate("Welcome"))

    GoogleSignin.configure({
      webClientId:
        "242372874682-qlbbao9s54aranq39d9b7qomveej5m9j.apps.googleusercontent.com", // client ID of type WEB for your server(needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // accountName: "", // [Android] specifies an account name on the device that should be used
      iosClientId: "242372874682-20askbj8vm3kmg23a8alg777eu4id24j.apps.googleusercontent.com",
    });


    if (loginToken) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'GetPremium' },
          ],
        })
      );
    }
  })
  const signInSocial = async (email, name, picture) => {


    firebase
      .auth()
      .signInWithEmailAndPassword(email, "123456789")
      .then((res) => {
        // setLoading(true);
        console.log(res)
        let userData = {
          useremail: email,
          username: name,
          userpicture: picture,

        };
        console.log('userData', userData)


      })
      .catch((e) => {
        console.log("account not present", e);
        // setLoading(false);
        // signpSocial(email, name, picture);
      });
  };
  const signInFunc = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const info = await GoogleSignin.signIn();
      // setGdata(info);
      console.log('info==>', info.user.email);

      //dispatch here
      props._socialLogin({
        email: info.user.email,
        username: info.user.name,
        imageUrl: info.user.photo,
        type: props?.route?.params?.type,
        id: info.user.id,
      })

      // signInSocial(info.user.email, info.user.name, info.user.photo);
    } catch (error) {
      console.log("This is error :: ", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log("This is error 1:: ", error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log("This is error PLAY_SERVICES_NOT_AVAILABLE:: ", error);
      } else {
        // some other error happened
      }
    }
  };
  const loginWithFacebook = () => {
    // navigation.navigate('Tab')
    LoginManager.logInWithPermissions(["public_profile", "email"])
      .then(
        function (result) {
          if (result.isCancelled) {
            console.log("==> Login cancelled");
          } else {
            console.log(
              // "==> Login success with permissions: " +
              // result.grantedPermissions.toString()
              AccessToken.getCurrentAccessToken().then((data) => {
                const { accessToken } = data
                console.log(accessToken);
                initUser(accessToken)
              })

            );
          }
        },
        function (error) {
          console.log("==> Login fail with error: " + error);
        }
      );
  }
  const initUser = (token) => {
    fetch('https://graph.facebook.com/v2.5/me?fields=id,name,email,picture&access_token=' + token)
      .then((response) => {
        response.json().then((json) => {
          console.log('response==>', json)
          const id = json.id
          const name = json.name
          const picture = json.picture.data.url

          props._socialLogin({
            email: id + "@gmail.com",
            username: name,
            imageUrl: picture,
            type: props?.route?.params?.type,
            id: id,
          })
        })
      })
      .catch(() => {
        console.log('ERROR GETTING DATA FROM FACEBOOK')
      })
  }
  const twitterSignIn = () => {
    RNTwitterSignIn.init(Constants.TWITTER_COMSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET)
    RNTwitterSignIn.logIn()
      .then(loginData => {
        console.log(loginData)

        //dispatch here
        props.twitterLogin({
          email: loginData.userID + "@gmail.com",
          username: loginData.name,
          imageUrl: 'http://www.wrnrtv.com/wp-content/uploads/2017/05/male.png',
          type: props?.route?.params?.type,
          id: loginData.userID,
        })

        const { authToken, authTokenSecret } = loginData
        if (authToken && authTokenSecret) {

        }
      })
      .catch(error => {
        console.log(error)
      }
      )
  }
  const setIgToken = (data) => {
    console.log('data', data)
    // console.log('data', data.user_id)
    // this.setState({ token: data.access_token })
    props._instagramLogin({
      email: data.user_id + "@instagram.com",
      username: 'Instagram User',
      imageUrl: 'http://www.wrnrtv.com/wp-content/uploads/2017/05/male.png',
      type: props?.route?.params?.type,
      id: data.user_id,
    })
  }

  return (
    <Container style={styles.container}>
      <Content>
        <ScrollView style={styles.content}>
          <View style={styles.topRowContainer}>
            <Image
              source={require('../../assets/icons/logo.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.allfieldsContainer}>

            <ResponsiveText style={styles.allfields}>
              {ErrorMesassage}
            </ResponsiveText>
          </View>


          <View style={styles.middleRow}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={(e) => setEmail(e)}
              icon={Icons.Email()}
            />
            <View style={{ position: 'relative', justifyContent: 'center' }}>
              <Input
                placeholder="Password"
                value={password}
                onChangeText={(e) => setPassword(e)}
                icon={Icons.Lock()}
                inputStyle={{ paddingRight: 45 }}
                secureTextEntry={hidden}
              />
              <TouchableOpacity
                onPress={() => setHidden(!hidden)}
                style={{
                  position: 'absolute',
                  right: 15,
                  top: 8,
                  paddingLeft: 8,
                  paddingVertical: 5,
                }}
              >
                {hidden ? Icons.Eye2() : Icons.Eye()}
              </TouchableOpacity>
            </View>
            {/* TODO: save states */}
            <View style={styles.extraContainer}>
              {/* <TouchableOpacity
                style={styles.stayConnectedContainer}
                onPress={() => setStayConnected(!stayConnected)}
              >
                <View
                  style={[
                    styles.checkbox,
                    stayConnected
                      ? { backgroundColor: Colors.Primary, borderWidth: 0 }
                      : null,
                  ]}
                >
                  {stayConnected
                    && Icons.Tick({ height: 12, width: 12, marginTop: 2 })}
                </View>
                <ResponsiveText style={styles.extraText}>
                  Stay Connected
                </ResponsiveText>
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <ResponsiveText
                  style={{ ...styles.extraText, color: Colors.Primary }}
                >
                  Forgot Password?
                </ResponsiveText>
              </TouchableOpacity>
            </View>
            <Button
              loading={loading}
              title="LOGIN"
              btnContainer={{
                marginTop: 10,
              }}
              titleStyle={{ fontWeight: 'bold' }}
              onPress={onSubmit}
            />
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.orContainer}>
              <View style={styles.line} />
              <ResponsiveText style={styles.or}>OR</ResponsiveText>
              <View style={styles.line} />
            </View>
            <View style={styles.socialBtnContainer}>
              <TouchableOpacity
                style={styles.socialLoginBtn}
                onPress={() => loginWithFacebook()}
              >
                <View style={styles.socialLoginContent}>
                  <View style={styles.socialIconContainer}>
                    {Icons.Facebook({ height: wp('8'), width: wp('7') })}
                  </View>
                  <ResponsiveText style={styles.socialText}>
                    Facebook
                  </ResponsiveText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialLoginBtn}
                onPress={() => signInFunc()}
              >
                <View style={styles.socialLoginContent}>
                  <View style={styles.socialIconContainer}>
                    {Icons.Google({ height: wp('8'), width: wp('7') })}
                  </View>
                  <ResponsiveText style={styles.socialText}>
                    Google
                  </ResponsiveText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialLoginBtn}
                onPress={() => twitterSignIn()}
              >
                <View style={styles.socialLoginContent}>
                  <View style={styles.socialIconContainer}>
                    {Icons.Twitter({ height: wp('8'), width: wp('7') })}
                  </View>
                  <ResponsiveText style={styles.socialText}>
                    Twitter
                  </ResponsiveText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialLoginBtn}
                onPress={() => instagramLogin.show()}
              >
                <View style={styles.socialLoginContent}>
                  <View style={styles.socialIconContainer}>
                    {Icons.Insta({ height: wp('8'), width: wp('7') })}
                  </View>
                  <ResponsiveText style={styles.socialText}>
                    Instagram
                  </ResponsiveText>
                </View>
              </TouchableOpacity>
              <Button
                btnContainer={styles.goToBasicSignup}
                title="Sign up using email"
                titleStyle={{
                  ...styles.socialText,
                  color: Colors.supportBlack,
                  fontWeight: 'bold',
                }}
                onPress={() => { navigation.navigate('Register'), props.setMyError("") }}
              />
            </View>
          </View>

          <InstagramLogin
            ref={ref => (instagramLogin = ref)}
            appId='272444731358868'
            appSecret='dfc1f73e988c4c5664acddc3b9f14488'
            redirectUrl='https://www.fastapp.com/'
            scopes={['user_profile', 'user_media']}
            onLoginSuccess={(data) => setIgToken(data)}
            // onLoginSuccess={(data) => {
            //   console.log('data====>', data)

            // }}
            onLoginFailure={(data) => console.log(data)}
          />
        </ScrollView>
      </Content>
    </Container>
  )
}


function mapStateToProps(state) {
  return {
    ErrorMesassage: state.auth.errorMessage,
    myMess: state.auth.myMessage,


    loading: state.auth.loading,
    login: state.auth.login,
    loginToken: state.auth.loginToken?.token
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loginUser: (payload) => dispatch(loginUser(payload)),
    setMyError: (payload) => dispatch(setError(payload)),
    _socialLogin: (payload) => dispatch(socialLogin(payload)),
    _instagramLogin: (payload) => dispatch(_instagramLoginn(payload)),
    twitterLogin: (loginData) => dispatch(twitterLogin(loginData)),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRowContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: wp('60'),
  },
  logo: {
    height: 80,
    width: wp('70'),
    resizeMode: 'contain',
  },
  content: {
    paddingHorizontal: 20,
  },
  allfieldsContainer: {
    justifyContent: 'center',
    bottom: 5
  },
  allfields: {
    color: 'red'
  },
  middleRow: {
    flex: 1,
  },
  bottomRow: {
    flex: 1,
    paddingHorizontal: 4,
    justifyContent: 'center',
    marginBottom: 20,
  },
  extraContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
    marginBottom: 20,
  },
  extraText: {
    color: '#BBB',
    fontSize: 3,
    marginRight: 5,
  },
  stayConnectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: 15,
    width: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: '#BBB',
    marginRight: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  orContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    width: wp('40%'),
    borderWidth: 1,
    backgroundColor: '#6B6B6B',
    height: 0,
    borderRadius: 2,
    opacity: 0.75,
  },
  or: {
    // fontSize: wp('1.1%'),
    fontWeight: 'bold',
    marginHorizontal: 7,
    opacity: 0.75,
  },
  socialBtnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialIconContainer: {
    width: '40%',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialLoginBtn: {
    height: wp('13%'),
    width: wp('45.8') - 15,
    elevation: 2,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  socialLoginContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  socialText: {
    fontWeight: 'bold',
    // fontSize:1.2,
  },
  goToBasicSignup: {
    backgroundColor: Colors.supportWhite,
    elevation: 2,
    width: wp('100') - 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
})
//export default Login