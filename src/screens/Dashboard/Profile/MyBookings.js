import React, { useState, useEffect, useRef, } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, FlatList, ScrollView, Alert, Text } from 'react-native';
import Container from '../../../components/layout/Container';
import Content from '../../../components/layout/Content';
import ResponsiveText from '../../../components/layout/ResponsiveText';
import AppHeader from '../../../components/layout/AppHeader';
import Input from '../../../components/layout/Input';
import Icons from '../../../theme/icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Colors from '../../../theme/colors'
import MyBookingCard from '../../../components/MyBookingCard';
import Search from '../../../assets/icons/search.png'
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment'
import API_URL from '../../../config/constants';



const filterTypes = ['In progress', 'Upcoming', 'Completed', 'Rejected']

function MyBookings(props) {

  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const [dumy, setdumy] = useState('')
  const [locationFilterTypeIdx, setLocationFilterTypeIdx] = useState(0)
  const [filterType, setFilterType] = useState("inprogress")
  let _skip = useRef(0);
  let _search = useRef('');
  let _filterType = useRef("inprogress");

  useEffect(() => {
    console.log(props.token)

    if (props?.userData?._type === "Artist" || props?.userData?._type === "Singer") {
      console.log('i am artist')
      getBookingsArtist()
      // } else if (props?.userData?._type === "Singer") {
      //   console.log('i am Singer')
      //   getBookingsArtist()
    } else {
      console.log('i am user')
      getBookingsUser()
    }
  }, [dumy])


  const getBookingsUser = () => {
    console.log("_SKIPP", _skip.current)
    console.log("FILTER TYPE", _filterType.current)
    // axios.post(`${API_URL}/studio/booking/my-bookings/search?skip=${_skip.current}&limit=5&query=${_search.current}`,
    axios.get(`${API_URL}/studio/booking?filter_type=${_filterType.current}&skip=${_skip.current}&limit=5&filter=user`,
      {
        headers: { 'x-auth-token': props.token }
      }).then(res => res.data)
      .then(res => {
        console.log(">>>> ||||| ", res.bookings)

        setData(res.bookings)

        if (_skip.current == 0) {
          setData(res.bookings)
          // console.log('res.data.bookings',res.data.bookings)
        } else {
          const oldData = data
          const newData = res.bookings
          // console.log('...............', [...oldData, ...newData])
          const totalData = [...oldData, ...newData]
          console.log(">>>> ||||| >>>>>  ", totalData)

          setData(totalData)
        }

      })
      .catch(error => {
        console.log('error', error)
      })
  }
  const getBookingsArtist = () => {

    axios.post(`${API_URL}/studio/booking/upcoming`,
      {
        "user": props?.userData._id
      },
      {
        headers: { 'x-auth-token': props.token }
      }).then(res => res.data)
      .then(res => {
        // console.log('res......... ', res)
        setData(res)

      })
      .catch(error => {
        console.log('error', error)
      })
  }

  const SearchKeyword = a => {
    // axios.post(`${API_URL}/studio/booking/my-bookings/search?skip=0&limit=10&query=${a}`, null,
    //   {
    //     headers: { 'x-auth-token': props.token }
    //   }).then(res => res.data)
    //   .then(res => {
    //     setData(res.data.bookings)
    //     // console.log(JSON.stringify(res.data.bookings))s
    //   })



  };

  const loadMoreFeeds = () => {

    if (locationFilterTypeIdx === 0) {
      console.log("NO PAGINATION")
    } else {

      _skip.current = (_skip.current + 5)
      console.log('skip...............', _skip.current)
      console.log('skip...............', _filterType.current)

      getBookingsUser(_filterType.current)
    }
  }


  const changeFilterType = (item, idx) => {
    // _skip.current = 0
    setData([])

    setLocationFilterTypeIdx(idx)
    console.log(idx)
    _skip.current = 0

    if (item === 'In progress') {
      _filterType.current = 'inprogress'
      getBookingsUser()


    } else if (item === 'Upcoming') {

      _filterType.current = 'upcoming'
      getBookingsUser()
    } else if (item === 'Completed') {

      _filterType.current = 'completed'
      getBookingsUser()

    } else if (item === 'Rejected') {
      _filterType.current = 'rejected'
      getBookingsUser()

    }



  }
  return (
    <Container>
      <AppHeader
        onLeftPress={() => props.navigation.goBack()}
        title={'My Bookings'}
      />
      {/*<Content>*/}
      <View style={styles.container}>


        <View style={{ alignItems: 'center', }}>
          <ScrollView contentContainerStyle={styles.filterContainer} horizontal showsHorizontalScrollIndicator={false}>

            {filterTypes.map((item, idx) => {
              return (
                <View style={{}}>
                  <TouchableOpacity
                    key={idx}
                    onPress={() => changeFilterType(item, idx)}
                    style={[
                      styles.filterItem,
                      idx === locationFilterTypeIdx
                        ? styles.filterTypeActive
                        : null,
                    ]}
                  >
                    <ResponsiveText
                      style={[
                        styles.filterText,
                        idx === locationFilterTypeIdx ? { color: '#FFF', } : null,
                      ]}
                    >
                      {item}
                    </ResponsiveText>
                  </TouchableOpacity>
                </View>

              )
            })}
          </ScrollView>
        </View>
        <ResponsiveText style={styles.myBooking}>Bookings</ResponsiveText>

        <FlatList
          contentContainerStyle={styles.flatListStyle}
          keyExtractor={(item, index) => `${index}`}
          data={data}
          onEndReached={() => loadMoreFeeds()}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: 'center', marginVertical: hp(8) }}>
              <ResponsiveText style={{ fontSize: 6, }}>No Data</ResponsiveText>
            </View>
          }
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={props.onPress}
                style={styles.mContainer}>
                <View style={styles.left}>
                  <ResponsiveText style={styles.dateText}>{item.createdAt.slice(8, 10)} </ResponsiveText>
                  <ResponsiveText style={styles.dateText}>{moment(item.createdAt).format("MMM")}</ResponsiveText>
                </View>
                <View style={{ paddingVertical: 20, paddingHorizontal: 15 }}>
                  <ResponsiveText style={{ fontWeight: 'bold' }} >{item?.studio?.name ? item?.studio?.name : item.text}</ResponsiveText>
                  <ResponsiveText style={{ color: 'grey', fontSize: 3.5 }}>{item?.studio?.address ? item?.studio?.address : "$" + item.price}</ResponsiveText>
                </View>
              </TouchableOpacity>
            )
          }}
        />


      </View>
    </Container>
  );
}
const styles = {
  container: {
    flex: 1,
    // padding: 12,
    marginVertical: wp(5),
    // marginHorizontal: wp(2)
  },
  mContainer: {
    flex: 1,
    borderRadius: 5,
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'white',
    elevation: 1,
    backgroundColor: 'white'

  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  left: {
    width: wp(20),
    backgroundColor: '#F3FBFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  dateText: {
    fontWeight: 'bold',
    fontSize: 4,
    color: '#0099A2',
  },
  inputStyle: {
    backgroundColor: '#fff',
    marginTop: 5,
    fontSize: 15,
  },
  myBooking: {
    color: '#3C5063',
    fontWeight: 'bold',
    marginVertical: 10,
    marginTop: 20,
    marginHorizontal: wp(5)
  },
  searchImage: {
    tintColor: 'grey',
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  flatListStyle: {
    marginHorizontal: wp(5)
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    // borderRadius: 30,
    borderWidth: 1,
    // width: wp(100),
    borderColor: 'white',
    height: hp(6.5),
    elevation: 3,
    // borderWidth: 0,
    // marginLeft: 5,
    // marginRight: 5,
    marginVertical: 1,

    // marginLeft: wp(5),
    // marginRight: wp(5),
    // padding: wp(35)
  },

  filterItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(30),


  },
  filterText: {
    color: Colors.Primary,
    fontSize: 3,
    fontWeight: 'bold',
    // width: wp(30),
    textAlign: 'center',


  },
  filterTypeActive: {
    backgroundColor: Colors.Primary,
    // backgroundColor: 'red',
    borderRadius: 10,

  },
};

function mapStateToProps(state) {
  return {

    token: state.auth.token,
    userData: state.auth.user

  }
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyBookings);