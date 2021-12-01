import React from 'react';
import { StatusBar, StyleSheet, View, TouchableOpacity, Image, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Icons from '../theme/icons';
import Input from './layout/Input';
import MeassageIcon from '../assets/icons/message.png';
import Ticket from '../assets/icons/ticket.png';
import Search from '../assets/icons/search.png'

function InboxHeader(props) {
  return (
    <LinearGradient
      colors={['#009C9F', '#008BA9', '#0075B6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.8, y: 0.0 }}
      style={{ minHeight: wp('28'), width: wp('100%') }}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <View style={[styles.content, { marginTop: getStatusBarHeight() }]}>
        <TouchableOpacity onPress={props.onPressBack}>
          {Icons.BackArrow(styles.backArrowIcon)}
        </TouchableOpacity>
        <View style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: 'rgba(255,255,255,.2)', width: wp('70'), borderRadius: 50 }}>
          <View style={{ width: '80%' }}>
            <TextInput
              style={styles.inputStyle}
              placeholder={'Search...'}
              placeholderTextColor={'#fff'}
              onChangeText={props.onChangeText}
              value={props.searchValue}
            />
          </View>
          {/* {Icons.Search(styles.searchIcon)} */}
          <View style={{ width: '20%', alignItems: 'center', }}>
            <Image style={styles.searchIcon} source={Search} />
          </View>
        </View>
        {/*<View style={{flex: 0.3}}/>*/}
        <TouchableOpacity
          style={{ height: 50, justifyContent: 'center' }}
          onPress={props.onPress}>
          <Image style={styles.messageIcon} source={Ticket} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {},
  content: {
    flex: 1,
    height: wp('28'),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  inputStyle: {
    width: '100%',
    height: wp('13'),
    color: '#fff',
    // backgroundColor: 'red',
    // borderRadius: wp(7),
    // backgroundColor: 'rgba(255,255,255,.2)',
    // color: '#fff',
    // paddingHorizontal: 25,
    // alignItems: "center",
    // paddingRight: 45,
    marginLeft: 10


  },
  backArrowIcon: {
    height: wp('12'),
    width: wp('8'),
    marginBottom: 3,
    tintColor: '#fff'
  },
  searchIcon: {
    // position: 'absolute',
    // right: 10,
    // top: 17,
    tintColor: '#fff',
    width: 20,
    height: 20,
    // backgroundColor: 'blue'
  },
  messageIcon: {
    height: wp('6'),
    width: wp('8'),
    tintColor: 'white',
    resizeMode: 'contain',
    // marginBottom: 3
  }
});
export default InboxHeader;
