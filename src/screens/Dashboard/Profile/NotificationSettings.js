import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native'
import AppHeader from '../../../components/layout/AppHeader';
import Colors from "../../../theme/colors";
import ResponsiveText from '../../../components/layout/ResponsiveText';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import axios from 'axios';
import API_URL from '../../../config/constants';
import { updateNotiiData } from '../../../redux/actions/authActions'


function NotificationSettings(props) {

  useEffect(() => {
    console.log('........>', props?.userData?.enableNotifications)
    console.log('........>', props.userData._id)
  }, [])
  const [toggle1, setToggle1] = useState(props?.userData?.enableNotifications)
  const [toggle2, setToggle2] = useState(true)

  const invertNotification = () => {
    console.log('inverting toogle', !toggle1)
    setToggle1(!toggle1)

    axios.put(`${API_URL}/user/toggle-notifications/${props.userData._id}`, null, null)
      // .then(res => res.data)
      .then(res => {
        console.log('res...', res?.data?.user?.enableNotifications),
          props.UdpdateUserData(res?.data?.user?.enableNotifications)
      }
      )

  }
  return (
    <View style={{ flex: 1 }}>
      <AppHeader onLeftPress={() => props.navigation.goBack()} />
      <ScrollView style={{ backgroundColor: '#EEEFF6', flex: 1 }}>
        <View style={styles.notificationContainer}>
          <View style={{ justifyContent: 'space-between' }}>
            <ResponsiveText style={{ fontSize: 4, fontWeight: 'bold', marginBottom: 5 }}>
              {'Enable / Disable Notification'}</ResponsiveText>
            <ResponsiveText style={{ fontSize: 3 }}>Allow FAST to send you notifications.</ResponsiveText>
          </View>
          <View style={{ alignSelf: 'center' }}>
            <ToggleSwitch
              isOn={toggle1}
              onColor={Colors.Primary}
              offColor='#ccc'
              labelStyle={{ color: "black", fontWeight: "900" }}
              size="medium"
              onToggle={() => {
                invertNotification()
                // console.log('inverting toogle', !toggle1)
                // setToggle1(!toggle1)
              }}
            />
          </View>
        </View>
        <View style={[styles.notificationContainer, { borderBottomWidth: 0 }]}>
          <View style={{ justifyContent: 'space-between' }}>
            <ResponsiveText style={{ fontSize: 4.3, fontWeight: 'bold', marginBottom: 5 }}>Email Updates</ResponsiveText>
            <ResponsiveText style={{ fontSize: 3.4 }}>Allow FAST to send you emails.</ResponsiveText>
          </View>
          <View style={{ alignSelf: 'center' }}>
            <ToggleSwitch
              isOn={toggle2}
              onColor={Colors.Primary}
              offColor='#ccc'
              labelStyle={{ color: "black", fontWeight: "900" }}
              size="medium"
              onToggle={() => {
                setToggle2(!toggle2)
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  notificationContainer: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#ccc',
    alignSelf: 'center',
    borderBottomWidth: 1,
    width: wp(93)
  }
});



function mapStateToProps(state) {
  return {

    token: state.auth.token,
    userData: state.auth.user,

  }
}

function mapDispatchToProps(dispatch) {
  return {
    UdpdateUserData: payload => dispatch(updateNotiiData(payload)),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettings);