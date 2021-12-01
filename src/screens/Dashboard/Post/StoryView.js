import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';

import ResponsiveText from '../../../components/layout/ResponsiveText';
import Container from '../../../components/layout/Container';
import Content from '../../../components/layout/Content';
import AppHeader from '../../../components/layout/AppHeader';
import Video from 'react-native-video';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Input from '../../../components/layout/Input';
import Icons from '../../../theme/icons';
import LinearGradient from 'react-native-linear-gradient';
import ActivityLoader from '../../../components/ActivityLoader';


const commentDataSet = [
    {
        username: 'Josh',
        comment:
            'Hi, you are really doing an amazing job. Would love to hear more form you :)',
    },
    {
        username: 'Bill',
        comment: 'That nice. I have a question!',
    },
    {
        username: 'Rick Byers',
        comment: 'Hey, that\'s nice.',
    },
    {
        username: 'Bill',
        comment: 'That nice. I have a question!',
    },
    {
        username: 'Rick Byers',
        comment: 'Hey, that\'s nice.',
    },
    {
        username: 'Bill',
        comment: 'That nice. I have a question!',
    },
    {
        username: 'Rick Byers',
        comment: 'Hey, that\'s nice.',
    },
    {
        username: 'Bill',
        comment: 'That nice. I have a question!',
    },
    {
        username: 'Rick Byers',
        comment:
            'Hi, you are really doing an amazing job. Would love to hear more form you :)',

    },
];

function StoryView(props) {

    const [commentsDS, setCommentsDS] = useState(commentDataSet);
    const [commentField, setCommentField] = useState('');
    const [videoPath, setVideoPath] = useState('');
    const [heart, setHeart] = useState(false);
    const [paused, setPaused] = useState(false);
    const [showComments, setShowComments] = useState(true);
    let scroll = useRef();

    /////////
    const [MyVideoIndex, setMyVideoIndex] = useState('');
    const [StoryData, setStoryData] = useState('');
    const [showLoader, setShowLoader] = useState(null);


    useEffect(() => {
        setMyVideoIndex(props.route.params.selectedindex)
        setStoryData(props.route.params.storyData)
        // setVideoPath(props.route.params.storyData.url)


        props.navigation.addListener('blur', (payload) => {
            setPaused(true);
        });
        props.navigation.addListener('focus', (payload) => {
            setPaused(false);
        });
        console.log('StoryData...', StoryData[MyVideoIndex]?.url)
    }, []);

    const addNewComment = () => {
        let alias = commentsDS;
        alias.push({
            username: 'You',
            comment: commentField,
        });
        if (commentField.length) {
            setCommentsDS(alias);
        }
        setCommentField('');
    };


    return (
        <View style={{ flex: 1 }}>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <AppHeader onLeftPress={() => props.navigation.goBack()} />


                <Video
                    paused={paused}
                    // source={require('../../../assets/images/file_example_MP4_640_3MG.mp4')}
                    source={{ uri: StoryData[MyVideoIndex]?.url }}

                    // onBuffer={() => console.log('onBuffer')}
                    // onLoadStart={() => { console.log('onLoadStart') }}
                    // onError={() => { console.log('onError') }}
                    onProgress={(data) => { setShowLoader(data.currentTime) }}
                    resizeMode="cover"
                    repeat={true}
                    style={styles.backgroundVideo}
                />

                {!showLoader > 0 && <ActivityLoader />}



                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, position: 'relative' }}>
                        <View style={styles.tagContainer}>

                        </View>

                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <View style={{ flex: 1 }} />
                        </TouchableWithoutFeedback>

                    </View>
                    <View style={styles.inputFieldContainer}>
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
                        {/* <View style={{ flexDirection: 'row' }}>
                            {Icons.ShareLive({ tintColor: '#FFF', height: wp('7'), width: wp('7'), marginRight: 8 })}
                            <View style={{ position: 'relative' }}>

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
                    <TouchableOpacity
                        style={{
                            ...styles.tag,
                            flexDirection: 'row',
                            backgroundColor: '#8C8888',
                            position: 'absolute',
                            right: 0,
                            top: wp("2.5")
                        }}
                        onPress={() => props.navigation.goBack()}
                    >
                        {Icons.CrossClose({ height: 20, width: 20, tintColor: '#FFF' })}
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

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
        position: 'absolute',
        top: wp(28),
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 0,
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
        backgroundColor: 'rgba(41,41,41,0.5)',
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
        paddingHorizontal: 10,
        color: 'white',
    },
    tagContainer: {
        flexDirection: 'row',
        position: 'absolute',
        right: 50,
        top: 10,
    },
});
export default StoryView;
