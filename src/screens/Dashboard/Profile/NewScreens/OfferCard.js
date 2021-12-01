import {
  Image, TouchableOpacity, View, ScrollView, FlatList, Alert, StyleSheet
} from 'react-native'
import React, { useEffect, useState } from 'react'
import ResponsiveText from '../../../../components/layout/ResponsiveText'
import Colors from '../../../../theme/colors'
import Button from '../../../../components/layout/Button'
import AppHeader from '../../../../components/layout/AppHeader'
import Container from '../../../../components/layout/Container'
import axios from 'axios'
import { connect } from 'react-redux';
import moment from 'moment'
import API_URL from '../../../../config/constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const OfferCard = (props) => {
  const [data, setdata] = useState([])

  useEffect(() => {
    getBookingRequest()
  }, [])


  const getBookingRequest = () => {
    axios.post(`${API_URL}/studio/booking/requests`,
      {
        "user": props.userData._id
      },
      {
        headers: { 'x-auth-token': props.token }
      }).then(res => res.data)
      .then(res => {
        setdata(res?.data?.bookings)
        console.log('booking.......>>>', JSON.stringify(res?.data?.bookings))



      })
      .catch(error => {
        console.log('error', error)
      })
  }
  const resposeRequest = (id, offer) => {
    console.log(id, offer)
    axios.post(`${API_URL}/studio/booking/set-status`,
      {
        "booking_id": id,
        "status": offer
      },
      {
        headers: { 'x-auth-token': props.token }
      }).then(res => res.data)
      .then(res => {
        console.log('res.............', res.data.booking)
        // setdata(res.data.booking)
        Alert.alert(
          "Confirmation !",
          res.message,
          [{ text: "OK", onPress: () => props.navigation.goBack() }]
        );

      })
      .catch(error => {
        console.log('error', error)
      })
  }


  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        onLeftPress={() => props.navigation.goBack()}
        onRightPress={() => props.navigation.navigate('Scheduled')}
        rightIcon={() => (
          <Image
            source={require('../../../../assets/icons/update.png')}
            style={{ width: wp('6'), resizeMode: 'contain', tintColor: '#FFF' }}
          />
        )}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        {/* <ResponsiveText>koko</ResponsiveText> */}
        <FlatList
          keyExtractor={(item, index) => `${index}`}
          data={data}
          ListEmptyComponent={() => (
            <View style={{ alignContent: 'center' }}>
              <ResponsiveText style={{ color: 'grey', alignSelf: 'center', marginTop: 5 }}>No Bookings</ResponsiveText>
            </View>)
          }
          renderItem={({ item, index }) => {
            return (
              <View>
                <View
                  key={index}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,
                    elevation: 3,
                    marginTop: 15,
                    marginHorizontal: 15,
                    borderRadius: wp('2%'),
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    marginBottom: 5,
                  }}
                >
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 0.3,
                    borderColor: 'lightgrey',
                  }}
                  >
                    <View style={{
                      backgroundColor: 'rgba(64,179,185,0.1)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: wp(4),
                      paddingHorizontal: wp(3.5),
                    }}
                    >
                      <ResponsiveText style={{
                        color: Colors.BtnBackground, textAlign: 'center', fontSize: 8, fontWeight: 'bold',
                      }}
                      >
                        {item?.time?.slice(8, 10)}
                      </ResponsiveText>
                      <ResponsiveText style={{ fontSize: '3%', color: Colors.Primary }}>{moment(item.updatedAt).format("MMM")}</ResponsiveText>
                    </View>
                    <View style={{
                      marginLeft: wp(5),
                    }}
                    >
                      <ResponsiveText style={{ fontSize: 5.5, marginBottom: 3 }}>
                        {item?.bookedBy?.username}
                      </ResponsiveText>
                      <ResponsiveText style={{
                        fontSize: 3,
                        marginTop: 3,
                        color: 'grey',
                      }}
                      >{moment(item.createdAt).format('DD MMM, YYYY  |  h:mm a')}
                        {/* {item.time} */}
                      </ResponsiveText>
                    </View>
                  </View>

                  <ResponsiveText
                    numberOfLines={4}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      fontSize: 3.2,
                    }}
                  >
                    {item.text}
                  </ResponsiveText>

                  <View style={styles.statsContainer}>
                    <View style={styles.dateStyle}>
                      <ResponsiveText style={styles.statsTitle}>
                        Ends
                      </ResponsiveText>
                      <ResponsiveText style={styles.statsValueStyle}>
                        {moment(item.createdAt).format("ll")}
                        {/* Home */}
                      </ResponsiveText>
                    </View>

                    <View style={
                      styles.barGapStyle
                    }>

                    </View>
                    <View
                      style={styles.dateStyle}>
                      <ResponsiveText style={styles.statsTitle}>
                        Hours
                      </ResponsiveText>
                      <ResponsiveText style={styles.statsValueStyle}>
                        {/* {moment(item.createdAt).format("ll")} */}
                        {60}
                        {/* Home */}
                      </ResponsiveText>
                    </View>

                    <View style={styles.barGapStyle
                    }>

                    </View>
                    <View style={styles.dateStyle}>
                      <ResponsiveText style={styles.statsTitle}>
                        Total budget
                      </ResponsiveText>
                      <ResponsiveText style={styles.statsValueStyle}>
                        ${item.price}
                      </ResponsiveText>
                    </View>

                  </View>

                </View>


                <View style={{
                  justifyContent: 'space-around',
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  marginVertical: 5,
                  marginHorizontal: 15,
                }}>
                  <Button
                    btnContainer={{
                      width: '50%',
                      backgroundColor: Colors.Primary,
                      marginBottom: 0,
                      height: wp(12),

                    }}
                    titleStyle={{
                      color: 'white',
                      fontSize: 4,
                    }}
                    title="Accept"
                    onPress={() => resposeRequest(item._id, 'accepted')}
                  />
                  <Button
                    btnContainer={{
                      width: '50%',
                      backgroundColor: Colors.supportWhite,
                      marginBottom: 0,
                      height: wp(12),
                      borderWidth: 0.2,
                    }}
                    titleStyle={{
                      color: 'black',
                      fontSize: 4,
                    }}
                    title="Reject"
                    onPress={() => resposeRequest(item._id, 'rejected')}
                  />
                </View>

              </View>
            )
          }}
        />




        {/* {[...Array(5)].map((item, index) => {
          return (
            <View
              key={index}
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
                marginTop: 15,
                marginHorizontal: 15,
                borderRadius: wp('2%'),
                backgroundColor: '#fff',
                overflow: 'hidden',
                marginBottom: 5,
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: 'lightgrey',
              }}
              >
                <View style={{
                  backgroundColor: 'rgba(64,179,185,0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: wp(4),
                  paddingHorizontal: wp(3.5),
                }}
                >
                  <ResponsiveText style={{
                    color: Colors.BtnBackground, textAlign: 'center', fontSize: '5%', fontWeight: 'bold',
                  }}
                  >
                    18
                  </ResponsiveText>
                  <ResponsiveText style={{ fontSize: '3%', color: Colors.Primary }}>Today</ResponsiveText>
                </View>
                <View style={{
                  marginLeft: 10,
                }}
                >
                  <ResponsiveText style={{ fontSize: 3.5, fontWeight: 'bold' }}>
                    John Murphy
                  </ResponsiveText>
                  <ResponsiveText style={{
                    fontSize: 3,
                    color: 'grey',
                  }}
                  >
                    10 Sep,2020 | 12:00 am
                  </ResponsiveText>
                </View>
              </View>

              <ResponsiveText
                numberOfLines={4}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  fontSize: 3.2,
                }}
              >
                Hi, I'm looking for a studio to record my new song. I found yours it almost matches everything that I am looking for. Would love to have my song recorded at your studio.
              </ResponsiveText>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Button
                  btnContainer={{
                    width: '50%',
                    backgroundColor: Colors.Primary,
                    marginBottom: 0,
                    height: wp(12),

                  }}
                  titleStyle={{
                    color: 'white',
                    fontSize: 4,
                  }}
                  title="Accept"
                  onPress={() => null}
                />
                <Button
                  btnContainer={{
                    width: '50%',
                    backgroundColor: Colors.supportWhite,
                    marginBottom: 0,
                    height: wp(12),
                    // borderRightWidth: 0.5,
                    // borderTopWidth: 0.5,
                    borderWidth: 0.5,
                  }}
                  titleStyle={{
                    color: 'black',
                    fontSize: 4,
                  }}
                  title="Reject"
                  onPress={() => null}
                />
              </View>

            </View>
          )
        })} */}
      </ScrollView>
    </View>
  )
}






function mapStateToProps(state) {
  return {

    token: state.auth.token,
    userData: state.auth.user

  }
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OfferCard);



const styles = StyleSheet.create({
  statsContainer: {

    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: hp(2),
    borderTopWidth: 0.3,
    borderColor: 'lightgrey',
    // paddingHorizontal: wp(5)
    // backgroundColor: 'yellow'

  }, statsTitle: {
    fontSize: 4,
    fontWeight: 'bold',
    color: '#707070', paddingVertical: wp(1)

  }, barGapStyle: {
    width: wp(0.3),
    backgroundColor: 'grey',
    height: hp(6)
  }, statsValueStyle: {
    fontWeight: '900',
    fontSize: 3.7,
  }
});
