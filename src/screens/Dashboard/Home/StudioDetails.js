import React, { useState } from 'react'
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar, FlatList
} from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Content from '../../../components/layout/Content'
import ResponsiveText from '../../../components/layout/ResponsiveText'
import Colors from '../../../theme/colors'
import Icons from '../../../theme/icons'
import Review from '../../../components/Review'
import Button from '../../../components/layout/Button'
import studio1 from '../../../assets/images/studio1.jpg'
import Star from 'react-native-star-view';

function StudioDetails(props) {
  const [lat, setLat] = useState(props?.route?.params?.item?.location.lat)
  const [lng, setLng] = useState(props?.route?.params?.item?.location.lng)
  // console.log('props.............>>', JSON.stringify(props?.route?.params))
  const { item } = props.route.params
  console.log("itemmmmmm:::", JSON.stringify(item))

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent barStyle="dark-content" />
      <Content>
        <ScrollView>
          <Image
            // source={item.image}
            source={studio1}
            style={styles.studioImage}
          />
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              position: 'absolute',
              top: 40,
              left: 10,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: 'rgba(0,0,0,0.8)',
            }}
            onPress={() => props.navigation.goBack()}
          >
            {Icons.HeaderBackArrow({ tintColor: '#fff' })}
          </TouchableOpacity>
          <View style={styles.content}>
            <View style={styles.headingContainer}>
              <ResponsiveText style={styles.headingText}>
                {item.name}
              </ResponsiveText>
              <ResponsiveText style={styles.headingText1}>${item.ratePerDay}/day</ResponsiveText>
            </View>
            <ResponsiveText style={styles.addressStyle}>
              Complete day recording and all instruments
            </ResponsiveText>
            <View style={styles.lineBreak} />
            <TouchableOpacity onPress={() => { props.navigation.navigate('StudioMaps', { item, lat, lng }) }}>
              <Image
                source={require('../../../assets/images/map.png')}
                style={styles.mapImg}
              />
            </TouchableOpacity>

            <View style={[styles.headingContainer, { marginBottom: 10 }]}>
              <ResponsiveText style={{ ...styles.location, color: '#363636' }}>
                Location
              </ResponsiveText>
              <View style={{ width: wp('70'), alignItems: 'flex-end' }}>
                <ResponsiveText
                  style={{
                    ...styles.locationText,
                  }}
                >
                  {item.address}
                </ResponsiveText>
              </View>
            </View>
            <View style={styles.lineBreak} />
            <TouchableOpacity style={styles.groupDetails}
            // onPress={() => { props.navigation.navigate('Profile') }}
            >
              {Icons.PeopleGroup({ height: wp('7'), width: wp('7') })}
              <ResponsiveText style={styles.studioOwner}>
                Studio Owner: {item.owner.username}
              </ResponsiveText>
            </TouchableOpacity>
            <View style={styles.lineBreak} />
            <View style={[styles.headingContainer, { marginBottom: 5 }]}>
              <TouchableOpacity activeOpacity={0.5}>
                <ResponsiveText style={{ ...styles.addressStyle, color: '#000' }}>
                  Reviews
                </ResponsiveText>
              </TouchableOpacity>

              {item.reviews.length > 2 &&
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('Reviews', { userId: item.owner._id, totalRating: item?.reviews?.length })
                  }
                  activeOpacity={0.5}  >
                  <ResponsiveText style={{ ...styles.addressStyle, color: '#000' }}>
                    View All
                  </ResponsiveText>
                </TouchableOpacity>
              }
            </View>
            <View style={styles.reviewsContainer}>


              {item?.reviews[0]?.reviewer ?
                <View style={styles.containerR}>

                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      source={{
                        uri: item?.reviews[0]?.reviewer.imgUrl
                      }}
                      style={styles.imageR}
                    />
                    <View style={styles.textContainer}>
                      <ResponsiveText style={styles.usernameR}>{item?.reviews[0]?.reviewer.username}</ResponsiveText>
                      <ResponsiveText style={styles.reviewR}>
                        {item?.reviews[0]?.title}
                      </ResponsiveText>
                    </View>
                  </View>
                  <View style={{}}>
                    <Star score={item?.reviews[1].rating} style={styles.starStyle} />
                  </View>
                </View>

                :
                <View>
                  <ResponsiveText>No reviews</ResponsiveText>
                </View>
              }
              {item?.reviews[1]?.reviewer &&
                <View style={styles.containerR}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      source={{
                        uri: item?.reviews[1]?.reviewer.imgUrl
                      }}
                      style={styles.imageR}
                    />
                    <View style={styles.textContainer}>
                      <ResponsiveText style={styles.usernameR}>{item?.reviews[1]?.reviewer.username}</ResponsiveText>
                      <ResponsiveText style={styles.reviewR}>
                        {item?.reviews[1]?.title}
                      </ResponsiveText>
                    </View>
                  </View>

                  <View style={{}}>
                    <Star score={item?.reviews[1].rating} style={styles.starStyle} />
                  </View>

                </View>
              }





              {/* <Review onPress={() => { props.navigation.navigate('Reviews') }} />
              <Review onPress={() => { props.navigation.navigate('Reviews') }} /> */}
            </View>

            <View
              style={[
                styles.headingContainer,
                { marginVertical: 10, alignSelf: 'flex-end' },
              ]}
            >
              <Button
                title="Ask a Question"
                btnContainer={styles.ask}
                titleStyle={{ color: 'black', fontSize: 4.5 }}
                onPress={() => {
                  // console.log("props..", JSON.stringify(props.route.params.item._id))
                  props.navigation.navigate('AskQuestion', { studioId: props.route.params.item._id })
                }}
              />
              <Button
                title="Book now"
                btnContainer={[
                  styles.ask,
                  { marginLeft: 5, backgroundColor: Colors.Primary },
                ]}
                titleStyle={{ fontSize: 4.5 }}
                onPress={() => props.navigation.navigate('BookNow', { studioId: props.route.params.item._id, studioRate: item.ratePerDay })}
              />
            </View>
            {/* <Button
              title="AvailableBooking"
              btnContainer={[
                styles.ask,
                { marginLeft: 5, backgroundColor: Colors.Primary },
              ]}
              titleStyle={{ fontSize: 4.5 }}
              onPress={() => props.navigation.navigate('AvailableBooking', { studioId: props.route.params.item._id })}
            /> */}
          </View>
        </ScrollView>
      </Content>
    </View >
  )
}

