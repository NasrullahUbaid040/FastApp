import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import userProfile from '../assets/icons/user.png';
import lock from '../assets/icons/lock.png';
import phone from '../assets/icons/phone.png';
import email from '../assets/icons/email.png';
import starWithBG from '../assets/icons/star_bg.png';
import facebook from '../assets/icons/facebook.png';
import twitter from '../assets/icons/twitter.png';
import google from '../assets/icons/google.png';
import insta from '../assets/icons/insta.png';
import tick from '../assets/icons/tick.png';
import eye from '../assets/icons/eye.png';
import eye2 from '../assets/icons/eye2.png';
import addStory from '../assets/icons/addStory.png';
import search from '../assets/icons/search.png';
import ratingStar from '../assets/icons/rating-star.png';
import comment from '../assets/icons/comment.png';
import bHeart from '../assets/icons/bHeart.png';
import share from '../assets/icons/share1.png';
import postLike from '../assets/icons/postlike.png';
import redHeart from '../assets/icons/redHeart.png';
import home from '../assets/icons/home.png';
import notification from '../assets/icons/bell.png';
import plus from '../assets/icons/Plus.png';
import following from '../assets/icons/followed.png';
import inbox from '../assets/icons/inbox.png';
import crossClose from '../assets/icons/crossclose.png';
import backArrow from '../assets/icons/backArrow.png';
import peopleGroup from '../assets/icons/people-outline.png';
import post from '../assets/icons/post.png';
import greenCall from '../assets/icons/greenCall.png';
import rightNotch from '../assets/icons/right-payload.png';
import leftNotch from '../assets/icons/left-payload.png';
import sendMessageLeftIcon from '../assets/icons/sendMessageLeftIcon.png';
import emojis from '../assets/icons/Emojis.png';
import send from '../assets/icons/Send.png';
import verified from '../assets/icons/verified.png';
import rightArrow from '../assets/icons/right.png';
import DropArrow from '../assets/icons/Path.png';
import UpArrow from '../assets/icons/PathA.png';
import calender from '../assets/icons/calender.png';
import paypal from '../assets/images/paypal.png';
import apple from '../assets/images/apple.png';
import shareLive from '../assets/icons/shareLive.png';
import headerBackArrow from '../assets/icons/headerBackArrow.png';
import tos from '../assets/icons/terms-and-conditions.png';
import pp from '../assets/icons/privacy-policy.png';
import LogOut from '../assets/icons/LogOut.png';
import Path1 from '../assets/icons/Path1.png'
import Colors from './colors';

