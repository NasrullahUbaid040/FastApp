import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import Container from '../../components/layout/Container';
import Content from '../../components/layout/Content';
import ResponsiveText from '../../components/layout/ResponsiveText';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AppHeader from '../../components/layout/AppHeader';

function EscrowApproved(props) {
  const {type} = props.route.params ? props.route.params : "paid" ;
  return (
    <View style={{flex: 1}}>
      <AppHeader onLeftPress={() => props.navigation.goBack()} />
      <Content style={styles.content}>
        <View style={styles.contentContainer}>
          <ResponsiveText style={styles.paid}>
            {type === 'paid' ? 'Successfully Paid!' : 'Escrow Payment Approved'}
          </ResponsiveText>
          <Image
            source={require('../../assets/icons/checkMark.png')}
            style={styles.checkIcon}
          />
          <ResponsiveText style={styles.text}>
            You have successfully made a payment for the Advertisement. The
            total amount you paid is $49.00.
          </ResponsiveText>
          <ResponsiveText style={styles.text}>
            Your ad will be live soon after the review.
          </ResponsiveText>
          <View style={styles.finishContainer}>
            <TouchableOpacity
              style={[styles.socialLoginBtn, {backgroundColor: '#0099A2'}]}
              onPress={() => props.navigation.navigate('Tab')}>
              <View style={styles.socialLoginContent}>
                <ResponsiveText style={styles.socialText}>
                  Finish
                </ResponsiveText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Content>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    paddingBottom:0,
    backgroundColor: '#F2F3FA',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkIcon: {
    height: wp(50),
    width: wp(50),
    resizeMode: 'contain',
  },
  socialLoginBtn: {
    height: wp('13%'),
    width: wp('80'),
    elevation: 2,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 15,
  },
  socialText: {
    color: '#fff',
  },
  paid: {
    marginBottom: 25,
    fontSize: 6,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 3.5,
    textAlign: 'center',
    marginVertical: 12,
    color: 'grey',
  },
  finishContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default EscrowApproved;
