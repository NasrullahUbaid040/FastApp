import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Colors from '../../theme/colors';
import Icons from '../../theme/icons';
function Input(props) {
  return (
    <View
      style={{ position: 'relative', justifyContent: 'center', marginBottom: 8 }}>

      <TextInput
        returnKeyType={props.returnKeyType}
        {...props}
        ref={(a) => props.reference && props.reference(a)}
        style={[
          styles.input,
          props.icon ? { paddingLeft: 45 } : null,
          props.inputStyle,
        ]}
        onChangeText={(text) => props.onChangeText(text)}
        value={props.value}
        placeholder={props.placeholder}
        hidden={true}
        placeholderTextColor={
          props.placeholderTextColor ? props.placeholderTextColor : 'grey'
        }

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
    height: wp('13%'),
    paddingHorizontal: 10,
    backgroundColor: Colors.Secondary,
    borderRadius: wp('2%'),
    color: '#000',
  },
  iconContainer: {
    position: 'absolute',
    left: 15,

  },
});
export default Input;
