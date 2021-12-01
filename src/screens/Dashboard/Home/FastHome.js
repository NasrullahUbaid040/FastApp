import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react'
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
} from 'react-native'
import Share from 'react-native-share';

import { connect } from 'react-redux';
import StoryItem from '../../../components/StoryItem'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import ResponsiveText from '../../../components/layout/ResponsiveText'
import Icons from '../../../theme/icons';
import Video from 'react-native-video'
import moment from 'moment'
import GetLocation from 'react-native-get-location'
import Socket from '../../../sockets/Sockets'
import { useFocusEffect } from "@react-navigation/native";
import { EVENTS } from '../../../sockets/Constant'

function FastHome(props) {
    const { navigation } = props
    const startCount = ['', '', '', '', '']
    const [locationFilterTypeIdx, setLocationFilterTypeIdx] = useState(0)
    const [videoLoadData, SetVideoLoadData] = useState({})
    const [comment, setComment] = useState('')
    const [commentFoucsed, setCommentFocused] = useState(false)

    const [userPostData, setUserPostData] = useState([])
    const [advertisement, setAdvertisement] = useState({})
    const [myStories, setMyStories] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);
    const [noDataFound, setNoDataFound] = useState(false)
    const [postLoading, setPostLoading] = useState(false)
    const [postLoading2, setPostLoading2] = useState(false)
    const [isSent, setisSent] = useState(true)
    const [forceUpdate, setForceUpdate] = useState(false)
    const [name, setName] = useState('');
    const [country, setCountry] = useState('New York');
    const [temp, settemp] = useState();
    const [activeUsers, setActiveUsers] = useState([])
    const _posts = useRef([])
    let _skip = useRef(0);
    const _paused = useRef(false)
    let currentCount = 0;

    useEffect(() => {

        getMyFeeds()
        getUserLocation()
    }, [])

    useFocusEffect(
        React.useCallback(() => {

            console.log(props?.userData?._id)
            Socket.myEstablishFunc(props?.userData?._id)
            Socket.socket.on(EVENTS.ESTABLISH_CONNECTION, data =>
                console.log('')
            )

            Socket.socket.on(EVENTS.LIKE, ({ post }) => {
                // console.log('after LIKE_____', JSON.stringify(post.likedby))
                // const index = _posts.current.findIndex(item => item._id == post._id)
                // const newPosts = [..._posts.current];
                // newPosts[index] = [post.likedby]
                // _posts.current[index].likedby = [post.likedby]


                const index = _posts.current.findIndex(item => item._id == post._id)
                if (index == -1) return;
                const newPosts = [..._posts.current];
                newPosts[index] = post;
                _posts.current = newPosts;
                setName(name + '   ')
            })

            Socket.socket.on(EVENTS.USERS, (data) => {
                setActiveUsers(Object.keys(data))
                // console.log('online user......', activeUsers)
            })

            getUserLocation()
            // getAdvertisement()
            getMyFeeds()


            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            return () => backHandler.remove();

        }, [])
    );
    const getUserLocation = () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(location => {

                axios.get(`http://api.geonames.org/countryCodeJSON?lat=${location.latitude}&lng=${location.longitude}&username=demo123`).then(res => {
                    console.log('>>>>> >>>>> >>>>>', res.data.countryCode)
                    setCountry(res.data.countryName + " " + res.data.countryCode)


                    axios.post(`${API_URL}/user/post-location`,
                        {
                            "location": {
                                "lat": location.latitude,
                                "lng": location.longitude,
                                "name": country
                            }
                        },
                        {
                            headers: { 'x-auth-token': props.token }
                        })
                })
                    .then(res => {
                        console.log('location updated')
                    })
            })
            .catch(error => {
                console.log('error', error)
            })
    }
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
    const loadMoreFeeds = () => {
        _skip.current = (_skip.current + 2)
        console.log('skip...............', _skip.current)
        getMyFeeds()
    }
    const getMyFeeds = () => {
        console.log('called func')
        axios.get(`${API_URL}/post/feed?skip=${_skip.current}&limit=2`,
            {
                headers: { 'x-auth-token': props.token }
            })
            .then(res => {
                setPostLoading(false)

                if (!res.data.length) {
                    // setNoDataFound(true)
                    console.log('object')
                } else {

                    setNoDataFound(false)

                    if (_skip.current == 0) {
                        _posts.current = res.data
                        setUserPostData(_posts.current)
                        setPostLoading2(true)
                    } else {
                        setPostLoading2(true)

                        const temp = _posts.current
                        const newData = res.data

                        _posts.current = [..._posts.current, ...res.data]
                        setUserPostData(_posts.current)
                        console.log('_posts.current_________', JSON.stringify(_posts.current))

                    }





                }



                setUserPostData(res.data)
            })
            .catch((err) => {
                console.log('ERROR:-_-_-_', err)
            });
    }
    const onViewRef = React.useRef(({ viewableItems }, index) => {
        // console.log('viewableItems:::', viewableItems)
        console.log('Index:::', index)

        if (viewableItems && viewableItems.length > 0) {
            console.log('viewableItems____', viewableItems[0].index)
            settemp(viewableItems[0].index)
        }
    })
    const likemypost = (id) => {
        Socket.postLike(props?.userData?._id, id)
        setName(' ')
    }
    const onShare = async (id) => {

        const shareOptions = {
            title: 'FAST',
            message: `https://www.fastappss.com/post/${id}`,
            failOnCancel: true
        }


        Share.open(shareOptions)
            .then((res) => {
                console.log({ res });
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(a => {
                console.log("object a:", a)
            })

    };
    const onRefresh = React.useCallback(() => {
        console.log('.....onRefresh.....')
        setRefreshing(true);
        wait(500).then(() => {
            _skip.current = 0,
                setRefreshing(false)
            getMyFeeds()
        }
        );
    }, []);
    return (
        <View>
            {/* <ScrollView
                contentContainerStyle={{ backgroundColor: '#EEEFF6' }}
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        setPostLoading(true)
                        if (postLoading2 == true) {
                            loadMoreFeeds()
                            setPostLoading2(false)
                        }

                    }
                }}
                scrollEventThrottle={0.001}

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            > */}
            <FlatList
                data={_posts.current}
                onEndReachedThreshold={0.5}
                onEndReached={() => console.log('end...')}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
                keyExtractor={item => item._id}
                renderItem={({ item, index }) => {
                    return (
                        <View key={index} style={{ marginVertical: 8 }}>
                            <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    // onPress={() => navigation.navigate('LiveVideo')}
                                    // onPress={() => navigation.navigate('DemoLive')}
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

                                {item.by.hasStudio &&
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
                                <View style={styles.videoContainer}>

                                    <Video
                                        paused={true}



                                        // source={{ uri: item.fileUrl }}
                                        source={require('../../../assets/images/file_example_MP4_640_3MG.mp4')}
                                        // onProgress={({ currentTime }) => console.log(currentTime)}


                                        onBuffer={() => { console.log('onBuffer') }}
                                        onError={() => { console.log('error') }}
                                        // onLoad={(e) => onVideoLoad(e)}
                                        resizeMode="cover"
                                        repeat
                                        style={styles.backgroundVideo}
                                    />
                                    <View style={styles.durationContainer}>
                                        <ResponsiveText style={styles.videoDuration}>
                                            00:00
                                        </ResponsiveText>
                                        <ResponsiveText style={styles.videoDuration}>
                                            00:30
                                        </ResponsiveText>
                                    </View>
                                    <View
                                        style={[styles.studioStatus, item?.by?.available ? { borderColor: '#0099A2' } : { borderColor: 'red' }]}
                                    >
                                        {item?.by?.available ? (
                                            <TouchableOpacity

                                                onPress={() => {
                                                    props?.userData?._type === "Artist" && props?.userData?._type === "Singer" &
                                                        navigation.navigate('OfferCard')
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
                                    {/* <View style={[styles.studioStatus, { borderColor: '#0099A2' }]}  >
                            <TouchableOpacity onPress={() => navigation.navigate('OfferCard')}>
                              <ResponsiveText style={styles.itemStatusText}>Available</ResponsiveText>
                            </TouchableOpacity>

                          </View> */}
                                </View>
                            </View>
                            <View style={styles.postFeatureContainer}>
                                <View style={styles.postActionsContainer}>

                                    <TouchableOpacity
                                        onPress={() => {
                                            likemypost(item._id)
                                            // console.log('item_______', JSON.stringify(item))
                                        }}
                                    >
                                        {item.likedby.find(like => like._id == props?.userData?._id) ? Icons.RedHeart(styles.postActionIcon) : Icons.Like(styles.postActionIcon)}
                                    </TouchableOpacity>


                                    <TouchableOpacity

                                        onPress={() =>
                                            navigation.navigate('comments', { post_id: item._id, thumb: item.thumbnail })
                                        }
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
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={styles.likesContainer}
                                    activeOpacity={0.9}
                                    onPress={() => navigation.navigate('LikedBy', { post_id: item._id })}

                                >
                                    <Image
                                        source={{ uri: item?.likedby[0]?.imgUrl }}
                                        style={[styles.likedByDP, { marginRight: -12.5 }]}
                                    />
                                    <Image
                                        source={{ uri: item?.likedby[1]?.imgUrl }}
                                        style={styles.likedByDP}
                                    />
                                    <ResponsiveText style={styles.likeCounts}>
                                        {item?.likedby.length}
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
                                        {item?.sharedBy.length}
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
                                {/* {item.comments.map((comment, idx) => {
                          return (
                            <CommentDisplay key={idx} comment={comment} idx={idx} {...navigation} />
                          )
                        })} */}
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
            {/* </ScrollView> */}
        </View>
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
        marginVertical: 8,
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
        left: null,
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
        // borderBottomLeftRadius: 10,
        // borderTopLeftRadius: 10,
        // width: wp('97'),
        height: 45,
        elevation: 2,
        marginVertical: 10,
        paddingRight: 10,
        marginLeft: wp(5),
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
        width: wp(30),
        textAlign: 'center',

    },
    filterTypeActive: {
        backgroundColor: Colors.Primary,
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
        backgroundColor: 'green',
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
        userData: state.auth.user

    }
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FastHome);