import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  Button,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  BackHandler,
  ToastAndroid,
  Alert,
  Text,
  YellowBox,
  Dimensions,
} from 'react-native'
import Share from 'react-native-share';
import Styled from 'styled-components'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Video from 'react-native-video'
import { TextInput } from 'react-native-gesture-handler'
import Container from '../../../components/layout/Container'
import Content from '../../../components/layout/Content'
import AppHeader from '../../../components/layout/AppHeader'
import StoryItem from '../../../components/StoryItem'
import Icons from '../../../theme/icons'
import ResponsiveText from '../../../components/layout/ResponsiveText'
import Colors from '../../../theme/colors'
import CommentDisplay from '../../../components/CommentDisplay'
import Search from '../../../assets/icons/search.png'
import Feed from '../../../components/Feed'
import { connect, useSelector } from 'react-redux';
import axios from "axios"
import API_URL from '../../../config/constants';
import VideoComponent from '../../../components/VideoComponent'
import moment from 'moment'
import ActivityLoader from '../../../components/ActivityLoader'
import { useFocusEffect } from "@react-navigation/native";
import GetLocation from 'react-native-get-location'
import Socket from '../../../sockets/Sockets'
import { EVENTS } from '../../../sockets/Constant'
import firestore from '@react-native-firebase/firestore';
import OneSignal from 'react-native-onesignal'
import FastTrackHome from './FastTrackHome'
import Peer from '../../../screens/Dashboard/Post/Peer';
import InViewPort from '../../../components/InViewPort'
import VideoPlayer from '../../../components/VideoPlayer';
import { set } from 'react-native-reanimated';


const filterTypes = ['Feed', 'Popular', 'Recommended', 'Nearby']
const WIDTH = Dimensions.get('window').width;

const AdvertiseHereText = Styled.Text`
    color: white;
    font-size: 25px;
    font-weight: bold
  `
