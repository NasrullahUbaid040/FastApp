import React from 'react';
import {Image, StyleSheet, View, TouchableOpacity, StatusBar} from 'react-native';
import ResponsiveText from '../../components/layout/ResponsiveText';
import Container from '../../components/layout/Container';
import Colors from '../../theme/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AppHeader from '../../components/layout/AppHeader';
import LinearGradient from "react-native-linear-gradient";
import Content from '../../components/layout/Content';
import Icons from '../../theme/icons';

function TOS({navigation}) {
  return (
    <Container style={styles.container}>
      <AppHeader onLeftPress={()=> navigation.goBack()} />
      <Content style={{flex:1}}>
        <View style={styles.iconRowContainer}>
          {Icons.TOS({
            height: wp(20),
            width: wp(20)
          })}
          <ResponsiveText style={styles.heading}>Terms & Conditions</ResponsiveText>
         </View>
        <ResponsiveText style={styles.text} >
          1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula neque mattis, consectetur elit sed, sagittis dui. Maecenas tristique feugiat tellus non efficitur. Phasellus semper ornare mi
          {'\n\n'}
          2. Id porta tellus varius ut. Curabitur eget dapibus est. Proin vitae convallis leo. Donec molestie convallis lobortis. Vivamus leo lacus, aliquet sed sollicitudin sit amet, mattis id lacus.
          {'\n\n'}
          3.Morbi quis velit ut nulla facilisis varius sit amet quis purus.
          {'\n\n'}
          4. Maecenas at libero mollis, cursus nibh sit amet, bibendum diam. Integer posuere faucibus tempor. Vivamus non sodales dui.
          {'\n\n'}
          5.Quisque et dignissim justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque non est quis orci porttitor fringilla at eget purus. Nam id leo arcu. Aliquam erat volutpat.
          {'\n\n'}
          6.Curabitur ut feugiat est. Cras fringilla posuere posuere. Morbi eu fermentum massa, at vehicula lectus. Nam eget dignissim sapien.
        </ResponsiveText>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconRowContainer:{
    flexDirection:'row',
    alignItems:'center',
    alignSelf:'center',
    marginVertical: 25
  },
  heading:{
    color: '#000',
    fontWeight:'bold',
  },
  text:{
    marginHorizontal: 10,
    fontSize: 3.5
  }
});
export default TOS;
