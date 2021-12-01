import React from 'react'
import {
  Image, StyleSheet, TouchableOpacity,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

function DecisionButton(props) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => props.onPress()} style={{ marginBottom: 20 }}>
      <LinearGradient
        colors={[...props.color]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0.0 }}
        style={{
          minHeight: wp('28'),
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5,
          marginHorizontal: 10,
        }}
      >
        <Image
          source={props.image}
          style={{
            height: wp('15'),
            width: '70%',
            resizeMode: 'contain',
          }}
        />
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
})
export default DecisionButton
