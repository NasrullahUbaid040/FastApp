import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, ScrollView, View, FlatList, TouchableOpacity } from 'react-native';
import Content from '../../../components/layout/Content';
import AppHeader from '../../../components/layout/AppHeader';
import NotificationItem from '../../../components/NotificationItem';
import API_URL from '../../../config/constants';
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios"
import ResponsiveText from '../../../components/layout/ResponsiveText'
import { connect } from 'react-redux';
import ActivityLoader from '../../../components/ActivityLoader'

const Notification = (props) => {
  // console.log("my user id", props.token)
  const [userNotification, setUserNotification] = useState([])
  const [noDataFound, setNoDataFound] = useState(false)
  const [isRefreshing, setisRefreshing] = useState(true);
  const [loader, setLoader] = useState(true);

  const limit = 10;
  let _skip = useRef(0);
  const _notification = useRef([])

  useFocusEffect(
    React.useCallback(() => {
      getMyNotification()
    }, [])
  );


  const loadMoreNotifications = () => {
    _skip.current = (_skip.current + 10)
    getMyNotification()
  }

  const getMyNotification = () => {
    axios.post(`${API_URL}/notification/my-notifications?skip=${_skip.current}&limit=10`, null, {
      headers: { 'x-auth-token': props.token }
    })
      .then(res => {

        setLoader(false)


        if (!res?.data?.data?.notifications) {
          // setNoDataFound(true)
        } else {


          if (_skip.current == 0) {
            if (res.data.data.notifications.length == 0) {

              setNoDataFound(true)
            }

            // console.log('_skip.current', _skip.current)
            _notification.current = res.data.data.notifications
            setUserNotification(_notification.current)

          } else {

            console.log('_skip.current', _skip.current)
            _notification.current = [..._notification.current, ...res.data.data.notifications]
            setUserNotification([..._notification.current])
            // console.log('userNotification..........................', JSON.stringify(userNotification))
          }
        }


      })
      .catch((err) => {
        console.log('ERROR:::', err)
      });
  }

  return (
    <View style={{ flex: 1 }}>
      <AppHeader onLeftPress={() => 
        props.navigation.goBack()
        } />

      {loader &&
        <ActivityLoader />
      }

      {noDataFound ?
        <View style={{ alignSelf: 'center' }}>
          <ResponsiveText style={{ color: 'grey', marginTop: 10 }}>No Notification</ResponsiveText>
        </View>
        : null}

      <FlatList
        data={userNotification}
        onEndReachedThreshold={0.01}
        onEndReached={() =>
          loadMoreNotifications()
        }
        keyExtractor={item => item._id}
        renderItem={({ item, index }) => {
          return (
            <View style={{ marginTop: 5 }} >
              <NotificationItem key={index} comment={item} props={props} />
            </View>
          )
        }}
      /> 
    </View>
  );
}
const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
});

function mapStateToProps(state) {
  return {
    token: state.auth.token,
    // userData: state.auth.user

  }
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);