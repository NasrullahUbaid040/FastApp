import React, { useRef, useState, useEffect,useImperativeHandle  } from 'react';
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
import Video from 'react-native-video'
import video from '../screens/Dashboard/Post/Live/Video';
import InViewPort from './InViewPort'


const VideoPlayer = React.forwardRef((item,ref) => {



    const [isPlaying, setIsPlaying] = useState(false)



    useImperativeHandle(ref, () => ({

        stopVideo() {
          setIsPlaying(false)
        }
    
      }));



    return (
        // <InViewPort onChange={handlePlaying}>
        <View style={{
            // flex: 1,
            // borderWidth:1,
            width: '100%',
            height: '100%',
            backgroundColor: '#FFF'
        }}>
            {/* {isPlaying ? */}

            <>
                <Video
                    // ref={(ref) => {
                    //     _player.current = ref;
                    // }}
                    paused={isPlaying ? false : true}
                    // paused={videoPaused ? true : isPlaying ? false : true}
                    // paused={!videoPaused || isPlaying ? false : true}
                    source={{ uri: item.item.fileUrl }}
                    // source={require('../../../assets/images/file_example_MP4_640_3MG.mp4')}
                    poster={item.item.thumbnail}
                    // onProgress={({ currentTime }) => console.log(currentTime)}
                    onBuffer={() => { console.log('onBuffer') }}
                    onError={() => { console.log('error') }}
                    // onLoad={(e) => onVideoLoad(e)}
                    resizeMode="contain"
                    posterResizeMode="cover"
                    repeat
                    style={styles.backgroundVideo}
                />

                <TouchableOpacity
                    onPress={() => {
                        console.log("hhelelle")
                        // check(setIsPlaying)
                        setIsPlaying(!isPlaying);
                        // setVideoPaused(!videoPaused)

                    }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        // backgroundColor: 'red'
                    }}>

                    {isPlaying ?
                        null
                        :
                        <Image
                            // source={require('../../../assets/icons/play-button.png')}
                            source={require('../assets/icons/play-button.png')}
                            resizeMode="contain"
                            style={styles.playButtonStyle}
                        />


                    }

                </TouchableOpacity>



            </>

            {/* : */}

            {/* <ImageBackground
                    source={{ uri: item?.thumbnail }}
                    imageStyle={{ borderRadius: 12 }}
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#F9F9F9',
                        borderRadius: 12,
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            setIsPlaying(!isPlaying);
                        }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            // backgroundColor: 'red'
                        }}>
                        <Image
                            // source={require('../../../assets/icons/play-button.png')}
                            source={require('../assets/icons/play-button.png')}
                            resizeMode="contain"
                            style={styles.playButtonStyle}
                        />
                    </TouchableOpacity>
                </ImageBackground> */}

            {/* } */}

        </View>
        // </InViewPort>

    )

})

export default VideoPlayer;


const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 0,
    },

    playButtonStyle: {
        width: 35,
        height: 35,
        // borderRadius: 35 / 2,
        // borderWidth: 1,
        tintColor: '#fff'
        // backgroundColor: 'white'
    }

})

