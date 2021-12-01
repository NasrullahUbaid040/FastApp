import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import moment from 'moment'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import ResponsiveText from './layout/ResponsiveText'
import Colors from '../theme/colors'

const ConfirmedCard = ({ props, bookingDetail }) => {
  // console.log("BOOKING DETAILSLSLSLS", bookingDetail[0]?.time)
  // console.log("BOOKING CONFIRM", bookingDetail.upcomingbookings[0])

  return (
    <View style={{ marginTop: wp(3), flexDirection: 'row', height: wp(25), width: '100%', elevation: 8, backgroundColor: 'white', borderRadius: wp(2) }}>
      <View style={{
        backgroundColor: Colors.Primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: wp(2),
        borderBottomLeftRadius: wp(2), width: '20%'
      }}>
        <ResponsiveText style={{ paddingHorizontal: wp(4), color: 'white', fontWeight: 'bold', fontSize: wp(2) }}>{moment(bookingDetail.time).format('D')}</ResponsiveText>
      </View>
      <View style={{ width: '100%', paddingLeft: wp(5), paddingVertical: wp(3) }}>
        <ResponsiveText style={{ fontWeight: 'bold' }}>Recording for {bookingDetail?.bookedBy?.name}</ResponsiveText>
        <ResponsiveText style={{ fontWeight: 'bold', fontSize: wp(0.8), paddingVertical: wp(1.5) }}>Confirmed</ResponsiveText>
        <ResponsiveText style={{ fontWeight: 'bold', fontSize: wp(0.8), color: Colors.Primary }}>{moment(bookingDetail.time).format('dddd : hh:a')}</ResponsiveText>
      </View>
    </View>
  )
}

export default ConfirmedCard
