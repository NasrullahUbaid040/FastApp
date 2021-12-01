import React, { useState, useRef, useEffect } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList, Alert,
  Image, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native'
import axios from "axios"
// import ImageUplaod from '../../services/ImageUplaod'
import ImageUplaod from '../../../../services/ImageUplaod'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AppHeader from '../../../../components/layout/AppHeader'
import Button from '../../../../components/layout/Button'
import Colors from '../../../../theme/colors'
import Container from '../../../../components/layout/Container'
import CardInput from '../../../../components/CardInput'
import ResponsiveText from '../../../../components/layout/ResponsiveText'
import cross from '../../../../assets/icons/crossclose.png'
import GetLocation from 'react-native-get-location'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


import { setError, updateData } from '../../../../redux/actions/authActions'
import { connect } from 'react-redux';
import API_URL from '../../../../config/constants';


function MyStudio(props) {
  const [studioName, setStudioName] = useState('')
  const [studioAddress, setStudioAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [price, setPrice] = useState('')
  const [service, setService] = useState('')
  const [error, setError] = useState('')
  const [lat, setLat] = useState('41.79049477923121')
  const [lon, setLon] = useState('-74.73131825945619')
  const [dummy, setDummy] = useState('')
  const [data, setData] = useState([])
  const [showButton, setShowButton] = useState(true)
  const [forceRender, setForceRender] = useState(true)
  const [uploadImage, setUploadImage] = useState('');
  const [newImg, setNewImg] = useState('')



  useEffect(() => {
    // console.log('userData..', props.userData.hasStudio)
    if (props.userData.hasStudio && !data.length) {
      getStudioData()}
    getUserLocation()
  }, [])

  const getStudioData = () => {
    axios.post(`${API_URL}/studio/my-studio`, null, {
      headers: { 'x-auth-token': `${props.token}` }
    }).then(res => res.data)
      .then(res => {
        console.log('. .. ............>', res.data.studio.image)
        setNewImg(res.data.studio.image)
        setStudioName(res.data.studio.name)
        setStudioAddress(res.data.studio.address)
        setPhone(res.data.studio.owner.phone.number)
        setPrice((res.data.studio.ratePerDay).toString())
        setData(res.data.studio.services)

      })
      .catch((err) => {
        console.log('ERROR:::', err)
      });

  }
  const getImageUri = (uploadImage) => {
    console.log('uploadImage....', uploadImage)
    ImageUplaod.UploadmyImage(uploadImage)
      .then(res => res.data)
      .then(res => {
        setUploadImage(res.files[0].Location)
        setNewImg(res.files[0].Location)
        console.log('res__________', res.files[0].Location)
        setForceRender(!forceRender)
        // setBtnLoader(false)
      })
      .catch(err => {
        console.log('error')
        console.log(err);
      })

  }
  const userProfile = () => {
    if (studioName.length === 0) {
      setError(
        "Please enter studio name")
    } else if (studioAddress.length === 0) {
      setError(
        "Please enter studio address")
    } else if (phone.length === 0) {
      setError(
        "Please enter phone")
    } else if (price.length === 0) {
      setError(
        "Please enter price")
    }

    else if (data.length === 0) {
      setError(
        "Please enter data")
    }
    else if (newImg.length === 0) {
      setError(
        "Please upload image")
    }
    else {
      setError(" ");
      axios.post(`${API_URL}/studio/add`, {
        name: studioName,
        location: { "lat": lat, "lng": lon },
        type: "STUDIO",
        image: newImg,
        services: data,
        address: studioAddress,
        phone: phone,
        ratePerDay: price
      }, {
        headers: { 'x-auth-token': `${props.token}` }
      }).then(res => {
        console.log(res),
        Alert.alert(
          "Studio updated",
          "Studio has been updated successfully!",
          [{ text: "OK", onPress: () => 
          {console.log(res),
          props.navigation.goBack()} }]
        );
      })
        .catch((err) => {
          console.log('ERROR:::', err)
        });
    }

  };
  const updateData = () => {
    console.log("update called")

    if (studioName.length === 0) {
      setError(
        "Please enter studio name")
    } else if (studioAddress.length === 0) {
      setError(
        "Please enter studio address")
    } else if (phone.length === 0) {
      setError(
        "Please enter phone")
    } else if (price.length === 0) {
      setError(
        "Please enter price")
    }
    else if (data.length === 0) {
      setError(
        "Please enter services")
    }
    else if (newImg.length === 0) {
      setError(
        "Please upload image")
    }
    else {
      setError(" ");
      axios.post(`${API_URL}/studio/edit-my-studio`, {
        name: studioName,
        location: { "lat": lat, "lng": lon },
        type: "STUDIO",
        image: newImg,
        services: data,
        address: studioAddress,
        phone: phone,
        ratePerDay: price
      }, {
        headers: { 'x-auth-token': `${props.token}` }
      }).then(res => {
        // console.log('res on update_______________________', res.data.data),
        Alert.alert(
          "Studio updated",
          "Studio has been updated successfully!",
          [{ text: "OK", onPress: () => props.navigation.goBack() }]
        );
      })
        .catch((err) => {
          console.log('ERROR:::', err)
        });
    }



  }

  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log('location', location)
        setLat(location.latitude)
        setLon(location.longitude)

        // axios.post(`${API_URL}/user/post-location`,
        //   {
        //     "location": {
        //       "lat": location.latitude,
        //       "lng": location.longitude
        //     }
        //   },
        //   {
        //     headers: { 'x-auth-token': props.token }
        //   })
        //   .then(res => {
        //     console.log('location updated>>>>>>>>>', res)




        // })
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }

  const Services = (item) => {
    setService(item)
    const sample = []
    const n = service.search(',')
    if (n > -1) {
      const splitArray = service.split(',')
      splitArray.forEach((i) => {
        const temp = i.trim()
        if (temp.length > 0) {
          sample.push(temp)
          setData(sample)
        }
      })
    }
  };

  const DeleteItem = (i, item) => {
    data.splice(i, 1)
    const concatData = item.concat(',')
    const newstring = service.replace(concatData, '')
    setService(newstring)
    setDummy(dummy + 'a')
  };

  return (
    <Container>
      <AppHeader stat onLeftPress={() => props.navigation.goBack()} onStatClick={() => props.navigation.navigate('DummyScreen')} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView >

          <View style={{ flex: 1, paddingHorizontal: wp(5) }}>
            <View style={{ marginTop: wp(5), flex: 1 }}>
              <Button
                btnContainer={{
                  backgroundColor: Colors.supportWhite, elevation: 8,
                }}
                titleStyle={{
                  color: Colors.Primary,
                }}
                title="My Studio"
                disabled={true}
                onPress={() => {}}
                activeOpacity={1}
              />
              <CardInput
                title="Studio Name"
                placeholder="Enter your name"
                onChangeText={(e) => setStudioName(e)}
                value={studioName}
              />
              <CardInput
                title="Studio Address"
                placeholder="Enter your Address"  
                onChangeText={(e) => setStudioAddress(e)}
                value={studioAddress}
              />
              <CardInput
                title="Phone"
                placeholder="Enter your phone"
                onChangeText={(e) => setPhone(e)}
                value={phone}
                keyboardType="number-pad"
              />
              <CardInput
                title="Price"
                placeholder="Rate / hour"
                onChangeText={(e) => setPrice(e)}
                value={price}
                keyboardType="number-pad"
              />
              <CardInput
                onFocus={() => setShowButton(false)}
                onBlur={() => setShowButton(true)}
                title="Services (Comma Separated)"
                placeholder="Enter services"
                onChangeText={(e) => setName(e)}
                value={service}
                onChangeText={Services}
              />
              <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
                <FlatList
                  data={data}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5,
                      }}
                      >
                        <ResponsiveText>{item}</ResponsiveText>
                        <TouchableOpacity style={{ alignSelf: 'center', backgroundColor: 'black', borderRadius: 10 }} onPress={() => DeleteItem(index, item)}>
                          <Image
                            source={cross}
                            style={{
                              height: 20, width: 20, alignSelf: 'center', tintColor: 'white',
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    )
                  }}
                />
              </ScrollView>
            </View>
            <ResponsiveText style={{ color: 'red' }}>
              {/* {props.ErrorMesassage} */}
              {error}
            </ResponsiveText>


            <TouchableOpacity
            // disabled={true}
            activeOpacity={0.85}
            style={styles.selectBannerContainer}
            onPress={() => {
              launchImageLibrary({
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 200,
                maxWidth: 350,
                storageOptions: { 
                  privateDirectory: true,
                },
              },
                (response) => {
                  if (response?.uri) {

                    setUploadImage(response.uri)
                    getImageUri(response.uri)
                    // setBtnLoader(true)
                  }

                },
              );
            }

            }>
            <ResponsiveText>
             Upload studio image
            </ResponsiveText>
            <View style={styles.addBannerItem}>
              <ResponsiveText style={styles.plusIcon}>+</ResponsiveText>
            </View>
          </TouchableOpacity>

          {newImg.length ?
          <Image
            style={styles.bannerImage}
             source={{ uri: newImg }}
          />
          : null}




