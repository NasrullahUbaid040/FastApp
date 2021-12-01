import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import Container from '../../components/layout/Container';
import Content from '../../components/layout/Content';
import AppHeader from '../../components/layout/AppHeader';
import Input from '../../components/layout/Input';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ResponsiveText from '../../components/layout/ResponsiveText';
import { Calendar } from 'react-native-calendars';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageUplaod from '../../services/ImageUplaod'
import API_URL from '../../config/constants'
import Icons from '../../theme/icons';
import Arrow from '../../assets/icons/backArrow.png';
import Button from '../../components/layout/Button';
import axios from 'axios';
import { connect } from 'react-redux';

function AdvertisementInquiry(props) {
  const [name, setName] = useState('');
  const [days, setDays] = useState(0);
  const [showDaysDD, setShowDaysDD] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [bookingStartDate, setBookingStartDate] = useState({});
  const [showCalender, setShowCalender] = useState(false);
  const [budget, setBudget] = useState('');
  const [comment, setComment] = useState('');
  const [response, setResponse] = React.useState({});
  const [uploadImage, setUploadImage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newImg, setNewImg] = useState('')

  let currentDate = new Date();

  const submitAdvert = () => {
    if (!name.length) {
      setErrorMessage("Please enter ad name")
    } else if (name.trim().length == 0) {
      setErrorMessage("Please enter Valid Add name")
    } else if (days == 0) {
      setErrorMessage("Please select no. of days")
    } else if (!bookingStartDate.dateString) {
      setErrorMessage("Please select start date")
    } else if (!budget.length) {
      setErrorMessage("Please enter your budget")
    }
    // else if (!comment.length) {
    //   setErrorMessage("Please enter comments")}
    else if (!uploadImage.length) {
      setErrorMessage("Please upload your banner")
    }
    else {
      setErrorMessage("")

      axios.post(`${API_URL}/advertisement`,
        {
          "name": name,
          "days": days,
          "startDate": bookingStartDate.dateString,
          "budget": budget,
          "comments": comment.length ? comment : " ",
          "bannerImg": uploadImage
        },
        {
          headers: { 'x-auth-token': props.token }
        }).then(res => res.data)
        .then(res => {
          console.log('res:::', res.data)
          Alert.alert(
            "Banner advertisement",
            "Banner has been advertised!",
            [{ text: "OK", onPress: () => props.navigation.goBack() }]
          );

        })
        .catch((err) => {
          console.log('ERROR__::', err)
        });

    }


  }
  const getImageUri = (uploadImage) => {
    console.log('uploadImage....', uploadImage)
    ImageUplaod.UploadmyImage(uploadImage)
      .then(res => res.data)
      .then(res => {
        setUploadImage(res.files[0].Location)
        setNewImg(res.files[0].Location)
        console.log('res__________', res.files[0].Location)
        setBtnLoader(false)
      })
      .catch(err => {
        console.log('error')
        console.log(err);
      })

  }

  return (
    <View style={{ flex: 1 }}>
      <AppHeader onLeftPress={() => props.navigation.goBack()} />
      <Content style={styles.content}>
        <View style={{ flex: 1 }}>
          <Input
            placeholder={'Ad Name'}
            inputStyle={styles.input}
            value={name}
            onChangeText={(e) => setName(e)}
          />


          <View style={[styles.input, styles.dropDown, { position: 'relative' }]}   >
            <ResponsiveText onPress={() => setShowDaysDD(!showDaysDD)}
              style={{
                ...styles.ddText,
                color: `${days === 0 ? 'grey' : '#000'}`,
              }}>
              {days === 0 ? 'Days' : days}
            </ResponsiveText>
            <TouchableOpacity
              style={styles.ddIconContainer}
              activeOpacity={0.9}
              onPress={() => setShowDaysDD(!showDaysDD)}
            >
              {!showDaysDD ? Icons.DropArrow() : Icons.UpArrow()}
              {/* {Icons.UpArrow()} */}
            </TouchableOpacity>
          </View>



          {showDaysDD &&
            <View style={{ backgroundColor: '#E0E0E0', borderRadius: 5, marginBottom: 7 }}>
              {[...Array(10)].map((item, idx) => {
                idx = idx + 1;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.dayItemContainer}
                    activeOpacity={0.8}
                    onPress={() => {
                      setDays(idx);
                      setShowDaysDD(false);
                    }}>
                    <ResponsiveText>{idx}</ResponsiveText>
                  </TouchableOpacity>
                );
              })}
            </View>
          }




          <View style={[styles.input, styles.dropDown]} >
            <ResponsiveText onPress={() => setShowCalender(!showCalender)}
              style={{
                ...styles.ddText,
                color: `${!Object.keys(bookingStartDate).length ? 'grey' : '#000'
                  }`,
              }}>
              {Object.keys(bookingStartDate).length
                ? bookingStartDate.dateString
                : 'Start Date'}
            </ResponsiveText>
            <TouchableOpacity
              style={styles.ddIconContainer}
              activeOpacity={0.9}
              onPress={() => setShowCalender(!showCalender)}>
              {Icons.Calender()}
            </TouchableOpacity>
          </View>

          {showCalender && (
            <View style={{ borderWidth: 0.5, borderRadius: 5, padding: 5, marginBottom: 7 }}>
              <Calendar

                minDate={new Date()}
                onDayPress={(day) => {
                  setBookingStartDate(day);
                  setShowCalender(false);
                }}

                // monthFormat={'yyyy MM'}
                onMonthChange={(month) => {
                }}
                hideArrows={true}


                hideArrows={false}
                hideExtraDays={false}
                disableMonthChange={false}
                hideDayNames={false}
                onPressArrowLeft={(subtractMonth) => subtractMonth()}
                onPressArrowRight={(addMonth) => addMonth()}
                disableArrowLeft={false}
                disableArrowRight={false}
                disableAllTouchEventsForDisabledDays={true}
                renderHeader={(date) => {

                }}
                enableSwipeMonths={true}
              />





              {/* <Calendar
                // style={{ borderRadius: 5 }}
                minDate={new Date()}

                onDayPress={(day) => {
                  setBookingStartDate(day);
                  setShowCalender(false);
                }}
                // onDayLongPress={(day) => {
                //   console.log('selected day', day);
                // }}
                monthFormat={'yyyy MM'}
                onMonthChange={(month) => {
                  // console.log('month changed', month);
                }}
                hideArrows={true}
                hideExtraDays={false}
                disableMonthChange={true}
                hideDayNames={false}
                onPressArrowLeft={(subtractMonth) => subtractMonth()}
                onPressArrowRight={(addMonth) => addMonth()}
                disableArrowLeft={false}
                disableArrowRight={false}
                disableAllTouchEventsForDisabledDays={true}
                renderHeader={(date) => { }}
                // Enable the option to swipe between months. Default = false
                enableSwipeMonths={true}
              /> */}
            </View>
          )}

          <View style={styles.budgetContainer}>
            <ResponsiveText
              style={{
                marginLeft: 8,
                color: '#A5A5A5',
                fontWeight: 'bold',
                marginBottom: 1,
              }}>
              $
            </ResponsiveText>
            <Input
              placeholder={'Budget'}
              inputStyle={styles.budgetField}
              onChangeText={(e) => setBudget(e)}
              value={budget}
              keyboardType={'numeric'}
            />
          </View>
          <Input
            placeholder={'Comments (Optional)'}
            inputStyle={styles.comment}
            multiline={true}
            onChangeText={(e) => setComment(e)}
            value={comment}
            textAlignVertical={'top'}
          />

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
                  // skipBackup: true,
                  // path: 'Pictures/myAppPicture/', //-->this is neccesary
                  privateDirectory: true,
                },
              },
                (response) => {
                  if (response?.uri) {

                    setUploadImage(response.uri)
                    getImageUri(response.uri)
                    setBtnLoader(true)
                  }

                },
              );
            }

            }>
            <ResponsiveText
              style={{
                ...styles.bannerSelectText,
                color: `${Object.keys(response).length === 0 ? 'grey' : '#000'
                  }`,
              }}>
              {uploadImage?.length ? 
              'Banner added':
              'Select banner to upload'}

            </ResponsiveText>
            <View style={styles.addBannerItem}>
              <ResponsiveText style={styles.plusIcon}>+</ResponsiveText>
            </View>
          </TouchableOpacity>
        </View>
        {newImg.length ?
          <Image
            style={styles.bannerImage}
             source={{ uri: newImg }}
          />
          : null}

        {errorMessage.length ?
          <ResponsiveText style={{ color: 'red', marginVertical: 5 }}>{errorMessage}</ResponsiveText>
          : null}

        <Button
          btnContainer={styles.proceedBtnContainer}
          loading={btnLoader}
          title={'Confrim'}
          onPress={() => submitAdvert()}
        />
        <Button
          btnContainer={styles.proceedBtnContainer}
          title={'Proceed to checkout'}
          onPress={() => props.navigation.navigate('Checkout')}
        />
      </Content>


    </View>
  );
}
const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 8,
    backgroundColor: '#fdfdfd',
  },
  bannerImage: {
    width: '100%',
    height: wp('60'),
    borderRadius: 5,

  },
  input: {
    backgroundColor: '#fff',
    elevation: 2,
    height: wp('16'),
    fontWeight: 'bold',
    marginVertical: 0,
    borderRadius: 5,
    zIndex: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    color: '#000',
  },
  commentsContainer: {
    height: wp('50'),
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    marginBottom: 8,
  },
  comment: {
    backgroundColor: '#fff',
    fontWeight: 'bold',
    marginVertical: 0,
    height: wp('50'),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: wp('2%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  dropDown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  ddText: {
    fontWeight: 'bold',
    color: '#000',
    opacity: 1,
    fontSize: 4.3,
    flex: 1,
  },
  ddIconContainer: {
    paddingHorizontal: 10,
  },
  daysItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#bbb',
  },
  daysContainer: {
    position: 'absolute',
    height: 350,
    width: wp('90'),
    // elevation: 2,
    backgroundColor: '#fff',
    // zIndex: 1000000,
    top: wp(67),
    // left: wp(70),
    alignSelf: 'center',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: 'grey',

    // maxHeight: wp('50'),
  },
  daysModalContainer: {
    position: 'absolute',
    height: 350,
    width: wp('90'),
    // elevation: 2,
    // backgroundColor: 'yellow',
    zIndex: 1000000,
    top: 10,
    bottom: 0,
    alignSelf: 'center',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    // maxHeight: wp('50'),
  },
  dayItemContainer: {
    padding: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: wp('80'),
    alignSelf: 'center',
  },
  selectBannerContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    height: wp('16'),
    width: wp('100') - 30,
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
  bannerSelectText: {
    color: '#A5A5A5',
    fontWeight: 'bold',
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
  proceedBtnContainer: {
    height: wp('16'),
    width: wp('100') - 30,
    alignSelf: 'center',
  },
  budgetContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: wp('16'),
    alignItems: 'center',
    width: wp('100') - 32,
    borderRadius: 5,
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
  budgetField: {
    backgroundColor: '#fff',
    height: wp('16'),
    fontWeight: 'bold',
    marginVertical: 0,
    borderRadius: 5,
    zIndex: 0,
    width: wp('100%') - wp('16.5'),
    marginTop: 23,
  },
});

