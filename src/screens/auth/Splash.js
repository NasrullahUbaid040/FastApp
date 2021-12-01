import React, { useEffect, useState } from 'react'
import {
  StyleSheet, StatusBar, View, Image, Animated, Linking
} from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'
import ProgressBarAnimated from 'react-native-progress-bar-animated'
import ResponsiveText from '../../components/layout/ResponsiveText'
import Container from '../../components/layout/Container'
import Content from '../../components/layout/Content'
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

function Splash({ navigation, loginToken }) {
  // console.log('loginToken from splash',loginToken)
  const [progress, setProgress] = useState(0)
  const anim = new Animated.Value(0)
  useEffect(() => {

    SplashScreen.hide();

    onAnimate();
    VerifyUser()
  }, [])

  const onAnimate = () => {
    anim.addListener(({ value }) => {
      setProgress(parseInt(value))
    })
    Animated.timing(anim, {
      toValue: 100,
      duration: 1000,
      // duration: 5000,
      useNativeDriver: false, // Add This line
    }).start(() => {
      navigation.navigate('ChoiceNavigator')
    })
  }
  const VerifyUser = async () => {
    const url = await Linking.getInitialURL();
    const data = url.substring(url.lastIndexOf('/') + 1);;
    if (url) {
      navigation.navigate('NotificationStack', { screen: 'PostNotification', params: { data } })

    } else {
      return '';
      // navigation.navigate('PrivacyPolicy', { data })
    }
    // console.log('res>>>', post_id)
    // return res[1];
  };
  // setTimeout(async () => {
  //   const productId = await VerifyUser();
  //   if (productId.length) {
  //     console.log('calling')
  //     navigation.navigate('ChoiceNavigator')
  //     // navigation.navigate('ProductDetails', {
  //     //   chat: 0,
  //     //   productId: productId,
  //     //   guestUser: true,
  //     // });
  //   } else {
  //     navigation.dispatch(
  //       CommonActions.reset({
  //         index: 0,
  //         routes: [{ name: routeName.HOMESTACK }],
  //       }),
  //     );
  //   }
  // }, 1500);


  return (
    <Container style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Content keyboardAvoidingView>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icons/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.progressBarContainer}>
          <LinearGradient
            colors={['#009C9F', '#008BA9', '#0075B6']}
            style={[
              styles.progressBar,
              { width: `${progress}%`, backgroundColor: '#008BA9' },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 0.0 }}
          />
        </View>
        <ResponsiveText style={styles.loading}>Loading</ResponsiveText>
      </Content>
    </Container>
  )
}

function mapStateToProps(state) {
 
  return {

    loginToken: state.auth.loginToken?.token
  }
}


export default connect(mapStateToProps)(Splash);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    width: wp('80%'),
    height: 8,
    borderRadius: 15,
    backgroundColor: '#D8D8D8',
    position: 'relative',
    marginVertical: 10,
  },
  progressBar: {
    height: 8,
    width: '100%',
    borderRadius: 15,
  },
  loading: {
    color: '#bbb',
    fontSize: wp('.8%'),
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  logo: {
    height: 80,
    width: wp('70'),
    resizeMode: 'contain',
  },
})
//export default Splash
