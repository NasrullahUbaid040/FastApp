import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  BackHandler,
  Alert
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import ResponsiveText from '../../components/layout/ResponsiveText';
import Container from '../../components/layout/Container';
import Content from '../../components/layout/Content';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Colors from '../../theme/colors';
import Input from '../../components/layout/Input';
import Icons from '../../theme/icons';
import Button from '../../components/layout/Button';
import { connect } from 'react-redux';
import { registerUser, setError } from "../../redux/actions/authActions"
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal';


function Register(props) {
  const { navigation, registerUser, type, loading, message, registerToken, userType, user, token, ErrorMesassage } = props
  console.log("type::::::::", props.userType)

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(null)
  const [countrySelectedcode, setCountrySelectedcode] = useState('')
  const [showtype, setshowtype] = useState(false);
  const [newUserType, setnewUserType] = useState("Please select your type");



  const [countryCode, setCountryCode] = useState('PK');
  const [callingCode, setCallingCode] = useState('92');

  const onSelect = (country) => {
    console.log('country..', country);
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode);
  };
  const updateType = (props) => {
    console.log('updateType:::', props);
    setnewUserType(props)
    setshowtype(false)
  };

  const onSubmit = () => {

    //regex for email
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //regex for number
    const reg = /^\d+$/;

    if (username.trim().length === 0) {
      setError(
        "Enter valid Name"
      )
    }

    else if (username.trim().length < 5) {

      setError(
        "Name Should Contain Atleast 5 Characters"
      )
    }

    else if (!re.test(email.trim().toLowerCase())) {

      setError(
        "Enter Valid Email"
      )

    }
    else if (email.trim().length === 0) {
      setError(
        "Enter Valid Email"
      )
    }
    else if (password.length == 0) {
      setError(
        "Enter Password"
      )
    }
    else if (confirmPassword.length == 0) {
      setError(
        "Enter confirm Password"
      )
    }

    else if (password != confirmPassword) {
      setError(
        "Password Doesn't Match"
      )

    }

    else if (phone.length == 0) {
      setError(
        "Enter Phone Number"
      )
    }
    else if (!reg.test(phone)) {
      setError(
        "Phone invalid number"
      )
    }


    else if (newUserType == "Please select your type") {
      if (props.userType === "FAST_TRACK") {
        console.log('1')
        setError("Please select your type")
      } else {
        console.log('2')
        setError("")
        signUpwithFast()

      }
    }



    else {
      setError("")
      if (props.userType === "FAST") {
        console.log("fastttt")

      }
      else {
        console.log('fast trackkkk')
        signUpwithFastTrack()
      }


    }

    console.log("error...", error)
  };
  const signUpwithFast = () => {
    registerUser({
      username,
      email: email.toLowerCase(),
      password,
      confirmPassword,
      phone: phone,
      callingCode: "+" + callingCode[0],
      userType,
      // newUserType
    })
  }
  const signUpwithFastTrack = () => {
    newUserType
    console.log('..>', newUserType)
    registerUser({
      username,
      email: email.toLowerCase(),
      password,
      confirmPassword,
      phone: phone,
      callingCode: "+" + callingCode[0],
      userType,
      newUserType
    })
  }

  // const backAction = () => {
  //   props.navigation.navigate("Login", { 'type': props.userType }, setError(" "))
  //   return true;
  // };
  useEffect(() => {


    if (registerToken) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'GetPremium' },
          ],
        })
      );
    }
    //backHandler

    // const backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress", backAction);
  })
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
              {error}
              {/* {ErrorMesassage} */}
              {/* {message ? message : ErrorMesassage} */}
            </ResponsiveText>
          </View>






          <View style={styles.middleRow}>
            <Input
              maxLength={20}
              placeholder={'Username'}
              value={username}
              onChangeText={(e) => setUsername(e)}
              icon={Icons.userProfile()}
            />
            <Input
              maxLength={30}
              placeholder={'Email'}
              value={email}
              onChangeText={(e) => setEmail(e)}
              icon={Icons.Email()}
            />
            <Input
              placeholder={'Password'}
              value={password}
              onChangeText={(e) => setPassword(e)}
              icon={Icons.Lock()}
              secureTextEntry
            />
            <Input
              placeholder={'Confirm Password'}
              value={confirmPassword}
              onChangeText={(e) => setConfirmPassword(e)}
              icon={Icons.Lock()}
              secureTextEntry
            />



            <View style={styles.inputView}>

              <CountryPicker
                {...{
                  countryCode,
                  onSelect,
                  containerButtonStyle: {
                    // backgroundColor: '#fff',
                    height: wp(10),
                    width: wp(5),
                    borderRadius: wp(1),
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginLeft: 10
                  },
                }}
              // theme={{ ...DARK_THEME, flagSizeButton: wp(6) }}
              />
              <ResponsiveText style={{ left: 15 }}>{callingCode}</ResponsiveText>

              <TextInput placeholder='Phone Number'
                style={{ left: 20, alignItems: 'center', alignSelf: 'center', width: '100%' }}
                value={phone}
                onChangeText={(e) => setPhone(e)}
                keyboardType={'phone-pad'}
                maxLength={14} />

            </View>

            {props.userType === "FAST_TRACK" ?
              <TouchableOpacity style={styles.btndrop}
                onPress={() => setshowtype(!showtype)}>
                <View style={styles.dropField}>
                  <Image
                    source={require('../../assets/icons/people-outline.png')}
                    style={{ marginLeft: 10, height: wp(6), width: wp(6), resizeMode: 'contain', tintColor: Colors.Primary }}
                  />
                </View>
                <View style={styles.dropField2}>
                  <ResponsiveText style={{ marginLeft: 10 }}>{newUserType}</ResponsiveText>
                </View>
                <View style={styles.dropField}>
                  <Image
                    source={!showtype ? require('../../assets/icons/Path.png') : require('../../assets/icons/PathA.png')}
                    style={{
                      height: 12, width: 12, resizeMode: 'contain', alignSelf: 'center',
                    }}
                  />
                </View>
              </TouchableOpacity>
              : null}

            {showtype &&

              <View >

                <TouchableOpacity style={styles.droptext} onPress={() => updateType("Artist")}>
                  <ResponsiveText>Artist</ResponsiveText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.droptext} onPress={() => updateType("Singer")}>
                  <ResponsiveText>Singer</ResponsiveText>
                </TouchableOpacity>
              </View>
            }


            <Button
              loading={loading}
              title={'SIGNUP'}
              btnContainer={{
                marginTop: 10,
              }}
              onPress={onSubmit}
            />



          </View>
          <View style={styles.bottomRow}>
            <ResponsiveText style={styles.alreadyText}>
              Already have an account?
            </ResponsiveText>


            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("Login", { 'type': props.userType }, props.setMyError(""))}
            // props.navigation.navigate('Login')}
            >
              <ResponsiveText
                style={{ ...styles.alreadyText, color: Colors.Primary }}>
                Login
              </ResponsiveText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Content>
    </Container>
  );
}
function mapStateToProps(state) {
  // console.log('userType', state.auth)
  return {
    type: state.auth.type,
    userType: state.auth.userType,
    user: state.auth.user,
    token: state.auth.token,
    ErrorMesassage: state.auth.errorMessage,

    loading: state.auth.loading,
    message: state.auth.error?.message,
    registerToken: state.auth.registerToken?.token
  }
}

function mapDispatchToProps(dispatch) {
  return {
    registerUser: (payload) => dispatch(registerUser(payload)),
    setMyError: (payload) => dispatch(setError(payload))

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  topRowContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    height: wp('50'),
  },
  allfieldsContainer: {
    justifyContent: 'center',
    height: wp('10'),
  },
  allfields: {
    color: 'red'
  },
  logo: {
    height: 80,
    width: wp('70'),
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    padding: 15,
    paddingHorizontal: 20,
  },
  middleRow: {
    flex: 1,
  },
  bottomRow: {
    flex: 1,
    marginTop: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,

  },
  indicator: {
    marginTop: 20
  },
  alreadyText: {
    color: '#bbb',
    marginRight: 3,
  },
  inputView: {
    borderRadius: wp('2%'),
    backgroundColor: '#E6E6E6',
    flexDirection: 'row',
    height: wp('13%'),
    marginBottom: 10,
    alignItems: 'center'
  },
  dropField: {
    width: '12%', height: '100%', alignItems: 'center', justifyContent: 'center'
  },
  dropField2: {
    width: '76%', height: '100%', justifyContent: 'center',

  },
  droptext: {
    backgroundColor: Colors.Secondary, height: wp(8), justifyContent: 'center', marginTop: 5, borderRadius: wp('2%'), paddingHorizontal: 10
  },
  btndrop: {
    height: wp('13%'),
    width: '100%',
    backgroundColor: Colors.Secondary,
    borderRadius: wp('2%'),
    flexDirection: 'row'
  },
});
