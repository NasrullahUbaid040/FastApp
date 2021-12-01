import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ResponsiveText from './layout/ResponsiveText';
import Button from './layout/Button';
import { useNavigation } from '@react-navigation/native';
function Like(props) {
  const navigation = useNavigation();
  const { item } = props;
  return (
    <View style={style.container}>
      <Image source={{ uri: item?.imgUrl }} style={style.img} />
      <View style={style.infoContainer}>
        <ResponsiveText style={style.username}>{item.username}</ResponsiveText>
        <ResponsiveText style={style.description}>5 km from your location</ResponsiveText>
      </View>
      <TouchableOpacity style={style.btnStyle} activeOpacity={.9} onPress={() => { navigation.navigate("Profile", { likedUserData: item }) }}>
        <ResponsiveText style={{
          color: '#FFF',
          fontWeight: 'bold'
        }}> View Profile</ResponsiveText>
      </TouchableOpacity>
    </View>
  );
}
const style = {
  container: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  img: {
    height: 70,
    width: 70,
    borderRadius: 40,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
  },
  username: {
    color: '#000',
    fontSize: 5,
    fontWeight: 'bold',
  },
  description: {
    color: '#A09E9E',
  },
  btnStyle: {
    backgroundColor: '#0099A2',
    width: wp('30'),
    height: wp(10),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
};
export default Like;
