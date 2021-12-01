import React from 'react';
import { StyleSheet, View, ScrollView, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import Container from '../../components/layout/Container';
import Content from '../../components/layout/Content';
import ResponsiveText from '../../components/layout/ResponsiveText';
import Icons from '../../theme/icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Colors from '../../theme/colors';
import Button from '../../components/layout/Button';
import LinearGradient from 'react-native-linear-gradient';
import AppHeader from '../../components/layout/AppHeader';
import axios from 'axios';
import { connect } from 'react-redux';

const packages = [
  {
    recommended: false,
    name: 'Basic',
    description: 'Search, book, message users',
    lowCost: '1.99',
    highCost: '24.99',
  },
  {
    recommended: true,
    name: 'Premium',
    description:
      'Search, book, message users, upload live stories & 30 sec audio/visual samples as well as advertise your studio space or talents to be booked by paying users',
    lowCost: '9.99',
    highCost: '120.0',
  },
  {
    recommended: false,
    name: 'Advanced',
    description:
      'Search, book, message users, upload live stories & 30 sec audio/visual samples',
    lowCost: '4.99',
    highCost: '60.0',
  },
];

function GetPremium(props) {
  const onContinue = () => {
    // console.log(props.token)
    axios.post(`${API_URL}/charge`,
      null,
      {
        headers: { 'x-auth-token': props.token }
      }).then(res => res.data)
      .then(res => {
        console.log('res........... ', res)
        if (res.status == true) {
          onSubscribe()
        }
      })
      .catch(error => {
        console.log('error', error)
      })

    props.navigation.navigate('Home');
  };
  const onSubscribe = () => {
    console.log('onSubscribe calling')
    axios.post(`${API_URL}/user/set-subscribe`,
      {
        "name": "BASIC",
        "plan": "MONTHLY"
      },
      {
        headers: { 'x-auth-token': props.token }
      }).then(res => res.data)
      .then(res => {
        console.log('onSubscribe res........... ', res)

        Alert.alert(
          "Payment ",
          res.msg,
          [


            { text: "OK", onPress: () => props.navigation.navigate('Home') }
          ])

      })
      .catch(error => {
        console.log('error', error)
      })
  };

  const _continue = () => {
    props.navigation.navigate('Checkout')

  }
  const onCancel = () => {
    console.log('object.....', props.navigation.navigate('Home'))

  };
  return (
    <View style={styles.topContainer}>
      <AppHeader
      //  onLeftPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.bannerContainer}>
            {Icons.StarWithBG({ width: wp('25%'), height: wp('20') })}
            <View style={styles.headingContainer}>
              <ResponsiveText style={styles.heading}>
                Get Premium
              </ResponsiveText>
              <ResponsiveText style={styles.offerText}>
                Choose one of our premium packages
              </ResponsiveText>
            </View>
          </View>
          <View style={[styles.packagesContainer]}  >
            {packages.map((item, idx) => {
              let Recommended = item.recommended ? ImageBackground : View;
              return (
                <View
                  key={idx}
                  style={[
                    styles.packageBorder,
                    item.recommended ? { marginTop: 10 } : null,
                    item.recommended ? styles.recPackageBorder : null,
                  ]}>

                  <Recommended
                    source={require('../../assets/images/package_bg.png')}
                    style={[
                      styles.packageContainer,
                      item.recommended ? styles.recPackageContainer : null,
                      item.recommended ? { paddingTop: 18 } : null,
                      { flex: 1, resizeMode: 'cover' },
                    ]}>
                    <View style={styles.packageLeft}>
                      <ResponsiveText style={styles.packageName}>
                        {item.name}
                      </ResponsiveText>
                      <ResponsiveText style={styles.description}>
                        {item.description}
                      </ResponsiveText>
                    </View>
                    <View style={styles.packageRight}>
                      <View style={styles.costContainer}>
                        <ResponsiveText style={styles.dollar}>$</ResponsiveText>
                        <ResponsiveText style={styles.cost}>
                          {item.lowCost}
                        </ResponsiveText>
                        <ResponsiveText style={styles.duration}>
                          /mo
                        </ResponsiveText>
                      </View>
                      <ResponsiveText style={styles.or}>OR</ResponsiveText>
                      <View style={styles.costContainer}>
                        <ResponsiveText style={styles.dollar}>$</ResponsiveText>
                        <ResponsiveText style={styles.cost}>
                          {item.highCost}
                        </ResponsiveText>
                        <ResponsiveText style={styles.duration}>
                          /year
                        </ResponsiveText>
                      </View>
                    </View>
                  </Recommended>
                  {item.recommended && (
                    <View style={styles.recommendedBadgeContainer}>
                      <View style={styles.recommendedBadgeBorder}>
                        <ResponsiveText style={styles.recText}>
                          Recommended
                        </ResponsiveText>
                      </View>
                    </View>
                  )}

                </View>
              );
            })}
            <View style={styles.bottomRow}>
              {/* :TODO: enable me for payment */}
              {/* <Button title={'Continue'} onPress={onContinue} /> */}
              <Button title={'Continue'} onPress={_continue} />
              <Button
                title={'Cancel'}
                btnContainer={{
                  backgroundColor: Colors.Secondary,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                  elevation: 2
                }}
                onPress={onCancel}
                titleStyle={{ color: Colors.Primary }}

              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 15,
    paddingHorizontal: 20,
    minHeight: '100%',
    paddingBottom: 5,
  },
  bannerContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    marginVertical: 10,
  },
  headingContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingLeft: 10,
  },
  heading: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  offerText: {
    flexWrap: 'wrap',
    width: '100%',
    fontSize: 3.4,
  },
  packagesContainer: {
    flex: 1,
  },
  packageBorder: {
    borderRadius: 5,
    borderWidth: 4,
    borderColor: '#DBD621',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  packageContainer: {
    width: '100%',
    backgroundColor: '#C6B000',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  packageLeft: {
    width: '60%',
    justifyContent: 'center',
  },
  packageRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageName: {
    color: Colors.supportWhite,
    fontSize: 6,
    fontWeight: 'bold',
  },
  description: {
    color: Colors.supportWhite,
    fontSize: 3.2,
  },
  cost: {
    color: Colors.supportWhite,
    fontSize: 8,
    fontWeight: 'bold',
  },
  or: {
    color: Colors.supportWhite,
    fontSize: 3.5,
    marginVertical: 8,
  },
  costContainer: {
    flexDirection: 'row',
  },
  dollar: {
    fontSize: 3.5,
    color: Colors.supportWhite,
  },
  duration: {
    fontSize: 3.5,
    color: Colors.supportWhite,
    alignSelf: 'flex-end',
    marginBottom: 3,
  },
  recPackageBorder: {
    padding: 0,
    width: wp('100') - 25,
    alignSelf: 'center',
  },
  recPackageContainer: {
    backgroundColor: '#827408',
  },
  bottomRow: {
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  recommendedBadgeContainer: {
    position: 'absolute',
    backgroundColor: '#DBD620',
    top: -15,
    padding: 2,
    borderRadius: 2,
  },
  recommendedBadgeBorder: {
    borderColor: '#fff',
    borderWidth: 2,
    padding: 3,
    paddingHorizontal: 30,
    borderRadius: 2,
  },
  recText: {
    color: Colors.supportWhite,
    fontSize: 3,
  },
});

function mapStateToProps(state) {
  return {

    token: state.auth.token,
    userData: state.auth.user,

  }
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GetPremium);