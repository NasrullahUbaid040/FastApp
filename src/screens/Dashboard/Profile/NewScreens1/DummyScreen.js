import React, { useState, useRef, useEffect } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator, FlatList
} from 'react-native'
import { connect } from 'react-redux';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'
import AppHeader from '../../../../components/layout/AppHeader'
import Button from '../../../../components/layout/Button'
import Colors from '../../../../theme/colors'
import Container from '../../../../components/layout/Container'
import CircleAnalytics from '../../../../components/CircleAnalytics'
import ConfirmedCard from '../../../../components/ConfirmedCard'
import ResponsiveText from '../../../../components/layout/ResponsiveText'
import StarCard from '../../../../components/starCard'
import Graph from '../../../../components/Graph'
import WorldMap from '../../../../components/DominationMap'
import axios from 'axios'
import API_URL from '../../../../config/constants';
import { data } from '../../../../components/DummyData/dummyData'

let markedDates = {
  '2021-11-15': { marked: true, dotColor: '#50cebb' },
  '2021-11-16': { marked: true, dotColor: '#50cebb' },
  '2021-11-21': { startingDay: true, color: '#50cebb', textColor: 'white' },
  '2021-11-22': { color: '#70d7c7', textColor: 'white' },
  '2021-11-23': { color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white' },
  '2021-11-24': { color: '#70d7c7', textColor: 'white' },
  '2021-11-25': { endingDay: true, color: '#50cebb', textColor: 'white' }
}

function DummyScreen(props) {
  // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDhiYmE3YWQyMjYwNDEzZDg2ZDI5NTUiLCJpYXQiOjE2MjAyNzk2MDh9.DUb2Xo9MsCTmQJ0SXFRThX0F-ReQBq68XSTXHe_2cZQ"
  let token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDhiYmE3YWQyMjYwNDEzZDg2ZDI5NTUiLCJpYXQiOjE2MjAyNzk2MDh9.DUb2Xo9MsCTmQJ0SXFRThX0F-ReQBq68XSTXHe_2cZQ'
  const [dateSelected, setDateSelected] = useState({ "2021-11-13": { selected: true, selectedColor: '#0D8991' } }, { "2021-11-14": { marked: true, } })
  const [rendered, setRendered] = useState(false)
  const [statsData, setStatsData] = useState([])
  const [bookingsData, setBookingsData] = useState([])
  const [bookingTime, setBookingTime] = useState(null)

  useEffect(() => {
    setRendered(true)
    getStudioStats()

  }, [])

  const getStudioStats = () => {
    axios.get(`${API_URL}/user/stats`, {
      headers: { 'x-auth-token': token1 }
    }).then(res => {
      // console.log(">>>>>>> 12121212", res.data.upcomingbookings[0].time)
      setBookingsData(res.data.upcomingbookings)
      setStatsData(res.data)
      let obj = {};

      let arr = res.data.upcomingbookings.map((item, index) => {

        let a = null;
        return (
          index === 0 ?
            // console.log(a[`moment(item.time).format('YYYY-MM-DD')`].push({ selected: true, selectedColor: '#0D8991' }))
            obj[moment(item.time).format('YYYY-MM-DD')] = { selected: true, selectedColor: '#0D8991' }
            :
            // console.log(a[moment(item.time).format('YYYY-MM-DD')].push({ marked: true, }))
            obj[moment(item.time).format('YYYY-MM-DD')] = { marked: true, }

        )

      })
      console.log("obj", obj)

      setBookingTime(obj)



    }).catch((err) => console.log(err))
  }


  const renderItem = ({ item }) => (
    <ConfirmedCard
      bookingDetail={item}
    />
  );


  const kFormatter = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
  }



  return (
    <Container style={{ flex: 1 }}>
      <AppHeader onLeftPress={() => props.navigation.goBack()} />
      {/* <ResponsiveText> {statsData.filter} </ResponsiveText> */}
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginTop: wp(5), flex: 1, paddingHorizontal: wp(5) }}>
          <Button
            onPress={() => console.log("Analytics")}
            btnContainer={{
              backgroundColor: Colors.supportWhite, elevation: 8,
            }}
            titleStyle={{
              color: Colors.Primary, fontWeight: 'normal',
            }}
            title="Analytics"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(4) }}>
            <CircleAnalytics day="Weekly"
              // price="$1.3k"
              price={"$ " + kFormatter(statsData._weekyEarning)} />
            <CircleAnalytics day="Monthly"
              // price="$1.5k"
              price={"$ " + kFormatter(statsData._monthlyEarning)} />
            <CircleAnalytics day="Yearly"
              // price="$2.7k"
              price={"$ " + kFormatter(statsData._yearlyEarning)} />
          </View>
          <Button
            onPress={() => console.log("Bookings")}
            btnContainer={{
              backgroundColor: Colors.supportWhite, elevation: 8, marginVertical: wp(8),
            }}
            titleStyle={{
              color: Colors.Primary, fontWeight: 'normal',
            }}
            title="Bookings"
          />
          <View style={{ marginTop: wp(4) }}>
            <Calendar
              // disabledByDefault={true}
              onDayPress={(day) => {
                console.log("BOOKINGS", bookingTime)
              }}
              // current={newDate}
              hideArrows
              // markedDates={bookingTime}
              markedDates={bookingTime}
              // markedDates={{
              //   // [moment(bookingTime).format('YYYY-MM-DD')]: { selected: true, selectedColor: '#0D8991' },
              //   [moment(Date.now()).format('YYYY-MM-DD')]: { selected: true, selectedColor: '#0D8991' },
              //   '2021-11-12': { marked: true, },
              // }}
              hideExtraDays
              hideDayNames
              disableArrowLeft
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                selectedDayTextColor: 'white',
                todayTextColor: 'black',
                dayTextColor: 'black',
              }}
              renderHeader={(date) => {
                return (
                  <View />
                )
              }}
            />
          </View>

          {/* <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          /> */}

          < FlatList
            // contentContainerStyle={{ alignItems: 'center' }}
            data={bookingsData}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item?._id}
            renderItem={renderItem}
          />
          {/* <ConfirmedCard
            bookingDetail={bookingsData}
          /> */}
          <Button
            btnContainer={{
              backgroundColor: Colors.supportWhite, elevation: 8, marginVertical: wp(6),
            }}
            titleStyle={{
              color: Colors.Primary, fontWeight: 'normal',
            }}
            title="Ratings"
          />
          <View style={{ flexDirection: 'row', marginTop: wp(8), }}>
            <View style={{ width: '30%', alignItems: 'center' }}>
              <ResponsiveText style={styles.ratingText}>{Math.round(statsData.rating * 10) / 10} </ResponsiveText>
              <ResponsiveText style={styles.outOfText}>out of 5</ResponsiveText>
            </View>
            <View style={{ alignSelf: 'flex-end', width: '70%', alignItems: 'flex-end' }}>
              <StarCard info={statsData.statsRating} totalRatings={statsData.totalRatings} />
              <ResponsiveText>{statsData.totalRatings} Ratings</ResponsiveText>
            </View>

          </View>
          <Button
            btnContainer={{
              backgroundColor: Colors.supportWhite, elevation: 8, marginVertical: wp(6),
            }}
            titleStyle={{
              color: Colors.Primary, fontWeight: 'normal',
            }}
            title="Ad Spending"
          />

          <View style={{ flexDirection: 'row', marginTop: wp(8), marginBottom: wp(5) }}>
            <View style={{
              flex: 1, alignItems: 'center', borderRightWidth: 0.5, borderColor: 'grey',
            }}
            >
              <ResponsiveText style={{ fontSize: wp(1.5) }}>$ {statsData.thisMonth}</ResponsiveText>
              <ResponsiveText style={{ fontSize: wp(0.8), color: 'grey' }}>{moment(new Date()).format('MMMM')}</ResponsiveText>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <ResponsiveText style={{ fontSize: wp(1.5), color: Colors.Primary }}>$ {parseInt(statsData.thisMonth - statsData.prevMonth)}</ResponsiveText>
              <ResponsiveText style={{ fontSize: wp(0.8), color: 'grey' }}>from previous month</ResponsiveText>
            </View>
          </View>

          {rendered ? (
            <>
              <Graph />
              <View>
                {/* :TODO: */}
                {statsData?.domination &&
                  <WorldMap domination={statsData?.domination} totalDomination={statsData?.total} />
                }
              </View>
            </>
          ) : (
            <View style={{ marginVertical: 20 }}>
              <ActivityIndicator />
            </View>
          )}

        </View>
      </ScrollView>
    </Container>
  )
}
const styles = StyleSheet.create({
  ratingText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.Primary,
  },
  outOfText: {
    color: 'grey',
    // alignSelf: 'flex-end',
    // paddingRight: 15,
  },
})


function mapStateToProps(state) {
  return {

    token: state.auth.token,
    userData: state.auth.user
  }
}


function mapDispatchToProps(dispatch) {
  return
  {

  };
}


export default connect(mapStateToProps, mapDispatchToProps)(DummyScreen)