<TouchableOpacity
onPress={() => { props.userData.hasStudio ? updateData() : userProfile() }}
style={styles.sendBtn}>
  <ResponsiveText style={styles.title}>{props.userData.hasStudio ? "Update" : "Save"}</ResponsiveText>
</TouchableOpacity>



            {/* {showButton && (
              <Button
                onPress={() => { props.userData.hasStudio ? updateData() : userProfile() }
                }
                btnContainer={{
                  backgroundColor: Colors.Primary,
                }}
                titleStyle={{
                  color: Colors.supportWhite,

                }}
                title={props.userData.hasStudio ? "Update" : "Save"}
              />
            )} */}


          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </Container>
  )
}
const styles = StyleSheet.create({
  selectBannerContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    height: wp('16'),
    width: wp(90),
    alignItems: 'center',
    paddingLeft: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    elevation: 2,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  addBannerItem: {
    height: wp('16'),
    width: wp('16'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D2D2D2',
    borderRadius: 5,
  },
  plusIcon: {
    fontSize: 8,
  },
  bannerImage: {
    width: '100%',
    height: wp('60'),
    borderRadius: 5,

  },
  sendBtn:{
    marginTop:10,
    backgroundColor: Colors.Primary,
    width: wp('100%') - 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: wp('3.5%'),
    borderRadius: wp('1.5%'),
    marginBottom: 8,
  },
  title: {
    color: Colors.BtnText,
    fontSize: 5,
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
  },
})

// export default MyStudio
function mapStateToProps(state) {
  return {

    token: state.auth.token,
    userData: state.auth.user


  }
}

function mapDispatchToProps(dispatch) {
  return {
    setMyError: (payload) => dispatch(setError(payload))

    // loginUser: (payload) => dispatch(loginUser(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyStudio);