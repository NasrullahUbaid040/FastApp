import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import ResponsiveText from './layout/ResponsiveText'
import dummyPic from '../assets/images/dummypic.png'
import yellowstar from '../assets/icons/yellowstar.png'
import Colors from '../theme/colors'

const dummyArray = [
  {
    title: 'Remote Recording',
  },
  {
    title: 'Voice Over',
  },

  {
    title: 'Restoration',
  },
  {
    title: 'Music Production',
  },
  {
    title: 'Multi-track Recording',
  },
  {
    title: 'Archieving/Mixing',
  },
]

const Feed = (props) => {
  return (
    <View style={styles.mainView}>
      <View style={styles.subView}>
        <TouchableOpacity style={styles.imageView} onPress={() => { }}>
          <Image source={{ uri: 'https://picsum.photos/id/9/300/300' }} style={styles.imageStyle} />
        </TouchableOpacity>
        <View style={styles.nameView}>
          <ResponsiveText style={{ fontWeight: 'bold', fontSize: 4.5 }}>tommyolson</ResponsiveText>
          <ResponsiveText style={{ fontSize: 3.5 }}>Studio Owner</ResponsiveText>
        </View>
        <View style={styles.starView}>
          <View style={{ flexDirection: 'row' }}>
            {[...Array(5)].map((item, index) => {
              return (
                <Image key={index} source={yellowstar} style={{ height: 18, width: 18 }} />
              )
            })}
            <ResponsiveText style={{ fontWeight: 'bold', paddingLeft: 5 }}>(23)</ResponsiveText>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.serviceButton}>
        <ResponsiveText style={{ paddingVertical: 6, fontWeight: 'bold' }}>Services Included</ResponsiveText>
      </TouchableOpacity>
      <View style={styles.bottomView}>
        {dummyArray.map((item, index) => {
          return (
            <TouchableOpacity style={styles.touchButton} key={index}>
              <ResponsiveText style={{ paddingVertical: 5, paddingHorizontal: 5, fontSize: 3.5 }}>{item.title}</ResponsiveText>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = {
  mainView: {
    width: wp(90),
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: wp(5),
    paddingBottom: wp(2),
    borderRadius: 10,
    elevation: 3,
  },
  subView: {
    flexDirection: 'row',
    paddingTop: wp(2),
    paddingHorizontal: wp(2),
    paddingBottom: wp(3),
  },
  imageView: {
    borderColor: 'purple',
    borderWidth: 2,
    width: wp(12),
    height: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(6),
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  nameView: {
    marginLeft: wp(3),
    justifyContent: 'center',
  },
  starView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  serviceButton: {
    borderColor: Colors.Primary,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: 'center',
  },
  bottomView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: wp(3),
    paddingHorizontal: wp(2),
  },
  touchButton: {
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2.5),
    marginBottom: wp(2),
    borderColor: 'lightgrey',
  },
}

export default Feed
