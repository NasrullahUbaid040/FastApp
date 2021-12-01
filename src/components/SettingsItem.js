import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ResponsiveText from './layout/ResponsiveText';
import Icons from '../theme/icons';

const Container = Styled.TouchableOpacity`
  width:${wp('100%') - 40}px;
  backgroundColor:#FFFFFF;
  align-self:center;
  border-radius: 10px;
  flex-direction: row;
  padding: 10px;
  margin-vertical: 5px;
  align-items: center
`;

const IconContainer = Styled.View`
  width: 45px;
  height: 45px;
  backgroundColor: #0099A2;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin-right: 12px
`;

const Icon = Styled.Image`
  height: ${wp('6.5')}px;
  width: ${wp('6.5')}px;
  resize-mode: contain;
  tint-color: white
`;

const TextContainer = Styled.View`
  justify-content: space-between;
  padding-vertical: 2px;
  flex:1
`;

const headingStyle = {
  color: '#8D8D8D',
  fontWeight: 'bold',
  fontSize: wp('1.5'),
};

const subHeading = {
  color: '#77869E',
};
function SettingsItem(props) {
  return (
    <Container onPress={props.onPress} activeOpacity={.9}>
      <IconContainer>
        <Icon source={props.icon} />
      </IconContainer>
      <TextContainer>
        <ResponsiveText style={headingStyle}>{props.heading}</ResponsiveText>
        <ResponsiveText style={subHeading}>{props.subHeading}</ResponsiveText>
      </TextContainer>
      {Icons.RightArrow()}
    </Container>
  );
}

export default SettingsItem;
