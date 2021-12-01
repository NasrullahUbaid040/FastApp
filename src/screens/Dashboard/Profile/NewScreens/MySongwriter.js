import React, { useState, useRef } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AppHeader from '../../../../components/layout/AppHeader'
import Button from '../../../../components/layout/Button'
import Colors from '../../../../theme/colors'
import Container from '../../../../components/layout/Container'
import CardInput from '../../../../components/CardInput'
import ResponsiveText from '../../../../components/layout/ResponsiveText'
import cross from '../../../../assets/icons/crossclose.png'

function MySongwriter(props) {
  const [name, setName] = useState('')
  const [service, setService] = useState('')
  const [data, setData] = useState([])
  const [showButton, setShowButton] = useState(true)

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
  }

  const DeleteItem = (i, item) => {
    data.splice(i, 1)
    const concatData = item.concat(',')
    const newstring = service.replace(concatData, '')
    setService(newstring)
  }

  return (
    <Container>
      <AppHeader stat onLeftPress={() => props.navigation.goBack()} onStatClick={()=> props.navigation.navigate('DummyScreen')}/>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>

          <View style={{ flex: 1, paddingHorizontal: wp(5) }}>
            <View style={{ marginTop: wp(5), flex: 1 }}>
              <Button
                btnContainer={{
                  backgroundColor: Colors.supportWhite, elevation: 8,
                }}
                titleStyle={{
                  color: Colors.Primary,
                }}
                title="My Songwriter"
                onPress={() => null}
              />
              <CardInput
                title="Songwriter name"
                placeholder="Enter your name"
                onChangeText={(e) => setName(e)}
                value={name}
              />
              <CardInput
                title="Songwriter Address"
                placeholder="Enter your Address"
                onChangeText={(e) => setName(e)}
                value={name}
              />
              <CardInput
                title="Phone"
                placeholder="Enter your phone"
                onChangeText={(e) => setName(e)}
                value={name}
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
            {showButton && (
            <Button
              btnContainer={{
                backgroundColor: Colors.Primary,
              }}
              titleStyle={{
                color: Colors.supportWhite,
              }}
              title="Save"
            />
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </Container>
  )
}
const styles = StyleSheet.create({})

export default MySongwriter
