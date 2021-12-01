import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, KeyboardAvoidingView, TextInput, Button, ScrollView } from 'react-native'
import Video from 'react-native-video'
import VideoComponent from '../../../components/VideoComponent'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icons from '../../../theme/icons'
import ResponsiveText from '../../../components/layout/ResponsiveText'
import axios from "axios"
import { connect } from 'react-redux';
import CommentDisplay from '../../../components/CommentDisplay';
import StoryItem from '../../../components/StoryItem';
import Socket from '../../../sockets/Sockets'
import { EVENTS } from '../../../sockets/Constant'
import send from '../../../assets/icons/Send.png'
import Container from '../../../components/layout/Container';
import ActivityLoader from '../../../components/ActivityLoader';
import AppHeader from '../../../components/layout/AppHeader';

const PostNotification = (props) => {

    const [videoLoadData, SetVideoLoadData] = useState({})
    const [noDataFound, setNoDataFound] = useState(false)
    const [myComments, setMyComments] = useState([]);
    const [commentFoucsed, setCommentFocused] = useState(false);
    const [comment, setComment] = useState('');

    const [postId, setPostId] = useState('');
    const [postData, setPostData] = useState([]);

    const _comments = useRef([])
    let scroll = useRef();
    let textInput = useRef()
    const _posts = useRef([])

    useEffect(() => {
        dummy()

    }, [])



    const dummy = () => {
        console.log('i am called.....>', props.route.params.data)
        // console.log('props post id....>>>>>>', props.route.params)

        setPostId(props.route.params.data)

        getMyComments()
        getPostByID(props.route.params.data)

        Socket.joinRoom(props.route.params.data)
        Socket.socket.on(EVENTS.JOIN_ROOM, data =>
            console.log('', data)
        )

        Socket.socket.on(EVENTS.LIKE, ({ post }) => {
            let data = {
                "post": post
            }
            setPostData(data)
        })

        Socket.socket.on(EVENTS.COMMENT, data => {
            console.log('COMMENT::::::::', data)
            _comments.current = [..._comments.current, data.comment]
            setMyComments(_comments.current)
            const comm = [...myComments, data.comment]
        })



        return () => {
            Socket.leaveRoom(props.route.params.data)
        };

    }

    const onVideoLoad = (e) => {
        SetVideoLoadData(e)
    }
    const getMyComments = () => {
        axios.post(`${API_URL}/post/get-comments`,
            {
                post: props.route.params.data,
            },
            {
                headers: { 'x-auth-token': props.token }
            })
            .then(res => res.data.data)
            .then(res => {
                // console.log('comments............', res)

                if (!res.comments.length) {
                    setNoDataFound(true)
                } else {
                    _comments.current = res?.comments
                    setMyComments(res?.comments)
                    // console.log('myComments::::::::', _comments.current)
                    setNoDataFound(false)
                }
            })
            .catch((err) => {
                console.log('ERROR=======', err)
            });
    }

    const onSend = (commentText, postId) => {

        setComment('')
        Socket.postComment(props?.userData?._id, commentText, postId)
    }
    const likemypost = (id) => {
        Socket.postLike(props?.userData?._id, id)
        dummy()
    }

    const getPostByID = (id) => {
        axios.get(`${API_URL}/post/postById/${id}`,
            {
                headers: { 'x-auth-token': props.token }
            },
        )
            .then(res => res.data)
            .then(res => {
                setPostData(res)


            })
            .catch((err) => {
                console.log('ERROR__::', err)
            });
    }
    return (
        <Container>
            <AppHeader onLeftPress={() =>
                // props.navigation.navigate("Notification")
                props.navigation.goBack()
            } />

            {!postData?.post ?
                <ActivityLoader />
                :

                <>
                    <ScrollView>

                        <View style={styles.postPayload}>
                            <View style={styles.videoContainer}>

                                <Video
                                    // paused={true}
                                    source={{ uri: postData?.post.fileUrl }}
                                    // source={require('../../../assets/images/file_example_MP4_640_3MG.mp4')}
                                    onBuffer={() => { console.log('onBuffer') }}
                                    onError={() => { console.log('error') }}
                                    onLoad={(e) => onVideoLoad(e)}
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



                            </View>

                            {/* share n comment */}
                            <View style={{ flexDirection: 'row', padding: 5 }}>
                                <TouchableOpacity
                                    onPress={() => { likemypost(postId) }}     >

                                    {postData?.post?.likedby.find(x => x._id === props?.userData?._id) ? Icons.RedHeart(styles.postActionIcon) : Icons.Like(styles.postActionIcon)}

                                </TouchableOpacity>


                                {/* <TouchableOpacity
            style={{ marginHorizontal: 10 }}  >
            {Icons.Comment(styles.postActionIcon)}

        </TouchableOpacity> */}

                                <TouchableOpacity>
                                    {Icons.Share({
                                        ...styles.postActionIcon,
                                        width: 35,
                                    })}
                                </TouchableOpacity>


                                <TouchableOpacity style={styles.likesContainer}  >
                                    <Image
                                        source={{ uri: postData?.post?.likedby[0]?.imgUrl }}
                                        style={[styles.likedByDP, { marginRight: -12.5 }]}
                                    />
                                    <Image
                                        source={{ uri: postData?.post?.likedby[1]?.imgUrl }}

                                        style={styles.likedByDP}
                                    />
                                    <ResponsiveText style={styles.likeCounts}>
                                        {' '}
                                        {postData?.post?.likedby.length} likes
                                    </ResponsiveText>
                                </TouchableOpacity>

                                <View style={styles.shareContainer}>
                                    <ResponsiveText style={styles.likeCounts}>
                                        {' '}
                                        {postData?.post?.sharedBy?.length} shares
                                    </ResponsiveText>
                                </View>
                            </View>





                            <FlatList
                                data={myComments}
                                keyExtractor={item => item._id}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={{ paddingHorizontal: 10 }} >
                                            <CommentDisplay key={postId} comment={item} {...props.navigation} />
                                        </View>
                                    )
                                }}
                            />






                        </View >
                    </ScrollView>


                    <KeyboardAvoidingView style={styles.postComments} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                        <StoryItem
                            containerSize={45}
                            border={true}
                            borderPurple={true}
                            uri={props?.userData.imgUrl}
                        // uri={"https://picsum.photos/id/455/200/300"}
                        />

                        <View
                            style={{ flex: 1, flexDirection: 'row' }}
                        >
                            <TextInput
                                placeholder='Add a Comment...'
                                ref={textInput}
                                style={[styles.input, commentFoucsed ? { borderColor: '#0099A2' } : { borderColor: 'transparent' }]}
                                onBlur={() => setComment(false)}
                                onFocus={() => setCommentFocused(true)}
                                value={comment}
                                onChangeText={(e) => setComment(e)}

                                textAlignVertical={'top'}
                                multiline={true}
                            />

                            <TouchableOpacity
                                disabled={comment.length < 1 ? true : false}
                                style={styles.sendIcon} onPress={() => {
                                    onSend(comment, postId)
                                }}>
                                <Image
                                    source={send}
                                    style={{ height: '100%', width: '100%' }} />
                            </TouchableOpacity>
                        </View>

                    </KeyboardAvoidingView>
                </>
            }

        </Container >
    )
}

const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 0,
    },
    postComments: {
        paddingHorizontal: 15,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
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
    postPayload: {
        flex: 1,
        backgroundColor: '#E4E4E4',
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
    likesContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    likedByDP: {
        height: 25,
        width: 25,
        borderRadius: 13,
    },
    inputBox: {
        backgroundColor: 'lightgrey',
        borderRadius: 5
    },
    input: {
        flex: 1,
        borderColor: 'blue',
        borderWidth: 1.5,
        height: hp(13),
        borderRadius: 5,
        padding: 5
    },
    sendIcon: {
        height: wp(6),
        width: wp(6),
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 10
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
        // loginUser: (payload) => dispatch(loginUser(payload)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostNotification);