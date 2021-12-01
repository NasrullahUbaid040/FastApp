import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Colors from '../theme/colors';
import Icons from '../theme/icons';
import ResponsiveText from './layout/ResponsiveText';
function CardInput(props) {
  return (
    <View
      style={{position: 'relative', justifyContent: 'center', marginTop: wp(7)}}>
      <ResponsiveText style={styles.title}>{props.title}</ResponsiveText>
      <TextInput
        {...props}
        style={[
          styles.input,
          props.icon ? {paddingLeft: 45} : null,
          props.inputStyle,
        ]}
        onChangeText={(text) => props.onChangeText(text)}
        value={props.value}
        placeholder={props.placeholder}
        hidden={true}
        placeholderTextColor={"black"}
      />
      {props.icon && (
        <View style={[styles.iconContainer, props.iconContainer]}>
          {props.icon}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: wp('10%'),
    paddingHorizontal: 10,
    // backgroundColor: '#fff',
    borderRadius: wp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.Secondary,
    fontSize: wp('3'),
  },
  iconContainer: {
    position: 'absolute',
    left: 15,
  },
  title: {
    color: "grey",
    marginLeft: 10,
    fontSize: 3,

  },
});
export default CardInput;
