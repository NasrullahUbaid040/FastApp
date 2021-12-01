import React from 'react';
import {View, Image, TouchableOpacity, Linking} from "react-native";
import ResponsiveText from "./layout/ResponsiveText";
import Direction from '../assets/images/direction.png'
import Stop from '../assets/icons/stop.png'
import FillStar from '../assets/icons/fill_star.png';
import Star from '../assets/icons/rating-star.png';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { showLocation } from 'react-native-map-link'

const MapDirectionCard =(props)=>{


    // const options = {
    //     latitude: 38.8976763,
    //     longitude: -77.0387185,
    //     title: 'Your hmmmbm',
    //     dialogTitle: 'This is the dialog Title',
    //     dialogMessage: 'This is the amazing dialog Message',
    //     cancelText: 'This is the cancel button text'
    // }

    return(
        <View style={styles.container}>
            <View>
                <View style={{flexDirection: 'row',width: '85%'}}>
                    <ResponsiveText numberOfLines={2} style={styles.titleText}>
                        {props.firstName}
                    </ResponsiveText>
                </View>
                <View style={{flexDirection: 'row'}}>
                    {[1,2,3,4].map((item, index) => (
                        <View key={index}>
                            <Image style={{width:23,height:22,marginRight:2}} source={FillStar} />
                        </View>
                    ))}
                <Image style={{width:23,height:22,tintColor: '#CCCCCC'}} source={FillStar}/>
                </View>

            </View>

            <View style={{position: 'absolute',
                right: 20,
                top: -35,
            }} >
                {props.stopSign ? (
                    <TouchableOpacity style={[styles.directionContainer,{backgroundColor: 'red'}]} onPress={props.onStop}>
                        <Image style={{width: 30, height: 30,tintColor: 'white'}} source={Stop}/>
                    </TouchableOpacity>
                     ): (
                    <TouchableOpacity style={styles.directionContainer}
                                      onPress={() => {
                                          showLocation({
                                              latitude: props.lat,
                                              longitude: props.lng,
                                              // sourceLatitude: -8.0870631,  // optionally specify starting location for directions
                                              // sourceLongitude: -34.8941619,  // not optional if sourceLatitude is specified
                                              // title: 'The White House',  // optional
                                              googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
                                              googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
                                              alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
                                              dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
                                              dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
                                              cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
                                              appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
                                              naverCallerName: 'com.example.myapp' // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
                                              // appTitles: { 'google-maps': 'My custom Google Maps title' } // optionally you can override default app titles
                                              // app: 'uber'  // optionally specify specific app to use
                                          })
                                      }}

                        //                   const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                        // const latLng = `${props.lat},${props.lng}`;
                        // const label = 'Your Destination';
                        // const url = Platform.select({
                        //     ios: `${scheme}${label}@${latLng}`,
                        //     android: `${scheme}${latLng}(${label})`
                        // });
                        //
                        // Linking.openURL(url);

                    >
                        <Image style={{width: 30, height: 30,tintColor:"white"}} source={Direction}/>
                    </TouchableOpacity>

                )
                }
                <ResponsiveText style={styles.directionText}>
                    {props.stopSign ? 'STOP' : 'DIRECTIONS'}
                </ResponsiveText>
            </View>
        </View>
    )
}



const styles={
    container:{
        backgroundColor:'#FAFAFA',
        width:wp(100),
        position:'absolute',
        bottom:0,
        flexDirection:'row',
        justifyContent:'space-between',
        padding:20

    },
    directionContainer:{
        backgroundColor: '#0099A2',
        width:70,
        height: 70,
        borderRadius:35,
        justifyContent: 'center',
        alignItems:'center',
        marginBottom:10,
        alignSelf: 'center'
    },
    directionText:{
        color:'#0099A2',
        alignSelf: 'center'
    },
    titleText:{
        fontSize:5.5
    }
}
export default MapDirectionCard
