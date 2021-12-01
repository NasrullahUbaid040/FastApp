import { StyleSheet, View, Image, TouchableOpacity, ImageBackground, Button } from 'react-native';
import ResponsiveText from './layout/ResponsiveText';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icons from '../theme/icons';
import React, { useEffect, useState, useRef } from 'react'
import VideoComponent from '../components/VideoComponent'


import Moment from 'react-moment';
import moment from 'moment';
const NotificationItem = ({ comment, navigation, props }) => {
  // console.log('comment.data>>>>>>>>>>>>>>>', comment)


  return (

    <TouchableOpacity style={styles.container}
      onPress={() => props.navigation.navigate('PostNotification', { data: comment.data.post })} activeOpacity={0.9}
     >

      <View style={styles.row}>


        <View style={{
          width: wp(12), height: 55, alignItems: 'center', justifyContent: 'center',
          // alignSelf: 'center'
        }}>
          <ResponsiveText style={{
            fontSize: wp(0.75)
          }}>
              {moment(comment?.createdAt).fromNow()
              .replace("a few seconds ago", "now")
              .replace("a day ago", "1d")
              .replace("an hour ago", "1h")
              .replace("in ", "")
              .replace("hours", "h")
              .replace("days ago", "d")
              .replace("minutes ago", "m")
              .replace("months ago", "mon")
              .replace("a month ago", "1 mon")
              .replace(" ", "")} 

           </ResponsiveText>
        </View>


        <View>
          <Image
            source={{
              uri: comment?.from?.imgUrl
              // uri: `https://picsum.photos/id/${87}/200/300`,
            }}
            style={styles.dp}
          />
        </View>



        <View style={styles.userInfoContainer}>
          <ResponsiveText style={styles.username}>
            {comment?.from?.username}
          </ResponsiveText>
          <View style={{ flexDirection: 'row' }}>
            {comment.type === 'LIKE' && (
              <>
                <ResponsiveText style={styles.type}>liked </ResponsiveText>
                <ResponsiveText style={{ ...styles.type, color: '#ddd' }}>
                  your video.
                </ResponsiveText>
              </>
            )}



            {comment.type === 'COMMENT' && (
              <View   >
                <ResponsiveText style={{ ...styles.type, color: '#DDD', fontSize: wp(0.75) }}>
                  left a comment on your video:
                </ResponsiveText>
                <ResponsiveText numberOfLines={2} style={{ ...styles.type }}>
                  {comment?.data?.comment?.commentText}
                </ResponsiveText>
              </View>
            )}











            {comment.type === 'MENTION' && (
              <View>
                <ResponsiveText style={{ ...styles.type, color: '#DDD' }}>
                  mentioned you in a comment:
                </ResponsiveText>
                <ResponsiveText style={{ ...styles.type }}>
                  Source: {comment?.data?.data?.comment}
                </ResponsiveText>
                {/* <ResponsiveText style={{ ...styles.type }}>
                  Source: {comment.tags}
                </ResponsiveText> */}
              </View>
            )}

            {comment.type === 'FOLLOW' && (
              <ResponsiveText style={{ ...styles.type, color: '#DDD' }}>
                started following you.
              </ResponsiveText>
            )}



          </View>
        </View>
        <View style={styles.refComponent}>


          <ImageBackground 
            // source={{ uri: comment?.post?.thumbnail }}
            resizeMode="contain"
            source={ 
            comment.type === 'FOLLOW'?
            require('../assets/icons/followed.png')
            :
            {uri:comment?.post?.thumbnail}
            // :comment?.post?.thumbnail
           }
            // source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/2/29/Loader.gif" }}
            style={{
              // width: 55,
              // height: 55,
              resizeMode: "cover",
              overflow: 'hidden',
              // justifyContent: "center",
              alignSelf:'center',
              borderColor: 'grey',
              borderRadius: 2,
              height: comment.type === 'FOLLOW'? 55:55,
              width: comment.type === 'FOLLOW'? 30:55,
            }}>
             
          </ImageBackground></View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dp: {
    height: 55,
    width: 55,
    borderRadius: 35,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginHorizontal: 5,
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  row: {
    // flex: 1,
    flexDirection: 'row',
    // borderBottomWidth: 1,
    borderColor: '#eee',
    // paddingBottom: 8,
    // marginHorizontal: 8,
    // marginBottom: 10,

  },
  timeAgo: {
    color: '#ddd',
    fontSize: 3.5,
    fontWeight: 'bold',
    width: '10%',

  },
  username: {
    // fontSize: 1.3,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 3.5,
    color: '#6D4AD2',
    fontWeight: 'bold',

  },
  refComponent: {
    // justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  refImg: {
    height: 55,
    width: 55,
    borderRadius: 10,
    resizeMode: 'cover',
    marginHorizontal: 10,
  },
});
export default NotificationItem;