function mapStateToProps(state) {
  return {

    token: state.auth.token,
    userData: state.auth.user,

  }
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvertisementInquiry);
// {/*<Modal*/}
// {/*  testID={'modal'}*/}
// {/*  isVisible={modalVisible}*/}
// {/*  onPress={() => setModalVisible(!modalVisible)}*/}
// {/*  onSwipeComplete={() => setModalVisible(false)}*/}
// {/*  swipeDirection={['down']}>*/}
// {/*  <View*/}
// {/*    style={{*/}
// {/*      alignSelf: 'center',*/}
// {/*      width: wp('90'),*/}
// {/*      height: wp('100'),*/}
// {/*      backgroundColor: '#fff',*/}
// {/*      zIndex: 1000000,*/}
// {/*      borderRadius: 5,*/}
// {/*      padding: 10,*/}
// {/*    }}>*/}
// {/*    <ResponsiveText style={styles.daysItem}>1</ResponsiveText>*/}
// {/*    <ResponsiveText style={styles.daysItem}>2</ResponsiveText>*/}
// {/*    <ResponsiveText style={styles.daysItem}>2</ResponsiveText>*/}
// {/*    <ResponsiveText style={styles.daysItem}></ResponsiveText>*/}
// {/*    <ResponsiveText style={styles.daysItem}>1</ResponsiveText>*/}
// {/*    <ResponsiveText style={styles.daysItem}>1</ResponsiveText>*/}
// {/*    <ResponsiveText style={styles.daysItem}>1</ResponsiveText>*/}
// {/*  </View>*/}
// {/*</Modal>          */}
