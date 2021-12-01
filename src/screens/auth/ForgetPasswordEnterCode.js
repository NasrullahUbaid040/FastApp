import React, { useState, useRef, useEffect, createRef } from 'react';
import { Image, StyleSheet, View, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import Button from '../../components/layout/Button';
import ResponsiveText from '../../components/layout/ResponsiveText';
import Container from '../../components/layout/Container';
import Content from '../../components/layout/Content';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Input from '../../components/layout/Input';
import { BoxShadow } from 'react-native-shadow';
import Colors from '../../theme/colors';
import AppHeader from "../../components/layout/AppHeader";
import { connect } from 'react-redux';
import { forgotPasswordCode, forgotPassword, setError } from "../../redux/actions/authActions"
import moment from 'moment';


function ForgetPasswordEnterCode(props) {
  const { navigation, loading, forgotPasswordCode, forgotPassword, MYemail, ErrorMesassage, } = props;

  const input1 = null;
  const input2 = null;
  const input3 = null;
  const input4 = null;
  let intervalRef = null;
  let count = 30;

  useEffect(() => {
    console.log('.......', email)
    resendTimer()
  }, [])


  const resendTimer = () => {
    intervalRef = setInterval(() => {
      setTime(count--)
      if (count === -1) {
        clearInterval(intervalRef)
      }
    }, 1000);

    return () => {
      clearInterval(intervalRef)
    }
  }

  const input1Ref = useRef(null)
  const input2Ref = useRef(null)
  const input3Ref = useRef(null)

  const [time, setTime] = useState(30);
  const [email, setemail] = useState(props?.route?.params?.email);
  const [digit, setDigit] = useState([]);
  const [sent, setSent] = useState('Resend Code');

  const enterValue = (value, idx) => {
    digit[idx] = value;
    setDigit(...[digit]);
  };

  const shadowOpt = {
    width: wp('14.5'),
    height: wp('12'),
    color: '#0099A2',
    border: 6,
    radius: 3,
    opacity: 0.2,
    x: 1,
    y: 1,
    style: { marginVertical: 0 },
  };

  const onSubmit = () => {
    console.log("DIGIT CHECK PASSWORD", digit.join(""))

    forgotPasswordCode({
      digit: digit.join(""),
      email: props.route.params.email

    }, () => {
      setTimeout(() => {
        navigation.navigate('UpdatePassword', { email: props.route.params.email })
      }, 1000)
    })
  }

  // console.log('aa', { time }); 
  // const remainingSeconds = (new Date(time) - new Date()) / 1000;
  // console.log({ time, remainingSeconds });

  // let date = moment().add(30, 'seconds');
  // setTime(date)
  return (
    <Container>
      <StatusBar backgroundColor={'black'} barStyle={'dark-content'} />
      <AppHeader
        onLeftPress={() => {
          props.setMyError(""),
            navigation.goBack()
        }}
        title={'Forgot Password '}
      />
      <Content>
        <View style={styles.content}>
          <View style={styles.topContainer}>
            {/* <ResponsiveText>{time}</ResponsiveText> */}
            <Image
              source={require('../../assets/icons/lock-fp.png')}
              style={styles.lock}
            />
            <View style={styles.allfieldsContainer}>
              <ResponsiveText style={styles.allfields}>
                {ErrorMesassage}
              </ResponsiveText>
            </View>
            <ResponsiveText style={styles.description}>
              Enter 4 digit number that sent to your email.
            </ResponsiveText>
          </View>
          <View style={styles.inputsContainer}>

            <BoxShadow setting={shadowOpt}>
              <Input
                maxLength={1}
                inputStyle={styles.inputItem}
                placeholder={''}
                // value={digit[0]}
                keyboardType={'numeric'}
                onChangeText={(e) => {
                  if (e.length === 1 && input1Ref) {
                    input1Ref.current.focus()
                    enterValue(e, 0)
                  }
                }}
                clearTextOnFocus={true}
              />
            </BoxShadow>


            <BoxShadow setting={shadowOpt}>
              <Input
                maxLength={1}
                inputStyle={styles.inputItem}
                placeholder={''}
                // value={digit[1]}
                keyboardType={'numeric'}
                onChangeText={(e) => {
                  if (e.length === 1 && input1Ref) {
                    input2Ref.current.focus()
                    enterValue(e, 1)
                  }
                }}
                clearTextOnFocus={true}
                reference={(input1 => input1Ref.current = input1)}

              />
            </BoxShadow>


            <BoxShadow setting={shadowOpt}>
              <Input
                maxLength={1}
                inputStyle={styles.inputItem}
                placeholder={''}
                // value={digit[2]}
                keyboardType={'numeric'}
                onChangeText={(e) => {
                  if (e.length === 1 && input1Ref) {
                    input3Ref.current.focus()
                    enterValue(e, 2)
                  }
                }}
                clearTextOnFocus={true}
                reference={(input1 => input2Ref.current = input1)}
              />
            </BoxShadow>
            <BoxShadow setting={shadowOpt}>
              <Input
                maxLength={1}
                inputStyle={styles.inputItem}
                placeholder={''}
                // value={digit[3]}
                keyboardType={'numeric'}
                onChangeText={(e) => enterValue(e, 3)}
                clearTextOnFocus={true}
                reference={(input1 => input3Ref.current = input1)}

              />
            </BoxShadow>
          </View>

          <Button

            // disabled={true}
            loading={loading}
            onPress={onSubmit}
            title={'Done'}
          />
          <ResponsiveText style={styles.extra}>
            Resend code in {time}
          </ResponsiveText>

          <TouchableOpacity
            disabled={time == 0 ? false : true}
            activeOpacity={0.5}
            onPress={() => {
              console.log("..>,.,", email)
              forgotPassword({
                email,
              });
              setDigit([])


              setSent('Sent!');
              setTimeout(() => {
                setTime(30)
                resendTimer()
                setSent('Resend Code');
              }, 30000);

            }}>
            <ResponsiveText
              style={{
                ...styles.extra,
                color: Colors.Primary,
              }}>
              {sent}
            </ResponsiveText>
          </TouchableOpacity>
        </View>
      </Content>
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.auth.loading,
    ErrorMesassage: state.auth.errorMessage,


  }
}

function mapDispatchToProps(dispatch) {
  return {
    forgotPasswordCode: (payload, onSuccess) => dispatch(forgotPasswordCode(payload, onSuccess)),
    forgotPassword: (payload, onSuccess) => dispatch(forgotPassword(payload, onSuccess)),
    setMyError: (payload) => dispatch(setError(payload)),


  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPasswordEnterCode);
const styles = StyleSheet.create({
  inputShadow: {
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'pink',
    shadowOpacity: 1,
    elevation: 3,
    zIndex: 999,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  topContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    height: wp('80'),

  },
  allfieldsContainer: {
    justifyContent: 'center',
    bottom: 5
  },
  allfields: {
    color: 'red', marginTop: 10
  },
  inputItem: {
    width: wp('15'),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  lock: {
    resizeMode: 'contain',
    height: wp('25'),
    width: wp('25'),
  },
  description: {
    color: '#bbb',
    marginVertical: 10,
    paddingHorizontal: 15,
    marginTop: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  extra: {
    color: '#000',
    marginVertical: 5,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputsContainer: {
    flexDirection: 'row',
    width: wp('100') - 40,
    justifyContent: 'space-between',
    marginBottom: 40,
  },
});
