import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Container from '../../components/layout/Container';
import Content from '../../components/layout/Content';
import AppHeader from '../../components/layout/AppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ResponsiveText from '../../components/layout/ResponsiveText';
import CardInput from '../../components/CardInput';
import {backgroundColor} from 'react-native-calendars/src/style';

function CardDetails (props) {
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [save, setSave] = useState(false);
  const [scanType, setScanType] = useState(false);

  const onPayWithEscrow = () => {
    props.navigation.navigate('EscrowApproved', {type: 'approve'});
  };
  return (
    <View style={{flex: 1}}>
      <AppHeader onLeftPress={() => props.navigation.goBack()}/>
      <Content style={styles.content} >
        <View style={styles.contentContainer}>
          <View style={styles.typeRow}>
            <TouchableOpacity onPress={() => setScanType(false)}>
              <ResponsiveText style={{...styles.typeText, color: scanType ? 'lightgrey' : '#0099A2'}}>
                Enter Details
              </ResponsiveText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setScanType(true)}>

              <ResponsiveText style={{...styles.typeText, color: !scanType ? 'lightgrey' : '#0099A2'}}>
                Scan a card
              </ResponsiveText>
            </TouchableOpacity>
          </View>

          <CardInput
            title={'Name'}
            placeholder={'Enter your name'}
            onChangeText={(e) => setName(e)}
            value={name}
          />
          <CardInput
            title={'Car Number'}
            placeholder={'Enter card number'}
            onChangeText={(e) => setCardNumber(e)}
            value={cardNumber}
          />
          <CardInput
            title={'Expiry Date'}
            placeholder={'Enter card\'s Expiry Date'}
            onChangeText={(e) => setExpiryDate(e)}
            value={expiryDate}
          />
          <CardInput
            title={'CVV'}
            placeholder={'Enter CVV'}
            onChangeText={(e) => setCVV(e)}
            value={cvv}
          />

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.typeRow, {paddingHorizontal: 10, justifyContent: 'space-between', marginTop: 12}]}
            onPress={() => setSave(!save)}>
            <ResponsiveText
              style={{
                ...styles.typeText,
                color: 'grey',
                fontSize: 3.5,
                fontWeight: '300',
              }}>
              Save this card
            </ResponsiveText>
            <View
              style={[
                styles.saveCircle,
                save ? {backgroundColor: '#0099A2'} : null,
              ]}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 30,
          }}>
          <TouchableOpacity
            style={[styles.socialLoginBtn, {backgroundColor: '#0099A2'}]}
            onPress={onPayWithEscrow}>
            <View style={styles.socialLoginContent}>
              <ResponsiveText style={styles.socialText}>Pay Now</ResponsiveText>
            </View>
          </TouchableOpacity>
        </View>
      </Content>
    </View>
  );
}
const styles = StyleSheet.create({
  content: {
    backgroundColor: '#F1F2F9',
    padding: 20,
  },
  contentContainer: {
    backgroundColor: '#FFF',
    width: wp('100') - 40,
    borderRadius: 15,
    alignSelf: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  socialLoginBtn: {
    height: wp('11%'),
    width: wp('44'),
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
    fontSize: 3.5,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 12,
  },
  typeText: {
    // fontSize: 5,
    fontWeight: 'bold',
    color: '#0099A2',
  },
  saveCircle: {
    height: 15,
    width: 15,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
  },
});
export default CardDetails;
