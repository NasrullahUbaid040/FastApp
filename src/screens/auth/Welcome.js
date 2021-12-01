import React, { useEffect } from 'react';
import { Image, StyleSheet, View, TouchableOpacity, BackHandler } from 'react-native';
import ResponsiveText from '../../components/layout/ResponsiveText';
import Container from '../../components/layout/Container';
import Content from '../../components/layout/Content';
import Button from '../../components/layout/Button';
import Colors from '../../theme/colors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { setType, setError } from "../../redux/actions/authActions"


function Welcome({ navigation, route, setTypeFunction,setMyError }) {
  const { type } = route?.params;

  useEffect(() => {
    console.log('type::::', type);
    setTypeFunction(type);
    // BackHandler.addEventListener('hardwareBackPress', () => navigation.goBack());

  }, [])




  return (
    <Container style={styles.container}>
      <Content keyboardAvoidingView>
        <View style={styles.topContainer}>
          <ResponsiveText style={{ color: '#0E3B36' }}>Welcome to</ResponsiveText>
          <Image
            source={require('../../assets/icons/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.bottomContainer}>
          <Button
            title={'Login'}
            onPress={() => 
            { setMyError("")
               navigation.navigate('Login', { 'type': type })
            }}
          />
          <Button
            title={'Signup'}
            onPress={() => navigation.navigate('Register', { 'type': type })}
            btnContainer={{ backgroundColor: '#0B0B0A', opacity: 0.75 }}
          />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("TOS")}>
            <ResponsiveText style={styles.TOS}>
              Terms of Services
            </ResponsiveText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginBottom: 10 }}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("PrivacyPolicy")}>
            <ResponsiveText style={styles.TOS}>
              Privacy Policy
            </ResponsiveText>
          </TouchableOpacity>
        </View>
      </Content>
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    // state
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setTypeFunction: type => dispatch(setType(type)),
    setMyError: (payload) => dispatch(setError(payload)),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    paddingVertical: 25,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  TOS: {
    marginTop: 10,
    color: '#5D8F88',
  },
  logo: {
    height: 80,
    width: wp('70'),
    resizeMode: 'contain',
    marginTop: 10,
  },
});