function Home(props) {

  const { navigation } = props
  const startCount = ['', '', '', '', '']

  const childRef = useRef(null);
  const _carousel = useRef(null)

  const [locationFilterTypeIdx, setLocationFilterTypeIdx] = useState(0)
  const [videoLoadData, SetVideoLoadData] = useState({})
  const [comment, setComment] = useState('')
  const [commentFoucsed, setCommentFocused] = useState(false)
  const [userPostData, setUserPostData] = useState([])
  const [advertisement, setAdvertisement] = useState([])
  const [myStories, setMyStories] = useState([])
  const [refreshing, setRefreshing] = React.useState(false);
  const [noDataFound, setNoDataFound] = useState(false)
  const [forceRender, setForceRender] = useState(false)
  const [postLoading, setPostLoading] = useState(false)
  const [postLoading2, setPostLoading2] = useState(false)
  const [isSent, setisSent] = useState(true)
  const [forceUpdate, setForceUpdate] = useState(false)
  const [name, setName] = useState('');
  const [country, setCountry] = useState('New York');
  const [temp, settemp] = useState();
  const [activeUsers, setActiveUsers] = useState([])
  const [videoPaused, setVideoPaused] = useState(false)
  const [checkDataLoading, setCheckDataLoading] = useState(false)
  const [noMoreData, setNoMoreData] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [advertLoading, setAdvertLoading] = useState(false)
  // const [isPlaying, setIsPlaying] = useState(false)

  console.log("HOME")


  const _posts = useRef([])
  let _skip = useRef(0);
  let _player = useRef()
  const cellRefs = useRef(false)
  let currentCount = 0;

  useEffect(() => {
    getDeviceState()
    console.log('props______________________', props.token)
    console.log('props.userData._id____', props.userData._id)

    OneSignal.setNotificationOpenedHandler(openedEvent => {
      console.log("OneSignal: notification opened....................>", openedEvent);
      if (openedEvent.notification.additionalData.type === "LIKE") {
        console.log('going to notification screen')
        navigation.navigate('NotificationStack', { screen: 'PostNotification', params: { data: openedEvent.notification.additionalData.data.post } });
      } else if (openedEvent.notification.additionalData.type === "COMMENT") {
        console.log('error')
        navigation.navigate('NotificationStack', { screen: 'PostNotification', params: { data: openedEvent.notification.additionalData.data.post } });
      }
      const { action, notification } = openedEvent;
    });

    navigation.addListener(
      'blur', async () => {
        childRef?.current?.stopVideo()
      })

    navigation.addListener(
      'focus', async () => {
        // setVideoPaused(false)
      })


  }, [])


  const getDeviceState = async () => {
    const state = await OneSignal.getDeviceState()
    // console.log('deviceState.............................>', state.userId);
    postoneSignalId(state.userId)

  }
  const postoneSignalId = (deviceState) => {
    axios.post(`${API_URL}/user/set-oneSignal-Id`,
      {
        "one_signal": deviceState
      },
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => console.log(".......one signal posted.......")
      )
      .catch(error => {
        console.log('error', error)
      })


  }
  useFocusEffect(
    React.useCallback(() => {
      // console.log(props?.userData?._id)
      // setVideoPaused(false)
      Socket.myEstablishFunc(props?.userData?._id)
      Socket.socket.on(EVENTS.ESTABLISH_CONNECTION, data =>
        console.log('')
      )
      Socket.socket.on(EVENTS.LIKE, ({ post }) => {
        console.log("socket lke......>>>", post)
        // const index = _posts.current.findIndex(item => item._id == post._id)
        // if (index == -1) return;
        // const newPosts = [..._posts.current];
        // newPosts[index] = post;
        // _posts.current = newPosts;
        // setName(name + '   ')
      })

      Socket.socket.on(EVENTS.USERS, (data) => {
        setActiveUsers(Object.keys(data))
      })

      getUserLocation()
      getMyStories()
      getAdvertisement()
      getMyFeeds()


      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, [])
  );


  const likemypost = (id) => {
    // const __posts = [..._posts.current];
    // console.log(__posts.length);

    // const index = __posts.findIndex(({ _id }) => _id == id);
    // console.log(`index`, index)
    // __posts[index].liked = !__posts[index].liked
    // if (__posts[index].liked) {
    //   __posts[index].likesLength += 1
    //   __posts[index].likes.push({ "_id": props?.userData?._id, "imgUrl": props?.userData?.imgUrl })
    // }

    // else {
    //   __posts[index].likesLength -= 1

    //   __posts[index].likes = __posts[index].likes.filter((item) => item._id != props?.userData?._id)

    //   // __posts[index].likes.pull({"_id" :props?.userData?._id , "imgUrl": props?.userData?.imgUrl})

    // }
    // _posts.current = __posts;
    // // setName('jhhjhjhj ')
    // setForceRender(!forceRender)
    // Socket.postLike(props?.userData?._id, id)


    const __posts = [...userPostData];
    console.log(__posts.length);

    const index = __posts.findIndex(({ _id }) => _id == id);
    console.log(`index`, index)
    __posts[index].liked = !__posts[index].liked
    if (__posts[index].liked) {
      __posts[index].likesLength += 1
      __posts[index].likes.push({ "_id": props?.userData?._id, "imgUrl": props?.userData?.imgUrl })
    }

    else {
      __posts[index].likesLength -= 1

      __posts[index].likes = __posts[index].likes.filter((item) => item._id != props?.userData?._id)

      // __posts[index].likes.pull({"_id" :props?.userData?._id , "imgUrl": props?.userData?.imgUrl})

    }
    // _posts.current = __posts;
    setUserPostData(__posts)
    // setName('jhhjhjhj ')
    setForceRender(!forceRender)
    Socket.postLike(props?.userData?._id, id)








  }

  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        axios.get(`http://api.geonames.org/countryCodeJSON?lat=${location.latitude}&lng=${location.longitude}&username=demo123`).then(res => {
          console.log('>>>>>', res.data.countryCode)
          setCountry(res.data.countryName + " " + res.data.countryCode)
          axios.post(`${API_URL}/user/post-location`,
            {
              "location": {
                "lat": location.latitude,
                "lng": location.longitude,
                "name": res.data.countryCode,
                "country": res.data.countryName,
              }
            },
            {
              headers: { 'x-auth-token': props.token }
            })
        })
          .then(res => {
            console.log('location updated', res)
          })
      })
      .catch(error => {
        console.log('error', error)
      })
  }
  const getMyFeeds = () => {
    axios.get(`${API_URL}/post/feed?skip=${_skip.current}&limit=5`,
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => {
        // console.log(">>>>>>>>>>>>>>>>>>", JSON.stringify(res.data))
        setPostLoading(false)

        if (!res.data.length) {
          console.log('object')
        } else {

          setNoDataFound(false)

          if (_skip.current == 0) {
            // _posts.current = res.data

            setUserPostData(res.data)
            setPostLoading2(true)
          } else {
            setPostLoading2(true)
            const temp = _posts.current
            const newData = res.data
            // _posts.current = [..._posts.current, ...res.data]
            let _posts = [...userPostData, ...res.data]
            setUserPostData(_posts)
          }
          // console.log('_posts.current..........>', _posts.current)

        }
        setUserPostData(res.data)
      })
      .catch((err) => {
        console.log('ERROR:-_-_-_', err)
      });
  }
  const getMyStories = () => {
    axios.get(`${API_URL}/user/story`,
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => {
        setMyStories(res.data.stories)
        console.log('myStories____________', res.data.stories)
      })
      .catch((err) => {
        console.log('ERROR___ getMyStories__-_', err.res)
      });
  }
  const getAdvertisement = () => {

    setAdvertLoading(true)
    axios.get(`${API_URL}/advertisement`,
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => res.data)
      .then(res => {
        setAdvertisement(res.ad)
        setAdvertLoading(false)

        // console.log('advertisement====> 2323', res)
      })
      .catch((err) => {
        console.log('ERROR', err.res)
      });
  }
  const toggleLike = (idx) => {
    posts[idx].likes.liked = !posts[idx].likes.liked
    const likes = posts[idx].likes.liked
      ? parseInt(posts[idx].likes.total) + 1
      : parseInt(posts[idx].likes.total) - 1
    posts[idx].likes.total = likes.toString()
    setPosts([...posts])
  }
  const onVideoLoad = (e) => {
    SetVideoLoadData(e)
  }
  const onSend = () => {
    if (!comment.length) {
      return
    }
    const temp = commentsDS
    temp.push({
      username: 'Jack S.',
      text: comment,
    })
    setCommentsDS([...temp])
    setComment('')
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => {
      _skip.current = 0,
        setRefreshing(false)
      //
      _skip.current = 0
      _posts.current = []
      setUserPostData([])
      //
      getMyFeeds()
    }
    );
  }, []);
  const wait = (timeout) => {
    setMyStories([])
    getMyStories()
    getAdvertisement()
    getMyFeeds()
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onViewRef = React.useRef(({ viewableItems }, index) => {
    // console.log('viewableItems:::', viewableItems)
    console.log('Index:::', index)

    if (viewableItems && viewableItems.length > 0) {
      console.log('viewableItems____', viewableItems[0].index)
      settemp(viewableItems[0].index)
    }
  })
  const loadMoreFeeds = () => {
    Alert.alert("oooo")
    _skip.current = (_skip.current + 5)
    console.log('skip...............', _skip.current)
    getMyFeeds()
  }
  // const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  //   const paddingToBottom = 20;
  //   return layoutMeasurement.height + contentOffset.y >=
  //     contentSize.height - paddingToBottom;

  // };
  const backAction = () => {
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
  const onShare = async (id) => {

    await countShare(id)
    const shareOptions = {
      title: 'FAST',
      message: `https://www.fastappss.com/post/${id}`,
      failOnCancel: true
    }
    Share.open(shareOptions)
      .then((res) => {
        console.log("RESSS ", res);
      })
      .catch(async (err) => {
        await countShare(id)
      })
      .finally((a) => {
        console.log("Finally : ", a)
      })

  };
  const countShare = (id) => {
    console.log("***************share route called***************")
    axios.post(`${API_URL}/post/share`,
      {
        "user": props.userData._id,
        "post": id
      },
      {
        headers: { 'x-auth-token': props.token }
      }).then(res => {
        console.log('Share count ', res.data)
      })
      .catch(error => {
        console.log('error>>>>', error)
      })
  }

  const _onViewableItemsChanged = (props) => {
    // const changed = props.changed;
    console.log('propsssss from video', props)
    // changed.forEach((item) => {
    //   const cell = this.cellRefs[item.key];
    //   if (cell) {
    //     if (item.isViewable) {
    //       cell.play();
    //     } else {
    //       cell.pause();
    //     }
    //   }
    // });
  };
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  // const hanldeScroll = () => {
  // }




  return (
    <View style={{ flex: 1 }}>
      <AppHeader />
      <ScrollView
        onScrollBeginDrag={() => {
          childRef?.current?.stopVideo()

        }
        }
        contentContainerStyle={{ backgroundColor: '#EEEFF6' }}
        // onScroll={({ nativeEvent }) => {
        //   if (isCloseToBottom(nativeEvent)) {
        //     setPostLoading(true)
        //     if (postLoading2 == true) {
        //       loadMoreFeeds()
        //       setPostLoading2(false)
        //     }
        //   }
        // }}
        // scrollEventThrottle={0.001}
        // onScrollBeginDrag={
        //   console.log("90909099")
        // }
        onMomentumScrollEnd={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {

            try {
              if (!noMoreData) {
                if (!checkDataLoading) {
                  console.log("THIS IS PAGINATION !!!")
                  setCheckDataLoading(true)


                  _skip.current = (_skip.current + 5)

                  axios.get(`${API_URL}/post/feed?skip=${_skip.current}&limit=5`,
                    {
                      headers: { 'x-auth-token': props.token }
                    })
                    .then(res => {

                      if (!res.data.length) {
                        setNoMoreData(true)
                        // Alert.alert("kjkjk")
                      }

                      setCheckDataLoading(false)

                      console.log("RESPONSEEEE", res.data)

                      // _posts.current = [..._posts.current, ...res.data]
                      let _posts = [...userPostData, ...res.data]
                      setUserPostData(_posts)

                      // let posts = [...userPostData, ...res.data]
                      // setUserPostData(posts)


                    }).catch((errorMessage) => {
                      Alert.alert(errorMessage)
                    })




                }
              }
            }
            catch (e) {
              console.log("llo", e)
            }

          }

        }
        }

        scrollEventThrottle={0.01}
        // onScroll={
        //   Alert.alert("jkjkjk")
        // }


        refreshControl={
          < RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.subContent}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.storyContainer}
          >

            <TouchableOpacity
              style={{ height: 68, width: 68, backgroundColor: Colors.Primary, borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}
              //Peer
              onPress={() => { props.navigation.navigate('Peer') }}>
              <ResponsiveText style={{ color: 'white' }}>Go Live</ResponsiveText>
            </TouchableOpacity>

            <StoryItem
              border={false}
              // uri="https://picsum.photos/id/1/200/300"
              uri={props?.userData?.imgUrl}
              onPress={() => navigation.navigate('CreateStory')}
            />

            <FlatList
              data={myStories}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.id + index}
              // numColumns={3}
              horizontal={true}
              // onScrollBeginDrag={console.log("SCROLL BEGINN")}
              // onScroll={console.log("SCROLLL")}

              renderItem={({ item, index }) => {
                return (
                  <View>
                    {item?.thumbnail &&
                      <View style={{ backgroundColor: 'rgba(0,0,0,.3)', height: 68, width: 68, borderRadius: 40, marginRight: 8, }}>
                        <TouchableOpacity
                          onPress={() => {
                            // console.log(item)
                            item.type == "live" ?
                              navigation.navigate('StreamViewer', { liveData: item }) :
                              navigation.navigate('StoryView', { storyData: myStories, selectedindex: index })
                          }
                          }
                          key={index}>
                          <Image
                            style={[styles.storyCircle, { borderColor: item.type == "live" && 'blue' }]}
                            source={{ uri: item.type == "live" ? item._user.imgUrl : item?.thumbnail }}
                          />
                          {/* <VideoComponent filePath={item.url}
                          hello={styles.storyCircle} /> */}
                        </TouchableOpacity>
                      </View>}
                  </View>
                )
              }}
            />
          </ScrollView>

          {/* <View>

            <Carousel
              // ref={(c) => { _carousel = c }}
              data={advertisement}
              sliderWidth={400}
              itemWidth={400}
              // slideStyle={{ width: 100 }}
              renderItem={({ item, index }) => {
                <Image
                  source={{ uri: 'https://www.ipr.edu/wp-content/uploads/2020/02/music-studio-768x432.jpg' }}
                />
                // <Text>{item.comments}</Text>
              }}

            />


          </View> */}

          {/* 
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.advertisementContainer}
            onPress={() => navigation.navigate('AdvertisementInquiry')}
          > */}

          <View
            style={styles.advertisementContainer}
          >

            {advertLoading ?
              <ActivityIndicator size='small' color='#000' />
              :
              <Carousel
                ref={_carousel}
                data={advertisement}
                // slideStyle={{ width: 100 }}
                sliderWidth={WIDTH}
                itemWidth={WIDTH}
                onSnapToItem={(index) => {
                  setActiveSlide(index)
                }}
                renderItem={({ item, index }) => {
                  // console.log("KLKLKLKL", item)
                  return (
                    <TouchableOpacity key={index} onPress={() => navigation.navigate('AdvertisementInquiry')}
                      style={{
                        height: '90%',
                      }}>
                      <Image
                        style={{ flex: 1 }}
                        resizeMode='contain'
                        // source={{ uri: item?.bannerImg ? item?.bannerImg : 'https://www.ipr.edu/wp-content/uploads/2020/02/music-studio-768x432.jpg' }}
                        source={{ uri: 'https://www.ipr.edu/wp-content/uploads/2020/02/music-studio-768x432.jpg' }}
                      />
                    </TouchableOpacity>
                  )
                }}

              />
            }

            {/* <Pagination
              dotsLength={advertisement.length}
              activeDotIndex={activeSlide}
              containerStyle={{ position: 'absolute', alignSelf: 'center', bottom: -15 }}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                // marginHorizontal: 8,
                opacity: 0.4
              }}
              inactiveDotColor="#cacaca"
              dotColor={'red'}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              carouselRef={_carousel}
            /> */}

          </View>




          {/* 
            <ImageBackground
              // :TODO: enable advertisement?.ad?.bannerImg
              // source={{ uri: advertisement?.ad?.bannerImg ? advertisement?.ad?.bannerImg : 'https://www.ipr.edu/wp-content/uploads/2020/02/music-studio-768x432.jpg' }}
              source={{ uri: 'https://www.ipr.edu/wp-content/uploads/2020/02/music-studio-768x432.jpg' }}
              style={styles.advertiseImg}
            >
              <View style={styles.advertiseOverlay}>
                <ResponsiveText style={styles.adverts}>{advertisement?.ad?.comments}</ResponsiveText>
              </View>
            </ImageBackground> */}
          {/* </TouchableOpacity> */}



          {props?.userData?._type === "Artist" || props?.userData?._type === "Singer" ?
            null
            :

            <View style={styles.locatedStudioContainer}>
              <ImageBackground
                source={require('../../../assets/images/Rectangle.png')}
                style={styles.locatedStudioImg}
              >
                <View style={styles.locatedStudioOverlay}>
                  <TouchableOpacity
                    style={styles.searchStudio}
                    onPress={() => navigation.navigate('Studios')}
                    activeOpacity={0.9}
                  >
                    <View>
                      <ResponsiveText style={{ color: '#BBB', fontSize: wp(0.8) }}>
                        Discover recording studios or songwriters
                      </ResponsiveText>

                    </View>
                    <Image style={{ width: 18, height: 18, tintColor: 'grey' }} source={Search} />

                  </TouchableOpacity>
                  <ResponsiveText style={{ ...styles.subHeading, marginTop: 20, fontSize: 3.5 }}>
                    Studio Location
                  </ResponsiveText>
                  <ResponsiveText style={styles.adverts}>{country}</ResponsiveText>
                </View>
              </ImageBackground>
            </View>}

          <View style={{ alignItems: 'center', }}>
            <ScrollView contentContainerStyle={styles.filterContainer} horizontal showsHorizontalScrollIndicator={false}>

              {filterTypes.map((item, idx) => {
                return (
                  <View style={{}}>
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setLocationFilterTypeIdx(idx)}
                      style={[
                        styles.filterItem,
                        idx === locationFilterTypeIdx
                          ? styles.filterTypeActive
                          : null]}>
                      <ResponsiveText
                        style={[
                          styles.filterText,
                          idx === locationFilterTypeIdx ? { color: '#FFF' } : null,
                        ]}>{item}
                      </ResponsiveText>
                    </TouchableOpacity>
                  </View>

                )
              })}
            </ScrollView>
          </View>

          {props?.userData?._type === "Artist" || props?.userData?._type === "Singer" ?
            <FastTrackHome />
            :
            <View style={{ flex: 1 }}>
              {noDataFound ?
                <View style={{ alignItems: 'center' }}>
                  <ResponsiveText>No data</ResponsiveText>
                </View>
                : !userPostData.length ? <ActivityLoader /> :
                  <FlatList
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={2}
                    // onViewableItemsChanged={_onViewableItemsChanged}
                    // viewabilityConfig={viewabilityConfig}

                    data={userPostData}


                    // onViewableItemsChanged={onViewRef.current}
                    // viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
                    keyExtractor={(item, index) => item._id + index}
                    renderItem={({ item, index }) => {
                      return (
                        <View key={item.id + index} style={{
                          marginVertical: 8,
                          // backgroundColor: 'red',
                          // height: 400

                        }}>
                          <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                              activeOpacity={1}
                              // :TODO: LIVE
                              // onPress={() => navigation.navigate('LiveVideo')}
                              onPress={() => navigation.navigate('DemoLive')}
                              style={[styles.userInfoContainer, { maxWidth: '45%', height: 80 }]}
                            >
                              <StoryItem
                                containerSize={60}
                                border
                                borderPurple
                                uri={item?.by?.imgUrl}
                              />
                              <View style={styles.userInfoBody}>
                                <View style={styles.userTextualInfoContainer}>
                                  <ResponsiveText style={styles.username}>
                                    {item?.by?.username}

                                  </ResponsiveText>
                                  <ResponsiveText style={styles.userSkill}>
                                    {item?.by?._type}
                                  </ResponsiveText>
                                </View>
                              </View>
                            </TouchableOpacity>

                            {item?.by?.hasStudio &&
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate('Reviews', { userId: item.by._id, totalRating: item?.by?.reviews?.length })
                                }}
                                style={styles.ratingContainer}
                              >
                                {startCount.map((star, idx) => {
                                  return (
                                    <View key={idx}>
                                      {idx <= item?.by?.rating - 1
                                        ? Icons.RatingStar({
                                          tintColor: '#FFC107',
                                          marginRight: 2,
                                        })
                                        : Icons.RatingStar({
                                          tintColor: '#CCCCCC',
                                          marginRight: 2,
                                        })}
                                    </View>
                                  )
                                })}
                                <ResponsiveText style={styles.ratingInstances}>
                                  (
                                  {item?.by?.reviews?.length}
                                  )
                                </ResponsiveText>
                              </TouchableOpacity>

                            }
                          </TouchableOpacity>

                          <View style={styles.postPayload}>
                            {/* <InViewPort onChange={handlePlaying}> */}

                            <View style={styles.videoContainer}>
                              {/* <InViewPort onChange={handlePlaying}> */}

                              {/* <View style={{
                                  flex: 1,
                                  // backgroundColor: 'red'
                                }}> */}

                              {/* <Video
                                // ref={(ref) => {
                                //     _player.current = ref;
                                // }}
                                paused={true}
                                source={{ uri: item.fileUrl }}
                                // source={require('../../../assets/images/file_example_MP4_640_3MG.mp4')}
                                poster={item.thumbnail}
                                // onProgress={({ currentTime }) => console.log(currentTime)}
                                onBuffer={() => { console.log('onBuffer') }}
                                onError={() => { console.log('error') }}
                                // onLoad={(e) => onVideoLoad(e)}
                                resizeMode="contain"
                                posterResizeMode="cover"
                                repeat
                                style={styles.backgroundVideo}
                              /> */}

                              <VideoPlayer
                                item={item}
                                ref={childRef}
                              // videoPaused={videoPaused}

                              // check={(setIsPlaying) => {
                              //   videoPaused ? setIsPlaying(false) : setIsPlaying(true)
                              // }}
                              // check={() => {
                              //   videoPaused ? setVideoPaused(false) : setVideoPaused(true)
                              // }}
                              // setVideoPaused={setVideoPaused}
                              ></VideoPlayer>
                              {/* </View> */}

                              {/* </InViewPort> */}

                              <View style={styles.durationContainer}>
                                <ResponsiveText style={styles.videoDuration}>
                                  00: 00
                                </ResponsiveText>
                                <ResponsiveText style={styles.videoDuration}>
                                  00: 30
                                </ResponsiveText>
                              </View>
                              {item?.by?.hasStudio &&

                                <View
                                  style={[styles.studioStatus, item?.by?.available ? { borderColor: '#0099A2' } : { borderColor: 'red' }]}
                                >


                                  {item?.by?.available ? (
                                    <TouchableOpacity

                                      onPress={() => {
                                        console.log(index)
                                        // props?.userData?._type === "Artist" && props?.userData?._type === "Singer" & navigation.navigate('OfferCard')
                                      }

                                      }
                                    >
                                      <ResponsiveText style={styles.itemStatusText}>Available</ResponsiveText>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                    // onPress={() => navigation.navigate('JobCard')}
                                    >
                                      <ResponsiveText style={styles.itemStatusText}>Booked</ResponsiveText>
                                    </TouchableOpacity>
                                  )}




                                </View>
                              }

                              {/* <View style={[styles.studioStatus, { borderColor: '#0099A2' }]}  >
                            <TouchableOpacity onPress={() => navigation.navigate('OfferCard')}>
                              <ResponsiveText style={styles.itemStatusText}>Available</ResponsiveText>
                            </TouchableOpacity> 
                          </View> */}
                            </View>

                            {/* </InViewPort> */}

                          </View>

                          <View style={styles.postFeatureContainer}>

                            {/* This is the code that is causing the issue! */}
                            {/*Post Action Container Code is Causing Peformance Problem at Home screen */}


                            <View style={styles.postActionsContainer}>

                              <TouchableOpacity
                                onPress={() => {
                                  likemypost(item._id)
                                }}
                              >
                                {item.liked ? Icons.RedHeart(styles.postActionIcon) : Icons.Like(styles.postActionIcon)}
                              </TouchableOpacity>


                              <TouchableOpacity

                                onPress={() => navigation.navigate('comments', { post_id: item._id, thumb: item.thumbnail })}
                                style={{ marginHorizontal: 10 }}
                              >
                                {Icons.Comment(styles.postActionIcon)}
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => onShare(item._id)}
                              >

                                {Icons.Share({
                                  ...styles.postActionIcon,
                                  width: 35, tintColor: '#000'
                                })}
                                {/* <Text>Share</Text> */}
                                {/* {Icons.Share(styles.postActionIcon , )} */}
                              </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                              style={styles.likesContainer}
                              activeOpacity={0.9}
                              onPress={() => navigation.navigate('LikedBy', { post_id: item._id })}
                            >
                              <Image
                                source={{ uri: item?.likes[0]?.imgUrl }}
                                style={[styles.likedByDP, { marginRight: -12.5 }]}
                              />
                              <Image
                                source={{ uri: item?.likes[1]?.imgUrl }}
                                style={styles.likedByDP}
                              />
                              <ResponsiveText style={styles.likeCounts}>
                                {item?.likesLength}
                                {' '}
                                likes
                              </ResponsiveText>
                            </TouchableOpacity>
                            <View style={styles.shareContainer}>




                              {activeUsers.find(x => x == item.by._id) ?
                                <View style={styles.greenCircle} />
                                :
                                <View style={[styles.greenCircle, { backgroundColor: 'grey' }]} />
                              }




                              <ResponsiveText style={styles.likeCounts}>
                                {item?.sharesLength}
                                {' '}
                                shares
                              </ResponsiveText>
                            </View>
                          </View>



























                          {/* Comments Container */}
                          <View style={styles.commentsContainer}>

                            {item?.comments[0] ?
                              <ResponsiveText style={styles.commentBy}>
                                <TouchableOpacity onPress={() => { navigation.navigate('Profile') }}>
                                  <ResponsiveText style={{ fontWeight: 'bold', marginBottom: -5 }}>
                                    {item?.comments[0]?.commentBy?.username}
                                  </ResponsiveText>
                                </TouchableOpacity>

                                <ResponsiveText
                                  style={{ ...styles.comment, color: '#013569' }}
                                >
                                  {' '}{item?.comments[0]?.commentText}
                                </ResponsiveText>
                              </ResponsiveText>

                              : null}

                            <View style={styles.postedTimeContainer}>
                              <ResponsiveText style={styles.hourAgo}>
                                {moment(item.createdAt).endOf('day').fromNow()}

                              </ResponsiveText>


                              {item?.comments?.length >= 1 ?
                                <TouchableOpacity onPress={() => navigation.navigate('comments', { post_id: item._id })}>
                                  <ResponsiveText style={styles.hourAgo}>
                                    View all {item?.comments?.length} comments
                                  </ResponsiveText>
                                </TouchableOpacity>
                                :
                                <ResponsiveText style={styles.hourAgo}>
                                  No comments
                                </ResponsiveText>
                              }

                            </View>

                            <TouchableOpacity
                              style={{ flexDirection: 'row', marginVertical: 5 }}
                              onPress={() => navigation.navigate('comments', { post_id: item._id })}
                              activeOpacity={0.8}
                            >
                              <Image
                                source={{ uri: props?.userData?.imgUrl }}
                                style={{
                                  height: 40, width: 40, borderRadius: 20, marginRight: 10,
                                }}
                              />
                              <View style={{
                                height: 30,
                                marginTop: 5,
                              }}
                              >
                                <ResponsiveText style={{ color: '#817f7f' }}>Add new Comment...</ResponsiveText>
                              </View>

                            </TouchableOpacity>
                          </View>
                        </View>

                      )
                    }}
                  />
              }
            </View>
          }


          {/* FlatList ends */}

          {checkDataLoading &&
            <View>
              <ActivityIndicator size="small" color="#0099A2" />
            </View>
          }






        </View>
      </ScrollView >
    </View >
  )
}


