import React, { useRef, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Video from 'react-native-video'



function VideoComponent({ filePath, hello }) {
    useEffect(() => {
        // console.log('filePath__', filePath)

    }, [])
    const videRef = useRef(null)


    return (
        <View  >

            <Video
                // TODO: fixme
                source={{ uri: filePath }}
                // source={require('../assets/images/file_example_MP4_640_3MG.mp4')}

                onBuffer={() => { console.log('onBuffer') }}
                onError={() => { console.log('error') }}
                resizeMode="cover"
                // paused={true}
                ref={(nasr => videRef.current = nasr)}
                onLoad={() => {
                    if (videRef?.current) {
                        videRef.current.seek(0.5);
                    }

                }}

                style={hello}


            />




        </View>
    );
}

export default VideoComponent;
