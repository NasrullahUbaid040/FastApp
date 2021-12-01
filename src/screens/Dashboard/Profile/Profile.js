import React, { useState, useRef } from 'react'
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  RefreshControl,
  Alert
} from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { BoxShadow } from 'react-native-shadow'
import ResponsiveText from '../../../components/layout/ResponsiveText'
import Container from '../../../components/layout/Container'
import Content from '../../../components/layout/Content'
import AppHeader from '../../../components/layout/AppHeader'
import Icons from '../../../theme/icons'
import Colors from '../../../theme/colors'
import axios from "axios"
import VideoComponent from '../../../components/VideoComponent'
import ActivityLoader from '../../../components/ActivityLoader'
import Star from 'react-native-star-view';
import { updateFollower, updateData } from '../../../redux/actions/authActions'

import { useFocusEffect } from "@react-navigation/native";
import { connect } from 'react-redux';
import API_URL from '../../../config/constants';
import Socket from '../../../sockets/Sockets'
import { EVENTS } from '../../../sockets/Constant'


function Profile(props) {
  const filterTypes = [props?.userData?._type ? "My Studio" : 'My Videos', 'Tags']

  console.log(".....> .....> ....>", JSON.stringify(props?.userData?._type))
  console.log(".....> USER DATAA", JSON.stringify(props?.userData?.available))

  const { params } = props?.route


  const [refreshing, setRefreshing] = React.useState(false);

  const [data, setData] = useState({})
  const [userPostData, setUserPostData] = useState([])
  const [noDataFound, setNoDataFound] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [studioStatus, setStudioStatus] = useState(props?.userData?.available ? true : false)
  const videRef = useRef(null)
  const [locationFilterTypeIdx, setLocationFilterTypeIdx] = useState(0)
  let _skip = useRef(0);
  const _posts = useRef([])

  useFocusEffect(
    React.useCallback(() => {
      Socket.socket.on(EVENTS.FOLLOW, data => {
        console.log('data>>>>>>>>>>>>>>', data)
        // props.UdpdateFollower(data.user)
      })

      console.log('params?.likedUserData >>>>>>>>>>>>>>>', params?.likedUserData._id)
      setShowLoader(true)
      console.log('props.userData._______', props?.userData._type)
      // console.log('params.likedUserData._id_____', params?.likedUserData?._id)
      // console.log("INCLUDES", props?.userData?.followings.includes(params?.likedUserData?._id))


      _posts.current = []
      if (params?.likedUserData) {
        console.log('likedUserData___ called')
        getUserData(params.likedUserData._id)
        getMyVideos(params.likedUserData._id)
      } else {
        getUserData(props?.userData._id)
        getMyVideos(props?.userData._id)
      }
    }, [])
  );


  const markStudioAvailable = (_id, check) => {
    var data = JSON.stringify({
      "user_id": _id,
      "available": check
    });

    var config = {
      method: 'post',
      url: `${API_URL}/user/mark-available`,
      headers: {
        'x-auth-token': props.token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log("RES", response.data)
        setStudioStatus(response?.data?.user?.available)
      })
      .catch(function (error) {
        console.log(error);
      });
  }



  const getMyVideos = (_id) => {
    axios.post(`${API_URL}/post/my-posts?skip=${_skip.current}&limit=12`, { _id }, {
      headers: { 'x-auth-token': props.token }
    })
      .then(res => {
        if (!res.data.data.posts.length) {
          if (!userPostData.length) {
            // setNoDataFound(true)
            console.log('object')
          }
        } else {


          setUserPostData(res.data.data.posts)
          _posts.current = [..._posts.current, ...res.data.data.posts]
          setUserPostData(_posts.current)
          // console.log(`userPostData............`, userPostData[0]?.thumbnail)



        }

      })
      .catch((err) => {
        console.log('ERROR____', err)
      });
  }

  const getUserData = (_id) => {
    axios.post(`${API_URL}/user/profile`, { _id }, {
      headers: { 'x-auth-token': props.token }
    })
      .then(res => {
        setShowLoader(false)
        setUserInfo(res.data.user)
        // console.log('res.data.user>>>>>', res)
      })
      .catch((err) => {
        console.log('ERROR_-_-_', err)
      });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);


    wait(500).then(() => setRefreshing(false));
  }, []);

  const wait = (timeout) => {
    setUserPostData([])
    _posts.current = []
    _skip.current = 0
    setUserPostData(_posts.current)

    if (params?.likedUserData) {
      console.log('likedUserData___ called')
      getUserData(params.likedUserData._id)
      getMyVideos(params.likedUserData._id)
    } else {
      getUserData(props?.userData?._id)
      getMyVideos(props?.userData?._id)
    }

    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

  };
  const shadowOpt = {
    width: wp(85),
    height: wp(30),
    color: '#F0F0F0',
    border: 10,
    radius: 5,
    opacity: 0.7,
    x: 1,
    y: 1,
    style: { flex: 1 },
  }
  const loadMoreFeeds = () => {
    console.log('i am called')
    _skip.current = (_skip.current + 12)
    console.log('skip...............', _skip.current)
    if (params?.likedUserData) {
      console.log('likedUserData___ called')
      getUserData(params.likedUserData._id)
      getMyVideos(params.likedUserData._id)
    } else {
      getUserData(props?.userData?._id)
      getMyVideos(props?.userData?._id)
    }
  }
  const followUser = (dispatch) => {
    console.log("_____followUser______")
    Socket.followUser(props?.userData?._id, params.likedUserData._id)

    axios.post(`${API_URL}/user/follow`,
      { user: params.likedUserData._id },
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => res.data)
      .then(res => {
        console.log(res.data)
        props.UdpdateFollower(res.data)

        Alert.alert(res.message)
      })
      .catch((err) => {
        console.log('ERROR_-_-_', err)
      });
  }
  const unfollowUser = () => {
    console.log("unfollowUser")

    axios.post(`${API_URL}/user/un-follow`,
      { user: params.likedUserData._id },
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => res.data)
      .then(res => {
        props.UdpdateFollower(res.data)

        console.log('res.....', res.message)
        Alert.alert(res.message

        )
      })
      .catch((err) => {
        console.log('ERROR_-_-_', err)
      });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#EEEFF6' }}>
      {!params?.likedUserData?._id ?
        <AppHeader
          rightIcon={() => (
            <Image
              source={require('../../../assets/icons/gear(1).png')}
              style={{ width: wp('7'), resizeMode: 'contain', tintColor: '#FFF' }}
            />
          )}
          onRightPress={() => props.navigation.navigate('Settings')}
        />
        : <AppHeader />}


      <ScrollView
        contentContainerStyle={{ backgroundColor: '#EEEFF6' }}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            console.log('Ooo yes....')
            loadMoreFeeds()
          }
        }}
        scrollEventThrottle={0.001}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
          // onRefresh={onRefresh}
          />
        }
      >

        {userInfo ?
          <View>

            <View style={styles.informationContainer}>

              <View style={styles.profileContainer}>

                {!params?.likedUserData?._id && props?.userData?._type == "STUDIO" || props?.userData?._type == "Artist" ?


                  <>


                    {studioStatus === true ?
                      <TouchableOpacity
                        onPress={() => {
                          markStudioAvailable(props?.userData?._id, false)
                        }
                          // props.checkID ? props.navigation.navigate('MyStudio') : props.navigation.navigate('MySongwriter')
                        }
                        style={{
                          position: 'absolute',
                          top: 8,
                          zIndex: 100,
                          left: 10,
                          borderWidth: 1,
                          borderColor: Colors.Primary,
                          borderRadius: 5,
                        }}
                      >
                        <ResponsiveText style={{
                          fontSize: 2.5, paddingVertical: 6, paddingHorizontal: 10,
                          color: Colors.Primary
                        }} >
                          Available
                          {/* {props?.userData?._type == "STUDIO" ? 'My Studio' : 'My Songwriter'} */}
                        </ResponsiveText>
                      </TouchableOpacity>


                      :

                      <TouchableOpacity
                        onPress={() => {
                          markStudioAvailable(props?.userData?._id, true)
                        }
                        }
                        style={{
                          position: 'absolute',
                          top: 8,
                          zIndex: 100,
                          left: 10,
                          borderWidth: 1,
                          borderColor: Colors.Primary,
                          borderRadius: 5,
                        }}
                      >
                        <ResponsiveText style={{
                          fontSize: 2.5, paddingVertical: 6, paddingHorizontal: 10,
                          color: 'red',
                        }} >
                          Booked
                          {/* {props?.userData?._type == "STUDIO" ? 'My Studio' : 'My Songwriter'} */}
                        </ResponsiveText>
                      </TouchableOpacity>



                    }
                  </>


                  : null}

                {!params?.likedUserData?._id && props?.userData?._type == "STUDIO" || props?.userData?._type == "Artist" ?
                  // {params?.likedUserData?._id.length && props?.userData.type === "STUDIO" ? 
                  <TouchableOpacity
                    onPress={() => {
                      props.checkID ? props.navigation.navigate('MyStudio') : props.navigation.navigate('MySongwriter')
                    }}
                    style={{
                      position: 'absolute',
                      top: 8,
                      zIndex: 100,
                      right: 10,
                      borderWidth: 1,
                      borderColor: Colors.Primary,
                      borderRadius: 5,
                    }}
                  >
                    <ResponsiveText style={{
                      fontSize: 2.5, paddingVertical: 6, paddingHorizontal: 10, color: Colors.Primary,
                    }} >
                      {props?.userData?._type}
                      {/* {props?.userData?._type == "STUDIO" ? 'My Studio' : 'My Songwriter'} */}
                    </ResponsiveText>
                  </TouchableOpacity>
                  : null}


                <View style={styles.dpContainer}>
                  <TouchableOpacity onPress={() => props.navigation.navigate('MyStories')}>

                    <Image
                      style={styles.profileImage}
                      source={{ uri: userInfo?.imgUrl }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.usernameContainer}>
                  <ResponsiveText style={styles.username}>
                    {userInfo?.username}
                  </ResponsiveText>

                  {userInfo?.isVerified &&
                    Icons.Verified()}

                </View>
                <ResponsiveText style={{ color: '#77869E', marginBottom: 15 }}>
                  {userInfo?.email}
                </ResponsiveText>

                {props?.userData?._type === "Artist" || props?.userData?._type === "Singer" ?
                  <TouchableOpacity
                    disabled={true}
                    style={styles.starImageView}
                  >

                    <Star score={Math.round(userInfo.rating)} style={styles.starStyle} />


                    <ResponsiveText style={{ fontSize: 2.5, fontWeight: 'bold', marginLeft: 5 }}>({userInfo?.reviews?.length})</ResponsiveText>
                  </TouchableOpacity>
                  : null
                }

                {params?.likedUserData?._id?.length && params?.likedUserData?._id != props.userData._id ?
                  <TouchableOpacity
                    style={{ backgroundColor: 'lightblue', padding: 5, borderRadius: 5 }}
                    // onPress={() => { followUser() }}  >
                    onPress={() => { props?.userData?.followings.includes(params?.likedUserData?._id) ? unfollowUser() : followUser() }}   >
                    <ResponsiveText>{props?.userData?.followings.includes(params?.likedUserData?._id) ? "UNFOLLOW" : "FOLLOW"}</ResponsiveText>
                  </TouchableOpacity>
                  : null}

                <View style={{ flex: 1, }}>
                  <BoxShadow setting={shadowOpt}>
                    <View style={styles.descriptionContainer}>
                      <View style={{
                        flex: 1,
                        flexDirection: 'row', borderBottomWidth: 1, borderColor: 'lightgrey', paddingBottom: 10, alignItems: 'center'
                      }}
                      >
                        <View style={{
                          flex: 1,
                          alignItems: 'center',
                          borderRightWidth: 1,
                          borderColor: 'lightgrey',
                        }} >
                          <ResponsiveText style={{ fontWeight: 'bold' }}>{userInfo?.followers}</ResponsiveText>
                          <ResponsiveText style={{ fontSize: 3.2, paddingTop: 5 }}>Followers</ResponsiveText>
                        </View>
                        <View style={{
                          flex: 1,
                          alignItems: 'center',
                          borderRightWidth: 1,
                          borderColor: 'lightgrey',
                        }}
                        >
                          <ResponsiveText style={{ fontWeight: 'bold' }}>{userInfo?.followings?.length}</ResponsiveText>

                          <ResponsiveText style={{ fontSize: 3.2, paddingTop: 5 }}>Following</ResponsiveText>
                        </View>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                          <ResponsiveText style={{ fontWeight: 'bold' }}>{userInfo.posts}</ResponsiveText>

                          <ResponsiveText style={{ fontSize: 3.2, paddingTop: 5 }}>Posts</ResponsiveText>
                        </View>
                      </View>
                      <View style={{ marginBottom: 10 }}>
                        <ResponsiveText style={{ color: '#77869E', fontSize: 3.2, paddingTop: 8 }}>
                          {userInfo.bio}
                        </ResponsiveText>
                      </View>
                    </View>

                  </BoxShadow>
                </View>
              </View>

            </View>

            <View style={styles.filterContainer}>
              {filterTypes.map((item, idx) => {
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setLocationFilterTypeIdx(idx)}
                    style={[
                      styles.filterItem,
                      idx === locationFilterTypeIdx
                        ? styles.filterTypeActive
                        : null,
                    ]}
                  >
                    <ResponsiveText
                      style={[
                        styles.filterText,
                        idx === locationFilterTypeIdx ? { color: '#FFF' } : null,
                      ]}
                    >
                      {item}
                    </ResponsiveText>
                  </TouchableOpacity>
                )
              })}
            </View>





            {
              showLoader ? <ActivityLoader /> :
                !userPostData.length ?
                  <View style={{ alignItems: 'center', }}>
                    <ResponsiveText>No Posts</ResponsiveText>
                  </View>
                  :
                  // !userPostData.length ? <ActivityLoader /> :

                  <FlatList
                    data={userPostData}
                    keyExtractor={item => item._id}
                    // ListEmptyComponent={() => {
                    //   <View style={{ alignItems: 'center', flex: 1, height: '100%', backgroundColor: 'red' }}>
                    //     <ResponsiveText>No Posts</ResponsiveText>
                    //   </View>
                    // }}
                    numColumns={3}
                    renderItem={({ item }) => {
                      return (
                        <View style={{ height: '100%', }} >
                          <TouchableOpacity
                            onPress={() => props.navigation.navigate('PostNotification', { data: item._id })} activeOpacity={0.9}
                          >
                            <Image
                              source={{ uri: item.thumbnail }}
                              style={styles.imgVideo}
                            />
                          </TouchableOpacity>

                          {/* <ImageBackground
                          source={require('../../../assets/icons/loader.gif')}
                          // source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/2/29/Loader.gif" }}
                          style={{
                            flex: 1,
                            resizeMode: "cover",
                            justifyContent: "center",
                            backgroundColor: 'grey'
                          }}>
                          <TouchableOpacity
                             onPress={() => props.navigation.navigate('PostNotification', item._id)} activeOpacity={0.9}
                           >
                            <VideoComponent

                              filePath={item.fileUrl}
                              hello={{
                                width: wp('33%'),
                                height: wp('32%'),
                                overflow: 'hidden',
                                marginBottom: wp('.3%'),
                                borderWidth: 1,
                                borderColor: '#DADADA'
                              }}
                            />

                          </TouchableOpacity>
                        </ImageBackground> */}

                        </View>
                      )
                    }}
                  />
            }



          </View>
          : <ActivityLoader />}

      </ScrollView>
      {/* </Content> */}
    </View >
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

    UdpdateFollower: payload => dispatch(updateFollower(payload)),



  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);



