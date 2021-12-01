import {
  Image, TouchableOpacity, View, ScrollView,
} from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import React from 'react'
import ResponsiveText from '../../../../components/layout/ResponsiveText'
import Colors from '../../../../theme/colors'
import AppHeader from '../../../../components/layout/AppHeader'
import dots from '../../../../assets/icons/dots.png'

const JobCard = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader onLeftPress={() => props.navigation.goBack()} stat onStatClick={() => props.navigation.navigate('DummyScreen')} />
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        {[...Array(5)].map((item, index) => {
          return (
            <View
              key={index}
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
                margin: 15,
                borderRadius: wp('2%'),
                backgroundColor: '#fff',
                marginHorizontal: 15,
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: wp(4),
                paddingHorizontal: wp(3.5),
              }}
              >
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                >
                  <Image
                    source={{ uri: 'https://deadline.com/wp-content/uploads/2019/11/bella-thorne-e1572896743187.jpg' }}
                    style={{
                      height: wp(10),
                      width: wp(10),
                      borderRadius: wp(5),
                    }}
                  />
                  <View style={{
                    marginLeft: 10,
                  }}
                  >
                    <ResponsiveText style={{
                    // fontFamily:
                    // color:Colors.
                      fontSize: 3.5,
                      fontWeight: 'bold',
                    }}
                    >
                      Rokker Marven
                    </ResponsiveText>
                    <ResponsiveText style={{
                      fontSize: 3,
                      color: 'grey',
                    }}
                    >
                      10 Sep,2020
                    </ResponsiveText>
                  </View>
                </View>
                <Image
                  source={dots}
                  style={{
                    height: wp(10),
                    width: wp(10),
                    borderRadius: wp(5),
                  }}
                />
              </View>
              <ResponsiveText
                numberOfLines={4}
                style={{
                  paddingLeft: wp(15),
                  paddingRight: wp(8),
                  fontSize: 3.5,
                  paddingBottom: 10,
                }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </ResponsiveText>

              <TouchableOpacity
                style={{
                  backgroundColor: Colors.Primary,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: wp('12%'),
                  borderRadius: wp('2%'),
                  paddingHorizontal: 10,
                }}
                activeOpacity={0.9}
                onPress={() => null}
              >
                <ResponsiveText style={{
                  color: Colors.BtnText,
                  fontSize: 3.5,
                  fontWeight: 'bold',
                }}
                >
                  Completed on 19 Sep,2020
                </ResponsiveText>
                <ResponsiveText style={{
                  color: Colors.BtnText,
                  fontSize: 3.5,
                  fontWeight: 'bold',
                }}
                >
                  $499
                </ResponsiveText>
              </TouchableOpacity>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default JobCard
