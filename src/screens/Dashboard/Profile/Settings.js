import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import ResponsiveText from '../../../components/layout/ResponsiveText';
import Container from '../../../components/layout/Container';
import Content from '../../../components/layout/Content';
import AppHeader from '../../../components/layout/AppHeader';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Icons from '../../../theme/icons';
import SettingsItem from '../../../components/SettingsItem';
import yellowstar from "../../../assets/icons/yellowstar.png";
import { BoxShadow } from "react-native-shadow";
import { connect } from 'react-redux';
import axios from "axios"
import { LOGOUT } from '../../../redux/types';
import Star from 'react-native-star-view';




function Settings(props) {


  useEffect(() => {
    // console.log('Profile screen props___', props.userData.rating)

  }, [])


  const logout = () => {
    props.logoutUser()

  }

  const shadowOpt = {
    width: wp(83),
    height: wp(28),
    color: "#F0F0F0",
    border: 10,
    radius: 5,
    opacity: 0.7,
    x: 1,
    y: 1,
    style: { flex: 1 },


  }
  return (
    <View style={{ flex: 1 }}>
      <AppHeader onLeftPress={() => props.navigation.goBack()} rightIcon={() => Icons.LogOut()}
        onRightPress={() => logout()} />
      <ScrollView style={{ backgroundColor: '#EEEFF6', flex: 1 }}>
        <View style={{ padding: 10 }}>


          <View style={styles.informationContainer}>
            <View style={styles.profileContainer}>
              <View style={styles.dpContainer}>
                <Image
                  style={styles.profileImage}
                  source={{ uri: props?.userData?.imgUrl }}

                // source={{ uri: props.userData.imgUrl }}
                // source={{
                //   uri:
                //     'https://i.picsum.photos/id/1014/6016/4000.jpg?hmac=yMXsznFliL_Y2E2M-qZEsOZE1micNu8TwgNlHj7kzs8',
                // }}
                />
              </View>
              <View style={styles.usernameContainer}>
                <ResponsiveText style={styles.username}>
                  {props?.userData?.username}

                </ResponsiveText>
                {props?.userData?.isVerified &&
                  Icons.Verified()
                }
              </View>
              <ResponsiveText style={{ color: '#77869E', marginBottom: 15 }}>
                {props?.userData?.email}
              </ResponsiveText>
              {props?.userData?._type === "Artist" || props?.userData?._type === "Singer" &&
                <TouchableOpacity
                  style={styles.starImageView}>

                  <Star score={Math.round(props?.userData?.rating)} style={styles.starStyle} />
                  <ResponsiveText style={{ fontSize: 2.5, fontWeight: 'bold', marginLeft: 5 }}>( {props?.userData?.reviews?.length})</ResponsiveText>
                </TouchableOpacity>
              }

              <BoxShadow setting={shadowOpt}>
                <View style={styles.descriptionContainer}>
                  <ResponsiveText style={{ color: '#77869E' }}>
                    {props?.userData?.bio}

                  </ResponsiveText>
                </View>
              </BoxShadow>
            </View>
          </View>


          < ResponsiveText style={styles.gen}>GENERAL</ResponsiveText>
          <View>
            {/* <SettingsItem
              icon={require('../../../assets/icons/msg.png')}
              onPress={() => props.navigation.navigate('AvailableBooking')}
              heading={'Booking Messages'}
              subHeading={'Someone is looking for you'}
            /> */}
            {!props.socialAuth &&
              <SettingsItem
                icon={require('../../../assets/icons/notification.png')}
                onPress={() => props.navigation.navigate('ProfileSettings')}
                heading={'Profile Settings'}
                subHeading={'Change your profile settings'}
              />
            }
            <SettingsItem
              icon={require('../../../assets/icons/privacy.png')}
              onPress={() => props.navigation.navigate('PrivacySettings')}
              heading={'Privacy'}
              subHeading={'Change your password'}
            />
            <SettingsItem
              icon={require('../../../assets/icons/notification.png')}
              onPress={() => props.navigation.navigate('NotificationSettings')}
              heading={'Notifications'}
              subHeading={'Change your notification settings'}
            />



          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  informationContainer: {
    // height: wp('85'),
    // padding: 20,
    // paddingBottom: 20,
    // backgroundColor: '#EEEFF6',
    height: wp('100'),
    padding: 20,
    paddingBottom: 15,
    backgroundColor: '#EEEFF6',
    marginTop: 15,

  },
  profileContainer: {
    width: wp(83),

    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // justifyContent: 'space-between'
  },
  profileImage: {
    height: 80,
    width: 80,
    overflow: 'hidden',
    borderRadius: 10,
  },
  dpContainer: {
    marginTop: 25,
    height: 95,
    width: 95,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  username: {
    marginHorizontal: 8,
    fontSize: 4,
    color: '#77869E',
    fontWeight: 'bold'
  },
  descriptionContainer: {
    // width: wp(84.8),
    padding: 15,
    alignItems: 'center',
    flexWrap: 'wrap',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    flex: 1,
    backgroundColor: 'white'
  },
  starImageView: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gen: {
    marginVertical: 10,
    fontWeight: 'bold',
  }, starStyle: {
    width: 100,
    height: 20,

  },
});

function mapStateToProps(state) {
  return {

    token: state.auth.token,
    userData: state.auth.user,
    socialAuth: state.auth.social,

  }
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch({ type: LOGOUT }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);