const styles = StyleSheet.create({
  studioImage: {
    width: wp('100'),
    height: wp('80'),
  },
  content: {
    flex: 1,
    padding: 15,
    paddingBottom: 0,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingText: {
    width: '70%',
    fontWeight: 'bold',
    fontSize: 5,
    color: Colors.Primary,
  },
  headingText1: {
    width: '30%',
    fontWeight: 'bold',
    fontSize: 5,
    color: Colors.Primary,

  },
  locationText: {
    fontWeight: 'bold',
    // fontSize: wp('1.2'),
    color: '#363636',
  },
  location: {
    // fontSize: wp('1.2'),
    color: Colors.Primary,
  },
  addressStyle: {
    fontWeight: '300',
    // fontSize: wp('1.05'),
    color: '#bbb',
    marginVertical: 10,
  },
  lineBreak: {
    borderWidth: 0.5,
    borderColor: '#DDD',
  },
  mapImg: {
    height: wp('65'),
    width: wp('100') - 30,
    marginVertical: 10,
    resizeMode: 'cover',
  },
  groupDetails: {
    paddingTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  studioOwner: {
    marginLeft: 15,
    color: '#bbb',
    fontSize: 3.5,
  },
  reviewsContainer: {
    flex: 1,
  },
  ask: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: 'rgba(214,210,210,0.57)',
    opacity: 1,
    borderRadius: 15,
  },


  containerR: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 5,
    justifyContent: 'space-between'
  },
  imageR: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  textContainerR: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginVertical: 12,
  },
  usernameR: {
    color: '#bbb',
    fontWeight: 'bold',
    opacity: 0.7,
  },
  reviewR: {
    color: '#000',
    fontSize: 3,
    marginRight: 5,
    // width: '50%'
  },
  starsContainerR: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  starStyle: {
    width: 100,
    height: 20,
    marginBottom: 20,

  }
})

export default StudioDetails
