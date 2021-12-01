import React, { useState, useEffect } from 'react'
import {
  StyleSheet, View, TouchableOpacity, ScrollView, FlatList
} from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Container from '../../../components/layout/Container'
import Content from '../../../components/layout/Content'
import AppHeader from '../../../components/layout/AppHeader'
import Input from '../../../components/layout/Input'
import Icons from '../../../theme/icons'
import ResponsiveText from '../../../components/layout/ResponsiveText'
import Colors from '../../../theme/colors'
import Studio from '../../../components/Studio'
import studio1 from '../../../assets/images/studio1.jpg'
import studio2 from '../../../assets/images/studio2.jpg'
import studio3 from '../../../assets/images/studio3.jpg'
import studio4 from '../../../assets/images/studio4.jpg'
import API_URL from '../../../config/constants';
import axios from "axios"

const StudiosData = [
  {
    name: 'Faisalabad, Punjab , Pakistan',
    price: 499,
    address: 'Faisalabad, Punjab , Pakistan',
    image: studio1,
  },
  {
    name: 'Dreamland Studio',
    price: 750,
    address: '89 Pleasure City: Davis State ',
    image: studio2,

  },
  {
    name: 'Dreamland Studio',
    price: 750,
    address: '89 Pleasure City: Davis State ',
    image: studio3,

  },
  {
    name: 'Dreamland Studio',
    price: 750,
    address: '89 Pleasure City: Davis State ',
    image: studio4,

  },
]

function Studios({ navigation }) {

  const [studios, setStudio] = useState(StudiosData)
  const [showFilter, setShowFilter] = useState(false)
  const [mystudios, setMyStudio] = useState([])
  const [search, setSearch] = useState('')
  const [demo, setDemo] = useState('')

  useEffect(() => {

    getStudios()
  }, [])

  const getStudios = () => {
    axios.post(`${API_URL}/studio/search-studio`,
      // {
      //   "query": 'NY',
      // }
      null
    ).then(res => {
      setMyStudio(res.data.data.studios)

      console.log('.......... api called', res.data.data.studios)
    }).catch((err) => {
      console.log('ERROR=======', err)
    });


  }
  const sortAscending = () => {
    setShowFilter(false)
    let sorting = mystudios.sort((a, b) => {
      let _a = a.ratePerDay;
      let _b = b.ratePerDay;
      return _a - _b;
    })
    console.log('.......... ascending',)
    // setMyStudio([])
    setMyStudio(sorting)
    setDemo(demo + "  ")

  }
  const sortDecending = () => {
    setShowFilter(false)
    let sorting = mystudios.sort((a, b) => {
      let _a = a.ratePerDay;
      let _b = b.ratePerDay;
      return _b - _a;
    })
    console.log('.......... decending')
    setMyStudio([])

    setMyStudio(sorting)
    setDemo(demo + " ")

  }
  const searchStudio = (e) => {
    console.log('search', e)
    axios.post(`${API_URL}/studio/search-studio`,
      {
        "query": e,
      }
    ).then(res => {
      setMyStudio(res.data.data.studios)

    }).catch((err) => {
      console.log('ERROR=======', err)
    });



  }

  return (
    <View style={{ flex: 1 }}>
      <AppHeader onLeftPress={() => navigation.goBack()} />
      <Content>
        <View style={styles.content}>
          <View style={styles.inputFieldContainer}>
            <Input
              placeholder="Discover recording studios"
              value={search}
              // onChange={onTextChange}
              // onChange={(e) => searchStudio()}
              onChangeText={(e) => { setSearch(e), searchStudio(e) }}
              inputStyle={styles.searchField}
              iconContainer={{ left: 5 }}

            />
            <TouchableOpacity
              style={[styles.crossCloseIcon, styles.iconContainer, { right: 5 }]}
              activeOpacity={0.5}
              onPress={() => setSearch('')}
            >
              {Icons.CrossClose({ height: wp(7), width: wp(7) })}
            </TouchableOpacity>
          </View>
          <View style={styles.resultCountContainer}>
            <ResponsiveText style={styles.resultsFountText}>
              {/* 53 Studios Found */}
              {mystudios.length} Studio's Found
            </ResponsiveText>

            <TouchableOpacity
              onPress={() => {
                setShowFilter(!showFilter)
                // onTextChange() 
              }}
            >
              <ResponsiveText
                style={{ ...styles.resultsFountText, color: Colors.Primary }}
              >
                Filter By
              </ResponsiveText>
            </TouchableOpacity>


          </View>

          <View>
            {showFilter &&
              <View style={styles.modalfilter}>
                <TouchableOpacity
                  onPress={() => sortAscending()}
                >
                  <ResponsiveText>Price low to high ↑</ResponsiveText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => sortDecending()}
                >
                  <ResponsiveText>Price high to low ↓</ResponsiveText>
                </TouchableOpacity>
              </View>
            }


            <FlatList
              keyExtractor={(item, index) => `${index}`}
              data={mystudios}
              renderItem={({ item, index }) => {
                return (
                  <Studio
                    key={index}
                    name={item.name}
                    price={item.ratePerDay}
                    address={item.address}
                    image={item.image ? item.image : studio1}
                    // image={studio1}
                    onPress={() => navigation.navigate('StudioDetails', { item })}
                  />
                  // <TouchableOpacity
                  //     onPress={props.onPress}
                  //     style={styles.container}>
                  //   <View style={styles.left}>
                  //     <ResponsiveText style={{...styles.dateText}}>{item.date}</ResponsiveText>
                  //     <ResponsiveText style={{...styles.dateText}}>{item.day}</ResponsiveText>
                  //   </View>
                  //   <View style={{paddingVertical: 20,paddingHorizontal: 15}}>
                  //   <ResponsiveText style={{fontWeight: 'bold'}} >{item.titleText}</ResponsiveText>
                  //   <ResponsiveText style={{color : 'grey',fontSize: 3.5}}>{item.subTitleText}</ResponsiveText>
                  //   </View>
                  // </TouchableOpacity>
                )
              }}
            />




            {/* {studios.map((item, idx) => {
              return (
                <Studio
                  key={idx}
                  name={item.name}
                  price={item.price}
                  address={item.address}
                  image={item.image}
                  onPress={() => navigation.navigate('StudioDetails', { item, latitude: 31.4504, longitude: 73.1350 })}
                />
              )
            })} */}

          </View>
        </View>
      </Content>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 15,
    paddingBottom: 0,
    alignItems: 'center',
  },
  inputFieldContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchField: {
    width: wp(100) - 30,
    height: wp(15),
    padding: 10,
    // paddingLeft: 45,
    paddingLeft: 25,
    paddingRight: 45,
    borderRadius: 15,
  },
  iconContainer: {
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossCloseIcon: {
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: wp(4),
  },
  resultCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(100) - 30,
    marginVertical: 10,
  },
  resultsFountText: {
    fontWeight: 'bold',
    // fontSize: wp('1.3'),
  },
  modalfilter: {
    borderWidth: 0.1,
    padding: 5,
    borderRadius: 1,
    // height: 100,
    // width: 100,
    alignSelf: 'flex-end'
  },
  resultsContainer: {
    width: wp(100) - 30,
  },
})

export default Studios
