import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import Styled from 'styled-components'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import ResponsiveText from './layout/ResponsiveText'
import Colors from '../theme/colors'

const StudioContainer = Styled.TouchableOpacity`
    border-radius:10px;
    elevation:1;
    background-color: #fff;
    margin: 10px 0
`

const StudioImage = Styled.Image`
    height: ${wp('40%')};
    width: ${wp('100%') - 30};
    border-top-right-radius: 10px;
    border-top-left-radius: 10px
`

const StudioInfoContainer = Styled.View`
    padding:0px;
    background-color: #fff;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    margin: 10px
`

const NamePriceContainer = Styled.View`
    align-items:center;
    flex-direction:row;
    justify-content: space-between;
`

const textStyle = {
  fontWeight: 'bold',
  // fontSize: 3.6,
  color: '#000',
}

const addressStyle = {
  fontWeight: '300',
  fontSize: 3.6,
  color: '#bbb',
}

function Studio({
  name, price, address, onPress, image,
}) {
  return (
    <StudioContainer activeOpacity={0.9} onPress={() => onPress()}>
      <StudioImage
        source={{
          uri: image
        }}
      />
      <StudioInfoContainer>
        <NamePriceContainer>
          <ResponsiveText style={textStyle}>{name}</ResponsiveText>

          <ResponsiveText style={{ ...textStyle, color: Colors.Primary }}>
            $
            {price}
            /d
          </ResponsiveText>
        </NamePriceContainer>
        <ResponsiveText style={addressStyle}>{address}</ResponsiveText>
      </StudioInfoContainer>
    </StudioContainer>
  )
}

export default Studio
