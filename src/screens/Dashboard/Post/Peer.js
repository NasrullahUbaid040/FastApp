import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Alert, Text, View, KeyboardAvoidingView, StyleSheet, TextInput } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Peer from "react-native-peerjs";
import { mediaDevices, RTCView } from 'react-native-webrtc';
import Utils from './Live/Utils';
import API_URL from '../../../config/constants';
import { connect } from 'react-redux';
import Sockets from '../../../sockets/Sockets'
import AppHeader from '../../../components/layout/AppHeader';
import Icons from '../../../theme/icons';
import Input from '../../../components/layout/Input';
import ResponsiveText from '../../../components/layout/ResponsiveText';
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Video from 'react-native-video';
import { EVENTS } from '../../../sockets/Constant';


const PEER_URL = 'peerjs-webrtc-api.herokuapp.com';

const Peer1 = (props) => {
    // states for streaming
    const myStream = useRef(null);
    const peers = useRef([]);
    const myPeer = useRef(null);
    const [s, setS] = useState(null)
    const [myStoryId, setmyStoryId] = useState('')
    const [myStreamId, setmyStreamId] = useState('')
    const [, forceRender] = useState('eee')


    // ui states
    const [commentField, setCommentField] = useState('');
    const [heart, setHeart] = useState(false);
    const [showComments, setShowComments] = useState(true);
    const [commentsDS, setCommentsDS] = useState([]);
    let scroll = useRef();
    const [joinedData, setJoinedData] = useState();
    const [likeCount, setLikeCount] = useState(0);

    const [liveCount, setLiveCount] = useState();



    const postMyId = (id) => {
        axios.post(`${API_URL}/user/story`,
            {
                "url": id,
                "caption": "I am going Live",
                "type": "live",
                "thumbnail": "test"
            },
            {
                headers: { 'x-auth-token': props.token }
            })
            .then(res => {

                console.log('.....STORY uploaded successfully...', res.data)
                setmyStoryId(res.data.story._id)
            })
            .catch((err) => {
                console.log('ERROR=======', err)
            });
    }
    const endSection = () => {
        Sockets.deleteStory(myStoryId, myStreamId)
        props.navigation.goBack()
    }
    const connectToPeer = () => {
        return new Peer(undefined, {
            host: "peerjs-webrtc-api.herokuapp.com",
            port: 443,
            secure: true,
            path: '/mypeer',
        });
    }
    useEffect(() => {

        Utils.getVideoStream(true).then((result) => {
            myStream.current = result
            forceRender('render')
            myPeer.current = connectToPeer();

            myPeer.current.on('open', id => {
                console.log(`id____`, id)
                setmyStreamId(id)
                Alert.alert("Strem id", id)
                postMyId(id)


            })
            myPeer.current.on('call', call => {
                call.answer(result);


                //:TODO://here we can get stream frok other use
                // call.on('stream', stream =>
                //     console.log('hjaha'))
            })
            Sockets.socket.on(EVENTS.LIVE_JOIN_SESSION, data => {
                // setJoinedData(data)
                console.log('LIVE_JOIN_SESSION............Peer js......>', JSON.stringify(data))
                // setCommentsDS(data.story.messages)
                setLiveCount(data)
            })
            Sockets.socket.on(EVENTS.LIVE_SESSION_LIKE, like => {
                console.log('like..................>', JSON.stringify(like))
                setLikeCount(like?.story?.likes?.length)

            })

            myPeer.current.on('error', err => console.log("err", err))

        })
        // Sockets.userJoinStrem(props.userId, myStoryId)
        Sockets.socket.on(EVENTS.LIVE_SESSION_MESSAGE, data => {
            // console.log('LIVE_SESSION_MESSAGE::::', data)
            setCommentsDS(data.story.messages)
            setCommentField('')
        })


        //backhandler
        // const backHandler = BackHandler.addEventListener(
        //     'hardwareBackPress',
        //     backAction,
        // );


    }, [])


    // const backAction = () => {
    //     Alert.alert("Hold on!", "Are you sure you want to go back?", [
    //         {
    //             text: "Cancel",
    //             onPress: () => null,
    //             style: "cancel"
    //         },
    //         { text: "YES", onPress: () => endSection() } 
    //     ]);
    //     return true;
    // };

    useEffect(() => {
        if (myStoryId) {
            Sockets.userJoinStrem(props.userId, myStoryId)
        }
    }, [myStoryId])




    const addNewComment = () => {
        // console.log('my id', props.userData._id)
        // console.log('story id', myStoryId)
        // console.log('message', commentField)
        Sockets.StreamMessage(props.userData._id, commentField, myStoryId)
    };
    return (
        <View style={{ flex: 1 }}>

            <View style={{ flex: 1, }} behavior={Platform.OS === "ios" ? "padding" : "height"}>

                <AppHeader {...props} onLeftPress={() => { endSection() }} />



                <View style={{
                    height: hp(90), backgroundColor: 'lightgrey'
                }}>
                    {myStream.current && <RTCView objectFit='cover' streamURL={myStream.current.toURL()} style={styles.backgroundVideo} />}

                    {/* top live options */}
                    <View style={{ position: 'absolute', top: 0, zIndex: 1, flexDirection: 'row', right: 0, top: 10 }}>
                        <View style={{
                            ...styles.tag,
                            flexDirection: 'row',
                            backgroundColor: '#434343',
                        }}>
                            <ResponsiveText style={{ fontSize: 3, color: 'white' }}>
                                I am sharing my video
                            </ResponsiveText>

                        </View>
                        <View style={{
                            ...styles.tag, flexDirection: 'row', backgroundColor: '#8C8888',
                        }}>
                            {Icons.Eye({ tintColor: '#FFF', marginHorizontal: 5 })}
                            <ResponsiveText style={{ fontSize: 3, color: 'white' }}>
                                {liveCount?.story?.viewed_by?.length}
                            </ResponsiveText>
                        </View>
                        <View onPress={() => endSection()} style={{
                            ...styles.tag,
                            flexDirection: 'row',

                        }}>
                            <ResponsiveText onPress={() => endSection()} style={{ fontSize: 5, color: 'white' }}>
                                X
                            </ResponsiveText>

                        </View>
                    </View>




                </View>


                {/* comments view start here */}
                <View style={{ height: hp(20), minWidth: wp('30'), position: 'absolute', borderRadius: 8, bottom: hp(10), zIndex: 2, width: wp('75'), justifyContent: 'center', marginLeft: hp(3) }}>
                    <ScrollView>


                        {commentsDS.map((item, idx) => {
                            return (
                                <View key={idx} style={styles.commentConTentContainer}>
                                    <ResponsiveText style={styles.username}>
                                        {item?.by?.username}
                                    </ResponsiveText>
                                    <ResponsiveText style={styles.comment}>
                                        {item?.text}
                                    </ResponsiveText>
                                </View>
                            );
                        })}

                    </ScrollView>

                </View>
                {/* comments view ends here */}
                <View style={{ backgroundColor: 'rgba(41,41,41,0.2)', height: 30, minWidth: hp(5), position: 'absolute', borderRadius: 10, right: hp(3), bottom: hp(10), padding: 10, zIndex: 1.5, alignSelf: 'center', justifyContent: 'center' }}>
                    <ResponsiveText style={[styles.username, { alignSelf: 'center' }]} >{likeCount}</ResponsiveText>

                </View>

                {/* Input field */}
                <View style={{ backgroundColor: 'rgba(41,41,41,0.5)', position: 'absolute', borderRadius: 8, bottom: hp(1), zIndex: 1, flexDirection: 'row', alignSelf: 'center', width: wp('90'), }}>
                    <Input
                        returnKeyType={"done"}
                        placeholder={'Send a message'}
                        inputStyle={styles.commentInputStyle}
                        value={commentField}
                        // key
                        onChangeText={(e) => setCommentField(e)}
                        placeholderTextColor={'#FFF'}
                        onSubmitEditing={addNewComment}
                    />


                    {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {Icons.ShareLive({ tintColor: '#FFF', height: wp('7'), width: wp('7'), marginRight: 8 })}
                        <View style={{ position: 'relative' }}>
                            <View
                                style={{
                                    position: 'absolute',
                                    backgroundColor: 'pink',
                                    left: -20,
                                    top: -5,
                                    padding: 5,
                                    borderRadius: 50,
                                    height: 15,
                                    width: 15,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <ResponsiveText style={{ fontSize: 2.5, color: '#FFF' }}>
                                    4
                                </ResponsiveText>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {
                                    setHeart(!heart);
                                }}>
                                {heart
                                    ? Icons.RedHeart({ height: wp('7'), width: wp('7') })
                                    : Icons.LikeWhiteBorder({ tintColor: '#FFF', height: wp('7'), width: wp('7') })}
                            </TouchableOpacity>
                        </View>
                    </View> */}
                </View>




            </View>
        </View >
    );
}



function mapStateToProps(state) {
    return {

        token: state.auth.token,
        userData: state.auth.user,
        userId: state.auth.user._id,

    }
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Peer1);


const styles = StyleSheet.create({
    videoContainer: {
        position: 'relative',
        width: wp('100'),
        height: hp('83'),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        backgroundColor: 'transparent',
    },
    backgroundVideo: {
        flex: 1
        // position: 'absolute',
        // top: wp(26),
        // left: 0,
        // bottom: 0,
        // right: 0,
        // zIndex: 0,
    },
    // commentsContainer: {
    //   position: 'absolute',
    //   bottom: 40,
    //   width: wp('100'),
    //   height: wp('80'),
    //   paddingTop: 10,
    //   paddingHorizontal: 10,
    //   marginBottom: 15,
    // },
    commentConTentContainer: {
        backgroundColor: 'rgba(41,41,41,0.2)',
        minWidth: wp('30'),
        alignSelf: 'flex-start',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 8,
        marginVertical: 3,
        maxWidth: wp(90)
    },
    username: {
        color: '#FFF',
        fontSize: 3,
    },
    comment: {
        color: '#FFF',
        fontSize: 2.5,
        marginVertical: 3,
    },
    commentsContainer: {
        position: 'relative',

    },
    commentInputStyle: {
        width: wp('63'),
        height: wp('10'),
        backgroundColor: 'transparent',
        color: '#FFF',
        marginTop: 8,
        marginRight: 8,
    },
    inputFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('90'),
        paddingVertical: 0,
        backgroundColor: 'rgba(41,41,41,0.5)',
        alignSelf: 'center',
        marginTop: 30,
        borderRadius: 8,
        paddingHorizontal: 8,
        fontSize: 3,
    },
    tag: {
        padding: 5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        fontSize: 3,
        // paddingHorizontal: 10,
        color: 'white',
    },
    tagContainer: {
        flexDirection: 'row',
        position: 'absolute',
        right: 50,
        top: 10,
    },
});