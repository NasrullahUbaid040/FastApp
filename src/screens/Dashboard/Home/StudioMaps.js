import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import mic from '../../../assets/icons/mic.png';
import BackIcon from '../../../assets/icons/back.png'
import RNLocation from 'react-native-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import StarCard from "../../../components/starCard";
import MapDirectionCard from "../../../components/MapDirectionCard";
import SideBar from "../../../components/SideBar";
import ResponsiveText from '../../../components/layout/ResponsiveText';
import axios from 'axios';


const GOOGLE_MAPS_APIKEY = 'AIzaSyB5ukZgNnlKRZDvfM6LV2y6l9HikfZQCb8';

const StudioMaps = (props) => {
  // console.log('props.....', props)
  // const { item, lat, lng } = props?.route?.params
  // console.log('..> ..>', lat, lng)
  // const { latitude = 24.8607, longitude = 67.0011 } = props.route.params
  // let latitude = 24.8607, longitude = 67.0011


  const map = useRef(null);
  const ref = useRef(null);
  const mapDirection = useRef(null);
  const [location, setLocation] = useState(null);
  const [remix, setRemix] = useState(0);
  const [details, setDetails] = useState([])
  const [stopSign, setStopSign] = useState(false)
  const [directions, setDirections] = useState(false)
  const [distance, setDistance] = useState(0)

  const [travelDuration, setTravelDuration] = useState()

  const [val1, setVal1] = useState(null)
  const [val2, setVal2] = useState(null)


  var latitude = 33.6844, longitude = 67.0011

  useEffect(() => {

    RNLocation.configure({ distanceFilter: null });

    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
        rationale: {
          title: "We need to access your location",
          message: "We use your location to show where you are on the map",
          buttonPositive: "OK",
          buttonNegative: "Cancel"
        }
      },
    }).then(granted => {
      console.warn(granted)
      RNLocation.getLatestLocation({ timeout: 60000 })
        .then(locations => {
          console.warn("locations:: ", locations)
          setLocation(locations);
        })
    })
      .catch(err => console.log('error', err));
  }, [remix]);



  useEffect(() => {
    ref.current.setAddressText(props?.route?.params.item.address);
    console.log('props..... >', props.route.params.lat)


    // setVal1(props?.route?.params?.lat)
    // setVal2(props?.route?.params?.lng)
    // setVal1(41.79049477923121)
    // setVal2(-74.73131825945619)

    setVal1(30.1575)
    setVal2(71.5249)
    console.log('props.....>>', val1, val2)

  }, [val1]);


  const onStart = () => {
    setStopSign(!stopSign)
    setDirections(true)
  }
  const onStop = () => {
    setDirections(false)
    setStopSign(!stopSign)
  }
  const locationNotAvailable = () => {
    // if (val1 !== null) {
    //   alert("Directions not available.")
    // }

  }

  return (


    <View style={styles.container}>
      <View style={styles.searchInput}>
        <View style={{ flex: 1 }}>
          <GooglePlacesAutocomplete
            ref={ref}
            placeholder="Enter Location"
            minLength={2}
            autoFocus={false}
            returnKeyType={'default'}
            placeholderTextColor='black'
            fetchDetails={true}
            enablePoweredByContainer={false}
            query={{
              key: 'AIzaSyB5ukZgNnlKRZDvfM6LV2y6l9HikfZQCb8',
              language: 'en',
            }}
            currentLocation={true}
            onPress={(data, details = null) => {
              setDetails(details);

            }}
            filterReverseGeocodingByTypes={[
              'locality',
              'administrative_area_level_1',
            ]}
            GooglePlacesSearchQuery={{
              rankby: 'distance',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
          />
        </View>
      </View>

      <View style={{ width: '100%', height: '100%' }} pointerEvents="none">
        {
          // location && location.latitude &&
          val1 && val2 &&
          <MapView
            style={{ ...StyleSheet.absoluteFillObject }}
            ref={map}
            provider={PROVIDER_GOOGLE}
            followsUserLocation={true}
            // onLayout={onLayout}
            region={{
              latitude: location ? location.latitude : 0,
              longitude: location ? location.longitude : 0,
              latitudeDelta: directions ? 0.0011 : 0.015,
              longitudeDelta: directions ? 0.00021 : 0.0121,
            }}
          >
            <MapViewDirections
              ref={mapDirection}
              origin={{
                latitude: location ? location.latitude : 0,
                longitude: location ? location.longitude : 0,
              }}
              destination={{
                latitude: details.geometry ? details.geometry.location.lat : val1,
                // latitude:33.93911 ,
                longitude: details.geometry ? details.geometry.location.lng : val2,
                // longitude: 67.709953 ,
              }}
              onError={() => locationNotAvailable()}
              // onError={() => console.warn('not found')}
              mode={"DRIVING"}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              optimizeWaypoints={true}
              strokeColor="#0099A2"
              onReady={result => {



                // console.log(`Distance:1`, result.distance, "km")
                // console.log(`duration:1`, result.duration, "min")
                // setTravelDuration(result.duration)


                !directions && map.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: (80),
                    bottom: (20),
                    left: (40),
                    top: (40),
                  }
                });
              }}

            />
            {
              location &&
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
              />
            }

            <Marker
              coordinate={{
                latitude: details.geometry ? details.geometry.location.lat : latitude,
                longitude: details.geometry ? details.geometry.location.lng : longitude,
              }}
            />
          </MapView>
        }


      </View>
      <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={{
        padding: 30,
        alignSelf: 'flex-start',
        position: 'absolute',
        top: 0,
        left: 0,
      }}>
        <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={BackIcon} />
      </TouchableOpacity>


      {details.length !== 0 ? (
        <>
          <MapDirectionCard firstName={details.formatted_address} lat={details.geometry.location.lat} lng={details.geometry.location.lng}
          />
          <SideBar />
        </>) : (
        <>
          <MapDirectionCard firstName={props?.route?.params.item.name} onStart={onStart} stopSign={stopSign} onStop={onStop} lat={val1} lng={val2} />
          <SideBar
          distance={travelDuration}
          />
        </>
      )
      }
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center'
  },
  searchInput: {
    zIndex: 100,
    position: 'absolute',
    top: 80,
    backgroundColor: 'white',
    width: '75%',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    paddingLeft: 30,
    paddingVertical: 18,
  },
  micImage: {
    height: 20,
    width: 20,
    marginRight: 25,
    tintColor: '#8D8D8D',
  },
  currentStyle: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 10,
    // marginTop:100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 5,
    top: '65%'

  }

};

export default StudioMaps;