const styles = StyleSheet.create({
  informationContainer: {
    height: wp('100'),
    padding: 20,
    paddingBottom: 15,
    backgroundColor: '#EEEFF6',
    marginTop: 15,
  },
  profileContainer: {
    flex: 1,
    // backgroundColor: 'red',
    backgroundColor: '#FFF',
    width: wp(85),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    height: wp(50),
  },
  profileImage: {
    height: 80,
    width: 80,
    overflow: 'hidden',
    borderRadius: 10,
  },
  imgVideo: {
    width: wp('33%'),
    height: wp('32%'),
    overflow: 'hidden',
    marginBottom: wp('.3%'),
    borderWidth: 1,
    borderColor: '#DADADA'
  },
  dpContainer: {
    marginTop: 25,
    height: 95,
    width: 95,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  username: {
    marginHorizontal: 8,
    fontSize: 4,
    color: '#77869E',
    fontWeight: 'bold',
  },
  starStyle: {
    width: 100,
    height: 20,

  },
  descriptionContainer: {
    paddingTop: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    flex: 1,
    width: wp(85),
    height: wp(28),
    backgroundColor: 'white',
  },
  starImageView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,

  },
  filterContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: wp('100') - 40,
    height: 45,
    // elevation: 2,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  filterItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    color: Colors.Primary,
    fontSize: 3,
  },
  filterTypeActive: {
    backgroundColor: Colors.Primary,
    borderRadius: 12,
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    // flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryImage: {
    width: wp('33%'),
    height: wp('32%'),
    overflow: 'hidden',
    marginBottom: wp('.3%'),
    borderWidth: 1,
    borderColor: '#DADADA'
  },
})


// Your App ID: fde33dd4-519e-4351-b30e-ac19fdfc3266