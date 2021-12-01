import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Peer from "react-native-peerjs";
import { mediaDevices, RTCView } from 'react-native-webrtc';
import Utils from './Live/Utils';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppHeader from '../../../components/layout/AppHeader';
import ResponsiveText from '../../../components/layout/ResponsiveText';
import Icons from '../../../theme/icons';
import Input from '../../../components/layout/Input';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Sockets from '../../../sockets/Sockets';
import { connect } from 'react-redux';
import { EVENTS } from '../../../sockets/Constant';


const PEER_URL = 'peerjs-webrtc-api.herokuapp.com';


const StreamViewer = (props) => {

    const myStream = useRef(null);
    const peers = useRef([]);
    const myPeer = useRef(null);
    const [s, setS] = useState(null)
    const [, forceRender] = useState('eee')

    //ui design
    const [commentField, setCommentField] = useState('');
    const [heart, setHeart] = useState(false);
    const [joinedData, setJoinedData] = useState();
    const [liveCount, setLiveCount] = useState();
    const [likeCount, setLikeCount] = useState(0);
    const [likeData, setLikeData] = useState([]);
    const [commentsDS, setCommentsDS] = useState([]);

    //scroll to end on 
    const scrollViewRef = useRef();



    useEffect(() => {
        console.log('userId', props.userId)
        Utils.getVideoStream(false).then((result) => {
            myPeer.current = connectToPeer();

            myPeer.current.on('open', id => {
                // :TODO: fetch id from socket
                // console.log('peers..', props?.route?.params?.liveData?.url)
                Alert.alert("view", props?.route?.params?.liveData?.url)
                const call = myPeer.current.call(props?.route?.params?.liveData?.url, result)
                call.answer(result);
                call.on('stream', stream =>
                    setS(stream)
                )
                Sockets.userJoinStrem(props.userId, props?.route?.params?.liveData?._id)

                Sockets.socket.on(EVENTS.LIVE_JOIN_SESSION, data => {
                    // setJoinedData(data)
                    console.log('LIVE_JOIN_SESSION.....>', JSON.stringify(data))
                    setCommentsDS(data.story.messages)
                    setLiveCount(data)
                })
                Sockets.socket.on(EVENTS.LIVE_SESSION_LIKE, data => {
                    setLikeCount(data?.story?.likes.length)
                    setLikeData(data?.story?.likes)
                    console.log('data?.story?.likes..................>', JSON.stringify(data?.story?.likes))

                })


            })
            myPeer.current.on('error', err => console.log("err", err))



        })
        Sockets.socket.on(EVENTS.LIVE_SESSION_MESSAGE, data => {
            setCommentField(' ')
            console.log('LIVE_SESSION_MESSAGE::::::::::::::', JSON.stringify(data))
            setCommentsDS(data.story.messages)
            setCommentField('')

        })
        Sockets.socket.on(EVENTS.DELTE_STORY, data => {
            console.log('DELTE_STORY:::::::::::::::::::::::::::::::', data)

            Alert.alert(
                `Stream has been ended!`,
                "Thanks for watching!",
                [

                    { text: "OK", onPress: () => endSection() }
                ]
            );


        })

    }, [])




    const connectToPeer = () => {
        return new Peer(undefined, {
            host: "peerjs-webrtc-api.herokuapp.com",
            port: 443,
            secure: true,
            path: '/mypeer',
        });
    }

    // {s && <RTCView streamURL={s.toURL()} style={{
    //     height: '90%',
    //     width: '100%'
    // }} />}
    const addNewComment = () => {
        console.log('story id', props.route.params.liveData._id)

        Sockets.StreamMessage(props.userData._id, commentField, props.route.params.liveData._id)
    };
    const endSection = () => {
        Sockets.StreamLeave(props.route.params.liveData._id, props.userData._id)
    }
    return (
        <View style={{ flex: 1 }}>

            <View style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>

                <AppHeader {...props} onLeftPress={() => { props.navigation.goBack(), endSection() }} />

                {/* <ResponsiveText>I am Viewer</ResponsiveText> */}
                <View style={{
                    height: hp(90), backgroundColor: 'lightgrey'
                }}>
                    {s && <RTCView objectFit='cover' streamURL={s.toURL()} style={styles.backgroundVideo} />}

                    {/* top live options */}
                    <View style={{ position: 'absolute', top: 0, zIndex: 1, flexDirection: 'row', right: 0, top: 10 }}>
                        <View style={{
                            ...styles.tag,
                            flexDirection: 'row',
                            backgroundColor: '#434343',
                        }}>
                            <ResponsiveText style={{ fontSize: 3, color: 'white' }}>
                                i am streaming other video
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
                            <ResponsiveText onPress={() => { props.navigation.goBack(), endSection() }} style={{ fontSize: 5, color: 'white' }}>
                                X
                            </ResponsiveText>

                        </View>
                    </View>




                </View>


                {/* Input field */}
                <View style={{ height: hp(20), minWidth: wp('30'), position: 'absolute', borderRadius: 8, bottom: hp(10), zIndex: 2, width: wp('75'), justifyContent: 'center', marginLeft: hp(3) }}>
                    <ScrollView showsVerticalScrollIndicator={false}>


                        {commentsDS.map((item, idx) => {
                            return (
                                <View key={idx} style={styles.commentConTentContainer}>
                                    <ResponsiveText style={styles.username}>
                                        {item?.by?.username}
                                    </ResponsiveText>
                                    <ResponsiveText style={styles.comment}>
                                        {item.text}
                                    </ResponsiveText>
                                </View>
                            );
                        })}

                    </ScrollView>

                </View>
                {/* live count */}
                <View style={{ backgroundColor: 'rgba(41,41,41,0.2)', height: 30, minWidth: hp(5), position: 'absolute', borderRadius: 10, right: hp(3), bottom: hp(10), padding: 10, zIndex: 1.5, alignSelf: 'center', justifyContent: 'center' }}>
                    <ResponsiveText style={{ alignSelf: 'center' }} >{likeCount}</ResponsiveText>

                </View>

                <View style={{ backgroundColor: 'rgba(41,41,41,0.5)', position: 'absolute', borderRadius: 8, bottom: hp(1), zIndex: 1, flexDirection: 'row', alignSelf: 'center', width: wp('90'), justifyContent: 'center' }}>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
                                    Sockets.StreamLike(props?.route?.params?.liveData?._id, props.userData._id)
                                    // console.log(likeData?.include('60bdfda02d5f5600151adfb5'))

                                }}>

                                {likeData?.includes(props.userData._id) ?
                                    Icons.RedHeart({ height: wp('7'), width: wp('7') })
                                    : Icons.LikeWhiteBorder({ tintColor: '#FFF', height: wp('7'), width: wp('7') })
                                }

                            </TouchableOpacity>
                        </View>
                    </View>
                </View>




            </View>
        </View >
    );
}

// export default StreamViewer;

function mapStateToProps(state) {
    return {

        // token: state.auth.token,
        userId: state.auth.user._id,
        userData: state.auth.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamViewer);

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