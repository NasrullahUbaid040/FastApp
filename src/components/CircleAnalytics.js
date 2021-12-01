import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import ResponsiveText from './layout/ResponsiveText'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Colors from '../theme/colors';


const CircleAnalytics = (props) => {
  return (
      <View style={{width: wp(20),marginTop: wp(3)}}>
    <View style={{height: wp(20),borderWidth: 4,width: wp(20),borderRadius: wp(10),justifyContent: 'center',alignItems: 'center',borderColor: Colors.Primary}}>
      <ResponsiveText style={{color: 'black',fontWeight: 'bold'}}>{props.price}</ResponsiveText>
    </View>
          <ResponsiveText style={{textAlign: 'center',marginTop: wp(2),fontSize: wp(0.8),fontWeight: 'bold'}}>{props.day}</ResponsiveText>
      </View>
  )
}

export default CircleAnalytics