const Icons = {
  userProfile: (style = {}) => (
    <Image source={userProfile} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Lock: (style = {}) => (
    <Image source={lock} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Phone: (style = {}) => (
    <Image source={phone} style={{ ...styles.defaultStyle, ...style }} />
  ),
  GreenCall: (style = {}) => (
    <Image source={greenCall} style={{ ...styles.defaultStyle, ...style }} />
  ),
  HeaderBackArrow: (style = {}) => (
    <Image source={headerBackArrow} style={{ ...styles.defaultStyle, ...style, height: wp('5'), width: wp('10') }} />
  ),
  TOS: (style = {}) => (
    <Image source={tos} style={{ ...styles.defaultStyle, ...style }} />
  ),
  LogOut: (style = {}) => (
    <Image source={LogOut} style={{ ...styles.defaultStyle, ...style, height: wp('5'), width: wp('10'), tintColor: 'white' }} />
  ),
  PrivacyPolicy: (style = {}) => (
    <Image source={pp} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Email: (style = {}) => (
    <Image source={email} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Facebook: (style = {}) => (
    <Image source={facebook} style={{ ...styles.defaultStyle, ...style }} />
  ),
  RightArrow: (style = {}) => (
    <Image source={rightArrow} style={{ ...styles.defaultStyle, ...style }} />
  ),
  StarWithBG: (style = {}) => (
    <Image source={starWithBG} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Verified: (style = {}) => (
    <Image source={verified} style={{ ...styles.defaultStyle, ...style }} />
  ),
  PayPal: (style = {}) => (
    <Image source={paypal} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Apple: (style = {}) => (
    <Image source={apple} style={{ ...styles.defaultStyle, ...style }} />
  ),
  SendMessageLeft: (style = {}) => (
    <Image
      source={sendMessageLeftIcon}
      style={{ ...styles.defaultStyle, ...style }}
    />
  ),
  Emojis: (style = {}) => (
    <Image source={emojis} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Send: (style = {}) => (
    <Image source={send} style={{ ...styles.defaultStyle, ...style }} />
  ),

  DropArrow: (style = {}) => (
    <Image
      source={DropArrow}
      style={{
        ...styles.defaultStyle,
        ...style,
        height: wp('4'),
        width: wp('4'),
      }}
    />
  ),
  UpArrow: (style = {}) => (
    <Image
      source={UpArrow}
      style={{
        ...styles.defaultStyle,
        ...style,
        height: wp('4'),
        width: wp('4'),
      }}
    />
  ),
  Calender: (style = {}) => (
    <Image
      source={calender}
      style={{
        ...styles.defaultStyle,
        ...style,
        height: wp('5'),
        width: wp('5'),
      }}
    />
  ),
  Twitter: (style = {}) => (
    <Image source={twitter} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Google: (style = {}) => (
    <Image source={google} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Insta: (style = {}) => (
    <Image source={insta} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Tick: (style = {}) => (
    <Image source={tick} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Eye: (style = {}) => (
    <Image source={eye} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Eye2: (style = {}) => (
    <Image source={eye2} style={{ ...styles.defaultStyle, ...style }} />
  ),
  RightPayloadNotch: (style = {}) => (
    <Image source={rightNotch} style={{ ...styles.defaultStyle, ...style }} />
  ),
  LeftPayloadNotch: (style = {}) => (
    <Image source={leftNotch} style={{ ...styles.defaultStyle, ...style }} />
  ),
  AddStory: (style = {}) => (
    <Image source={addStory} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Search: (style = {}) => (
    <Image source={Path1} style={{ ...styles.defaultStyle, ...style }} />
  ),
  RatingStar: (style = {}) => (
    <Image source={ratingStar} style={{ ...styles.defaultStyle, ...style }} />
  ),
  PeopleGroup: (style = {}) => (
    <Image source={peopleGroup} style={{ ...styles.defaultStyle, ...style }} />
  ),
  PushPost: (style = {}) => (
    <Image source={post} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Like: (style = {}) => (
    <Image
      source={postLike}
      style={{ ...styles.defaultStyle, ...style, tintColor: '#000' }}
    />
  ),
  LikeWhiteBorder: (style = {}) => (
    <Image
      source={postLike}
      style={{
        ...styles.defaultStyle,
        ...style
      }}
    />
  ),

  ShareLive: (style = {}) => (
    <Image
      source={shareLive}
      style={{
        ...styles.defaultStyle,
        ...style,

      }}
    />
  ),
  Share: (style = {}) => (
    <Image source={share} style={{ ...styles.defaultStyle, ...style, }} />
  ),
  CrossClose: (style = {}) => (
    <Image source={crossClose} style={{ ...styles.defaultStyle, ...style }} />
  ),
  BackArrow: (style = {}) => (
    <Image source={backArrow} style={{ ...styles.defaultStyle, ...style }} />
  ),
  Following: (style = {}) => (
    <Image
      source={following}
      style={{
        ...styles.defaultStyle,
        ...style,
        height: wp('9'),
        width: wp('9'),
      }}
    />
  ),
  Comment: (style = {}) => (
    <Image source={comment} style={{ ...styles.defaultStyle, ...style }} />
  ),
  bHeart: (style = {}) => (
    <Image source={bHeart} style={{ ...styles.defaultStyle, ...style }} />
  ),
  RedHeart: (style = {}) => (
    <Image
      source={redHeart}
      style={{ ...styles.defaultStyle, ...style, tintColor: '#98003a' }}
    />
  ),
  Home: (style = {}) => (
    <Image source={home} style={{ ...styles.tabBar, ...style }} />
  ),
  Notification: (style = {}) => (
    <Image source={notification} style={{ ...styles.tabBar, ...style }} />
  ),
  AddPost: (style = {}) => (
    <Image
      source={plus}
      style={{
        ...styles.tabBar,
        ...style,
        tintColor: Colors.Primary,
      }}
    />
  ),
  Inbox: (style = {}) => (
    <Image source={inbox} style={{ ...styles.tabBar, ...style }} />
  ),
};
const styles = StyleSheet.create({
  defaultStyle: {
    height: wp('5%'),
    width: wp('5%'),
    resizeMode: 'contain',
  },
  tabBar: {
    height: wp('7%'),
    width: wp('7%'),
    resizeMode: 'contain',
  },
});
export default Icons;
