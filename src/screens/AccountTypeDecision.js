import React, { useRef, useState, useEffect } from 'react';
import {
  View, BackHandler, Alert
} from 'react-native'
import AppHeader from '../components/layout/AppHeader'
import Container from '../components/layout/Container'
import Content from '../components/layout/Content'
import Button from '../components/layout/Button'
import DecisionButton from '../components/DecisionButton'
import { userType } from '../redux/actions/authActions'
import { connect } from 'react-redux';
import { useFocusEffect } from "@react-navigation/native";


const AccountTypeDecision = (props) => {
  let currentCount = 0;

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();

    }, [])
  );
  
  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );
  //   return () => backHandler.remove();
  // }, [])

  const backAction = () => {
    console.log("AccountTypeDecision")
    setTimeout(() => {
      currentCount = 0
    }, 2000); // 2 seconds to tap second-time

    currentCount = (currentCount + 1)
    if (currentCount == 2) {

      console.log("currentCount", currentCount)
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
    }
    return true;

  };
  return (
    <Container style={{ flex: 1 }}>
      <AppHeader title="Choose an account type" />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <DecisionButton
          onPress={() => {
            props.navigation.navigate('Welcome', {
              type: 'FAST',
            })
            props.typeOfUser('FAST')
          }}
          // <DecisionButton
          //   onPress={() =>   props.REMOVE({type: 'FAST'})}
          color={['#009C9F', '#008BA9', '#0075B6']}
          image={require('../assets/images/fastType.png')}
        />
        <DecisionButton
          onPress={() => {
            props.navigation.navigate('Welcome', {
              type: 'FAST_TRACK',
            })
            props.typeOfUser('FAST_TRACK')
          }}
          color={['#589FF0', '#4482C2', '#204D6E']}
          image={require('../assets/images/FastTrack.png')}
        />
      </View>

    </Container>
  )
}




const mapDispatchToProps = (dispatch) => {
  return {
    typeOfUser: (type) => dispatch(userType({ type })),
  };
}

export default connect(null, mapDispatchToProps)(AccountTypeDecision);