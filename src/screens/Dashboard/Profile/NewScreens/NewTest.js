import React, { useState } from 'react'
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { BoxShadow } from 'react-native-shadow'
import ResponsiveText from '../../../../components/layout/ResponsiveText'
import AppHeader from '../../../../components/layout/AppHeader'
import Icons from '../../../../theme/icons'
import SettingsItem from '../../../../components/SettingsItem'
import yellowstar from '../../../../assets/icons/yellowstar.png'
import Button from '../../../../components/layout/Button'
import Colors from '../../../../theme/colors'
import JobCard from './JobCard'
import OfferCard from './OfferCard'

function NewTest(props) {
  const shadowOpt = {
    width: wp(85),
    height: wp(28),
    color: '#F0F0F0',
    border: 20,
    radius: 5,
    opacity: 0.3,
    x: 1,
    y: 1,

  }
  return (
    <View style={{ flex: 1 }}>
      <AppHeader onLeftPress={() => props.navigation.goBack()} />
      <JobCard />
      <OfferCard />
    </View>
  )
}
const styles = StyleSheet.create({})

export default NewTest