const styles = StyleSheet.create({
  content: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#F2F3FA',
  },
  subContent: {
    flex: 1,
    paddingBottom: 10,
  },
  storyContainer: {
    flexDirection: 'row',
    maxHeight: wp('30'),
    padding: 5,
    paddingVertical: 15,
  },
  advertisementContainer: {
    width: wp('100'),
    height: wp('60'),
    justifyContent: 'center',
    alignItems: 'center',
    // marginVertical: 8,
    // backgroundColor : 'red'
  },
  advertiseImg: {
    width: wp('100'),
    height: wp('60'),
    resizeMode: 'contain',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 3,
  },
  advertiseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locatedStudioContainer: {
    width: wp('100'),
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
  },
  locatedStudioImg: {
    width: wp('100'),
    height: wp('60'),
    resizeMode: 'contain',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 5,
  },
  locatedStudioOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    alignItems: 'center',
    paddingTop: hp(5),
  },
  searchStudio: {
    width: wp('95%'),
    height: wp('15'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    paddingRight: 20,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
  },
  searchIconContainer: {
    alignItems: 'center',
    left: 0,
    right: 8,
    width: 30,
  },
  subHeading: {
    color: '#FFF',
    // fontSize: wp('1.2'),
    marginVertical: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    // width: wp(100),
    height: 45,
    elevation: 2,
    marginVertical: 10,

    // marginLeft: wp(5),
    marginRight: wp(5)
    // padding: wp(35)

  },
  filterItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(30),

  },
  filterText: {
    color: Colors.Primary,
    fontSize: 3,
    // width: wp(30),
    textAlign: 'center',


  },
  filterTypeActive: {
    backgroundColor: Colors.Primary,
    // backgroundColor: 'red',
    borderRadius: 10,

  },
  postContainer: {},
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  userInfoBody: {
    // flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },
  userTextualInfoContainer: {
    // paddingVertical: 10,
    // justifyContent: 'space-between',
  },
  username: {
    color: '#000',
    fontWeight: 'bold',
    // fontSize: wp('1.4'),
  },
  userSkill: {
    color: '#000',
    fontSize: 3.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingInstances: {
    fontWeight: 'bold',
    marginLeft: 3,
  },
  postPayload: {
    flex: 1,
    backgroundColor: '#E4E4E4',
    // backgroundColor: 'green'
  },
  videoContainer: {
    position: 'relative',
    width: wp('100'),
    height: wp('70'),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: 'transparent',
    // backgroundColor: 'red'
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('100'),
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 5,
    zIndex: 9999,
  },
  videoDuration: {
    color: '#FFF',
    fontSize: 3,
  },
  postFeatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  postActionsContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
  },
  postActionIcon: {
    height: 25,
    width: 25,
  },
  likesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  likedByDP: {
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  likeCounts: {
    fontSize: 3,
    fontWeight: 'bold',
    marginLeft: 7,
  },
  shareContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 3,

  },
  greenCircle: {
    backgroundColor: '#0099A2',
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  commentsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 5,
    paddingHorizontal: 15,
  },
  commentBy: {
    fontWeight: 'bold',
    marginVertical: 3,
  },
  comment: {
    fontSize: 3.5,
    fontWeight: '300',
    alignItems: 'center',
  },
  postedTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hourAgo: {
    fontWeight: '200',
    color: '#BBB',
    fontSize: 3.5,
    marginVertical: 5,
  },
  studioStatus: {
    paddingHorizontal: wp(5),
    paddingVertical: wp(1),
    position: 'absolute',
    right: 10,
    top: 15,
    borderWidth: 1,
    borderRadius: 5,
  },
  itemStatusText: {
    color: '#FFF',
  },
  storyCircle: {
    height: 68, width: 68, borderRadius: 40, marginRight: 8, borderWidth: 2, borderColor: '#0099A1', overflow: 'hidden'
  },
  adverts: {
    color: 'white',
    // font-size: 25px;
    fontWeight: 'bold',
    fontSize: wp(1.5)
  }
})



function mapStateToProps(state) {
  return {

    token: state.auth.token,
    userData: state.auth.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

