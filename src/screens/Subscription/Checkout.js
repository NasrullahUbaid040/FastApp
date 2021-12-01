import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Container from '../../components/layout/Container';
import Content from '../../components/layout/Content';
import AppHeader from '../../components/layout/AppHeader';
import ResponsiveText from '../../components/layout/ResponsiveText';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Colors from '../../theme/colors';
import MyCarousel from '../../components/Carosal';
import Icons from '../../theme/icons';
import Button from '../../components/layout/Button';

function Checkout({ navigation }) {
  const [onPayWithEscrowStatus, setPayWithEscrowStatus] = useState(false);
  const [stayConnected, setStayConnected] = useState(false);

  const onPayNow = () => {
    navigation.navigate('CardDetails');
  };

  const onPayWithEscrow = () => {
    navigation.navigate('CardDetails');
  };

  const onPayWithGooglePay = () => {
    navigation.navigate('EscrowApproved', { type: 'paid' });
  };

  const onPayWithApplePay = () => {
    navigation.navigate('EscrowApproved', { type: 'paid' });
  };

  const onPayWithPayPal = () => {
    navigation.navigate('EscrowApproved', { type: 'paid' });
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader onLeftPress={() => navigation.goBack()} />
      <Content>
        <View style={styles.content}>
          {!onPayWithEscrowStatus &&
            <>
              <View style={[styles.textRow]}>
                <ResponsiveText style={styles.leftText}>
                  Total bill amount
                </ResponsiveText>
                <TouchableOpacity onPress={() => alert('Summary coming soon!')}>
                  <ResponsiveText style={{ ...styles.leftText, ...styles.rightText }}>
                    Summary
                  </ResponsiveText>
                </TouchableOpacity>
              </View>
              <ResponsiveText style={{ ...styles.leftText, ...styles.priceText }}>
                $49.00
              </ResponsiveText>
            </>
          }
          <View style={styles.textRow}>
            <ResponsiveText style={styles.leftText}>Saved Cards</ResponsiveText>
            <TouchableOpacity
              style={styles.addNewContainer}
              onPress={() => navigation.navigate('CardDetails')}>
              <View style={styles.addContainer}>
                <ResponsiveText style={{ color: Colors.Primary, marginBottom: 2 }}>
                  +
                </ResponsiveText>
              </View>
              <ResponsiveText
                style={{ ...styles.leftText, ...styles.rightText, marginTop: 8 }}>
                Add New
              </ResponsiveText>
            </TouchableOpacity>
          </View>

          <MyCarousel />

          {!onPayWithEscrowStatus ? (
            <View style={styles.socialBtnContainer}>
              <TouchableOpacity
                style={[
                  styles.socialLoginBtn,
                  { marginRight: 8, backgroundColor: '#0099A2' },
                ]}
                onPress={onPayNow}>
                <View style={styles.socialLoginContent}>
                  <ResponsiveText style={styles.socialText}>
                    Pay Now
                  </ResponsiveText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialLoginBtn, { backgroundColor: '#6D68FF' }]}
                onPress={() => setPayWithEscrowStatus(true)}>
                <View style={styles.socialLoginContent}>
                  <ResponsiveText style={styles.socialText}>
                    Pay with Escrow
                  </ResponsiveText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.socialLoginBtn,
                  { marginRight: 8, borderWidth: 1 },
                ]}
                onPress={onPayWithGooglePay}>
                <View
                  style={[
                    styles.socialLoginContent,
                    ,
                    { justifyContent: 'center' },
                  ]}>
                  <View style={[styles.socialIconContainer]}>
                    {Icons.Google({ height: wp('8'), width: wp('7') })}
                  </View>
                  <ResponsiveText
                    style={{
                      ...styles.socialText,
                      color: '#000',
                      fontSize: 7,
                      fontWeight: '300',
                    }}>
                    Pay
                  </ResponsiveText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialLoginBtn, { borderWidth: 1 }]}
                onPress={onPayWithApplePay}>
                <View
                  style={[
                    styles.socialLoginContent,
                    { justifyContent: 'center' },
                  ]}>
                  <View style={[styles.socialIconContainer]}>
                    {Icons.Apple({
                      height: wp('7'),
                      width: wp('7'),
                      marginBottom: 5,
                    })}
                  </View>
                  <ResponsiveText
                    style={{
                      ...styles.socialText,
                      color: '#000',
                      fontSize: 7,
                      fontWeight: '300',
                    }}>
                    Pay
                  </ResponsiveText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.goToBasicSignup}
                onPress={onPayWithPayPal}>
                <View
                  style={[
                    styles.socialLoginContent,
                    ,
                    { justifyContent: 'center' },
                  ]}>
                  <View style={[styles.socialIconContainer]}>
                    {Icons.PayPal({ height: wp('8'), width: wp('50') })}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {onPayWithEscrowStatus &&
                <>
                  <View style={styles.textRow}>
                    <ResponsiveText
                      style={{ ...styles.leftText, fontSize: 4, color: '#000' }}>
                      {'  '} $49
                    </ResponsiveText>
                    <TouchableOpacity onPress={() => alert('Summary coming soon!')}>
                      <ResponsiveText
                        style={{
                          ...styles.leftText,
                          ...styles.rightText,
                          fontSize: 4,
                          color: '#000',
                        }}>
                        Advertisement Charges
                      </ResponsiveText>
                    </TouchableOpacity>
                  </View>
                  <View style={{ borderWidth: 1, borderColor: '#D8D8DC' }} />
                  <View style={styles.textRow}>
                    <ResponsiveText
                      style={{ ...styles.leftText, fontSize: 4, color: '#000' }}>
                      + $4
                    </ResponsiveText>
                    <TouchableOpacity onPress={() => alert('Summary coming soon!')}>
                      <ResponsiveText
                        style={{
                          ...styles.leftText,
                          ...styles.rightText,
                          fontSize: 4,
                          color: '#000',
                        }}>
                        Transaction Fee
                      </ResponsiveText>
                    </TouchableOpacity>
                  </View>
                </>
              }
              <View style={[styles.textRow, { marginTop: 15 }]}>
                <ResponsiveText style={styles.leftText}>
                  Total bill amount
                </ResponsiveText>
                <TouchableOpacity onPress={() => alert('Summary coming soon!')}>
                  <ResponsiveText
                    style={{ ...styles.leftText, ...styles.rightText }}>
                    Summary
                  </ResponsiveText>
                </TouchableOpacity>
              </View>
              <ResponsiveText style={{ ...styles.leftText, ...styles.priceText }}>
                $49.00
              </ResponsiveText>
              <View>
                <TouchableOpacity
                  style={styles.stayConnectedContainer}
                  onPress={() => setStayConnected(!stayConnected)}>
                  <View
                    style={[
                      styles.checkbox,
                      stayConnected
                        ? { backgroundColor: Colors.Primary, borderWidth: 0 }
                        : null,
                    ]}>
                    {stayConnected &&
                      Icons.Tick({ height: 12, width: 12, marginTop: 2 })}
                  </View>
                  <ResponsiveText style={styles.extraText}>
                    I agree to Escrow terms & conditions.
                  </ResponsiveText>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 10,
                  marginTop: 25,
                }}>
                <TouchableOpacity
                  style={[styles.socialLoginBtn, { backgroundColor: '#6D68FF' }]}
                  onPress={() => {
                    navigation.navigate('EscrowApproved', { type: 'paid' });
                    setPayWithEscrowStatus(false);
                  }}>
                  <View style={styles.socialLoginContent}>
                    <ResponsiveText style={styles.socialText}>
                      Pay with Escrow
                    </ResponsiveText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Content>
    </View>
  );
}
const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F1F2F9'
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftText: {
    color: '#8F8FA7',
    fontSize: 5,
    marginBottom: 10,
    marginTop: 5,
  },
  rightText: {
    color: Colors.Primary,
  },
  priceText: {
    fontSize: 9,
    color: '#000',
  },
  addNewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addContainer: {
    borderWidth: 1,
    borderColor: Colors.Primary,
    backgroundColor: 'transparent',
    height: 20,
    width: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 4,
    justifyContent: 'center'
  },
  socialBtnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialIconContainer: {
    marginRight: 5,
  },
  socialLoginBtn: {
    height: wp('13%'),
    width: wp('44.5'),
    elevation: 2,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 8,
  },
  socialLoginContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  socialText: {
    fontWeight: 'bold',
    color: 'white',
    // fontSize:1.2,
  },
  goToBasicSignup: {
    backgroundColor: '#FFC520',
    elevation: 2,
    width: wp('100') - 30,
    minHeight: wp('14%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: wp('3.5%'),
    borderRadius: wp('2%'),
    marginBottom: 8,
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
  stayConnectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraText: {
    color: '#BBB',
    marginLeft: 10,
  },
});
export default Checkout;
