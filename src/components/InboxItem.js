import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Styled from 'styled-components';
import ResponsiveText from './layout/ResponsiveText';
import moment from 'moment';

const StudioImage = Styled.Image`
    height: ${wp('15')}px;
    width: ${wp('15')}px;
    border-radius: ${wp('10')}px;
`;

function InboxItem({ isOnline, message, timeAgo, onPress, statusCount, userData, type }) {
  // console.log("statusCount >>>>>>>", statusCount)

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.container,
        { borderLeftWidth: 5, borderLeftColor: 'transparent' },

        statusCount
          ? {
            backgroundColor: '#F3F4F9',
            borderLeftColor: '#0099A2',
          }
          : null,
      ]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={{ position: 'relative' }}>
        <StudioImage
          source={{
            uri:
              userData.imgUrl
            //  `https://picsum.photos/id/${Math.floor(
            //   Math.random() * Math.floor(45),
            // )}/200/300`,
          }}
        />
        {
          isOnline && <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: '#84C857',
              position: 'absolute',
              right: 0,
              top: 3,
              borderWidth: 2,
              borderColor: '#FFF',
            }}
          />
        }
      </View>
      <View style={styles.infoContainer}>
        <ResponsiveText style={styles.username}>{userData.username}</ResponsiveText>
        <ResponsiveText numberOfLines={1} style={styles.message}>{type == "image" ? "🌄 Photo " : message}</ResponsiveText>
      </View>

      <View style={styles.timeContainer}>
        {/* <ResponsiveText style={{ ...styles.message }}>{timeAgo}</ResponsiveText> */}
        <ResponsiveText style={{ fontSize: 2, color: 'grey', alignItems: 'flex-end' }}>{moment(timeAgo).fromNow()}</ResponsiveText>



      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp('100'),
    height: wp('20'),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  infoContainer: {
    marginHorizontal: 5,
    width: wp('60'),
    // backgroundColor: 'red'
  },
  username: {
    fontWeight: 'bold',
    fontSize: 4.8,
  },

  message: {
    color: '#aaa',
    fontWeight: '200',
    fontSize: 3.5,


  },
  timeContainer: {
    alignItems: 'flex-end',
    // right: 10,
    // paddingHorizontal: 10,
    width: wp(15),
    overflow: 'hidden',
    // backgroundColor: 'red'
  },
});
export default InboxItem;
