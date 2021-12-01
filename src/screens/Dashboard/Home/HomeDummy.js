import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  Button,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  BackHandler,
  ToastAndroid,
  Alert,
} from 'react-native'
import Share from 'react-native-share';
import Styled from 'styled-components'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Video from 'react-native-video'
import { TextInput } from 'react-native-gesture-handler'
import Container from '../../../components/layout/Container'
import Content from '../../../components/layout/Content'
import AppHeader from '../../../components/layout/AppHeader'
import StoryItem from '../../../components/StoryItem'
import Icons from '../../../theme/icons'
import ResponsiveText from '../../../components/layout/ResponsiveText'
import Colors from '../../../theme/colors'
import CommentDisplay from '../../../components/CommentDisplay'
import Search from '../../../assets/icons/search.png'
import Feed from '../../../components/Feed'
import { connect, useSelector } from 'react-redux';
import axios from "axios"
import API_URL from '../../../config/constants';
import VideoComponent from '../../../components/VideoComponent'
import moment from 'moment'
import ActivityLoader from '../../../components/ActivityLoader'
import { useFocusEffect } from "@react-navigation/native";
import GetLocation from 'react-native-get-location'
import Socket from '../../../sockets/Sockets'
import { EVENTS } from '../../../sockets/Constant'
import firestore from '@react-native-firebase/firestore';
import OneSignal from 'react-native-onesignal'
import FastTrackHome from './FastTrackHome'
import Peer from '../Post/Peer';
import InViewPort from '../../../components/InViewPort'
import VideoPlayer from '../../../components/VideoPlayer';

const filterTypes = ['Feed', 'Popular', 'Recommended', 'Nearby']


const AdvertiseHereText = Styled.Text`
    color: white;
    font-size: 25px;
    font-weight: bold
  `

function Home(props) {

  const { navigation } = props
  const startCount = ['', '', '', '', '']
  const [locationFilterTypeIdx, setLocationFilterTypeIdx] = useState(0)
  const [videoLoadData, SetVideoLoadData] = useState({})
  const [comment, setComment] = useState('')
  const [commentFoucsed, setCommentFocused] = useState(false)
  const [userPostData, setUserPostData] = useState([])
  const [advertisement, setAdvertisement] = useState({})
  const [myStories, setMyStories] = useState([])
  const [refreshing, setRefreshing] = React.useState(false);
  const [noDataFound, setNoDataFound] = useState(false)
  const [postLoading, setPostLoading] = useState(false)
  const [postLoading2, setPostLoading2] = useState(false)
  const [isSent, setisSent] = useState(true)
  const [forceUpdate, setForceUpdate] = useState(false)
  const [name, setName] = useState('');
  const [country, setCountry] = useState('New York');
  const [temp, settemp] = useState();
  const [activeUsers, setActiveUsers] = useState([])
  const [videoPaused, setVideoPaused] = useState(true)
  const [checkDataLoading, setCheckDataLoading] = useState(false)
  const [noMoreData, setNoMoreData] = useState(false)
  // const [isPlaying, setIsPlaying] = useState(false)

  let DummyData = [
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2812",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2834",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2856",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2878",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2890",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2891",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2899",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2809",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c28025",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c28112",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c28113",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c28114",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c281141",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c281142",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c281143",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c281144",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c281145",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c281146",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c281147",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c281148",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c281149",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2811410",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2811411",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2811412",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },
    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2811413",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    }, {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2811414",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },

    {
      // "likedby": [

      // ],
      // "sharedBy": [

      // ],
      // "comments": [

      // ],
      // "postedAt": "2021-10-29T09:59:13.787Z",
      "_id": "617c0d4272f6700016d91c2811415",
      "fileType": "video",
      "fileUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.mp4",
      "description": "bshshsh",
      "thumbnail": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1635519806056.png",
      // "by": {
      //   "phone": {
      //     "code": "+9",
      //     "number": "123456789"
      //   },
      //   "imgUrl": "https://fast-app-storage.s3.us-east-2.amazonaws.com/file-1622455725748.png",
      //   "_type": "Singer",
      //   "hasStudio": false,
      //   "bio": "",
      //   "memberships": [

      //   ],
      //   "followers": 0,
      //   "plans": [

      //   ],
      //   "bookings": [

      //   ],
      //   "myVideos": [

      //   ],
      //   "tags": [

      //   ],
      //   "enableLocation": true,
      //   "enableNotifications": true,
      //   "enableEmailUpdates": true,
      //   "type": "FAST",
      //   "hasSongWriter": false,
      //   "one_signal": "c124afa0-5c9e-451d-950c-719f36ef181a",
      //   "rating": 0,
      //   "totalRatings": 0,
      //   "reviews": [

      //   ],
      //   "available": true,
      //   "isVerified": false,
      //   "is_live": false,
      //   "followings": [

      //   ],
      //   "online": false,
      //   "posts": 0,
      //   "_id": "617ba4e8a8ce240016a7797a",
      //   "username": "test6",
      //   "email": "test6@test.com",
      //   "loginType": "local",
      //   "createdAt": "2021-10-29T07:38:16.824Z",
      //   "updatedAt": "2021-10-29T15:12:39.788Z",
      //   "__v": 0,
      //   "last_seen": "2021-10-29T15:12:39.788Z",

      // },
      "createdAt": "2021-10-29T15:03:30.415Z",
      "updatedAt": "2021-11-01T10:29:51.822Z",
      "__v": 0,
    },


  ]


  const _posts = useRef([])
  let _skip = useRef(0);
  let _player = useRef()
  const cellRefs = useRef(false)
  let currentCount = 0;
  useEffect(() => {
    getDeviceState()
    console.log('props______________________', props.token)
    console.log('props.userData._id____', props.userData._id)

    OneSignal.setNotificationOpenedHandler(openedEvent => {
      console.log("OneSignal: notification opened....................>", openedEvent);
      if (openedEvent.notification.additionalData.type === "LIKE") {
        console.log('going to notification screen')
        navigation.navigate('NotificationStack', { screen: 'PostNotification', params: { data: openedEvent.notification.additionalData.data.post } });

      } else if (openedEvent.notification.additionalData.type === "COMMENT") {
        console.log('error')
        navigation.navigate('NotificationStack', { screen: 'PostNotification', params: { data: openedEvent.notification.additionalData.data.post } });
      }
      const { action, notification } = openedEvent;
    });

  }, [])


  const getDeviceState = async () => {
    const state = await OneSignal.getDeviceState()
    // console.log('deviceState.............................>', state.userId);
    postoneSignalId(state.userId)

  }
  const postoneSignalId = (deviceState) => {
    axios.post(`${API_URL}/user/set-oneSignal-Id`,
      {
        "one_signal": deviceState
      },
      {
        headers: { 'x-auth-token': props.token }
      })
      // .then(res => {})
      .catch(error => {
        console.log('error', error)
      })


  }
  useFocusEffect(
    React.useCallback(() => {
      // console.log(props?.userData?._id)
      Socket.myEstablishFunc(props?.userData?._id)
      Socket.socket.on(EVENTS.ESTABLISH_CONNECTION, data =>
        console.log('')
      )
      Socket.socket.on(EVENTS.LIKE, ({ post }) => {
        const index = _posts.current.findIndex(item => item._id == post._id)
        if (index == -1) return;
        const newPosts = [..._posts.current];
        newPosts[index] = post;
        _posts.current = newPosts;
        setName(name + '   ')
      })

      Socket.socket.on(EVENTS.USERS, (data) => {
        setActiveUsers(Object.keys(data))
      })

      getUserLocation()
      getMyStories()
      getAdvertisement()
      getMyFeeds()


      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, [])
  );


  const likemypost = (id) => {
    Socket.postLike(props?.userData?._id, id)
    setName(' ')
  }
  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        axios.get(`http://api.geonames.org/countryCodeJSON?lat=${location.latitude}&lng=${location.longitude}&username=demo123`).then(res => {
          console.log('>>>>>', res.data.countryCode)
          setCountry(res.data.countryName + " " + res.data.countryCode)
          axios.post(`${API_URL}/user/post-location`,
            {
              "location": {
                "lat": location.latitude,
                "lng": location.longitude,
                "name": res.data.countryCode,
                "country": res.data.countryName,
              }
            },
            {
              headers: { 'x-auth-token': props.token }
            })
        })
          .then(res => {
            console.log('location updated', res)
          })
      })
      .catch(error => {
        console.log('error', error)
      })
  }
  const getMyFeeds = () => {
    axios.get(`${API_URL}/post/feed?skip=${_skip.current}&limit=5`,
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => {
        // console.log(">>>>>>>>>>>>>>>>>>", JSON.stringify(res.data))
        setPostLoading(false)

        if (!res.data.length) {
          console.log('object')
        } else {

          setNoDataFound(false)

          let FILTER_DATA = res.data.map((item) => {
            return {

              "_id": item._id,
              "fileType": item.fileType,
              "fileUrl": item.fileUrl,
              "description": item.description,
              "thumbnail": item.thumbnail,
              "createdAt": item.createdAt,
              "updatedAt": item.updatedAt,
              "__v": item.__v,
              "by": {
                "imgUrl": item.imgUrl,
                "_type": item._type,
                "hasStudio": item.hasStudio,
                "followers": item.followers,
                "plans": item.plans,
                // "enableLocation": true,
                // "enableNotifications": true,
                // "enableEmailUpdates": true,
                "type": item.type,
                "hasSongWriter": item.hasSongWriter,
                "one_signal": item.one_signal,
                "rating": item.rating,
                "totalRatings": item.totalRatings,
                "reviews": item.reviews,
                "available": item.available,
                "isVerified": item.isVerified,
                // "is_live": false,
                "followings": item.followings,
                // "online": false,
                "posts": item.posts,
                "_id": item._id,
                "username": item.username,
                "email": item.email,
                "loginType": item.loginType,
                // "createdAt": "2021-10-29T07:38:16.824Z",
                // "updatedAt": "2021-10-29T15:12:39.788Z",
                // "__v": 0,
                // "last_seen": "2021-10-29T15:12:39.788Z"

              }
            }
          })

          console.log("DATAA MAP )))(009", FILTER_DATA)


          if (_skip.current == 0) {
            _posts.current = FILTER_DATA
            setUserPostData(_posts.current)
            setPostLoading2(true)
          } else {
            setPostLoading2(true)
            const temp = _posts.current
            const newData = res.data
            _posts.current = [..._posts.current, ...FILTER_DATA]
            setUserPostData(_posts.current)
          }
          // console.log('_posts.current..........>', _posts.current)

        }
        setUserPostData(res.data)
      })
      .catch((err) => {
        console.log('ERROR:-_-_-_', err)
      });
  }
  const getMyStories = () => {
    axios.get(`${API_URL}/user/story`,
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => {
        setMyStories(res.data.stories)
        // console.log('myStories____________', res.data.stories)
      })
      .catch((err) => {
        console.log('ERROR___ getMyStories__-_', err.res)
      });
  }
  const getAdvertisement = () => {
    axios.get(`${API_URL}/advertisement`,
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => res.data)
      .then(res => {
        setAdvertisement(res)
        console.log('advert====>', advertisement)
      })
      .catch((err) => {
        console.log('ERROR', err.res)
      });
  }
  const toggleLike = (idx) => {
    posts[idx].likes.liked = !posts[idx].likes.liked
    const likes = posts[idx].likes.liked
      ? parseInt(posts[idx].likes.total) + 1
      : parseInt(posts[idx].likes.total) - 1
    posts[idx].likes.total = likes.toString()
    setPosts([...posts])
  }
  const onVideoLoad = (e) => {
    SetVideoLoadData(e)
  }
  const onSend = () => {
    if (!comment.length) {
      return
    }
    const temp = commentsDS
    temp.push({
      username: 'Jack S.',
      text: comment,
    })
    setCommentsDS([...temp])
    setComment('')
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => {
      _skip.current = 0,
        setRefreshing(false)
      //
      _skip.current = 0
      _posts.current = []
      setUserPostData([])
      //
      getMyFeeds()
    }
    );
  }, []);
  const wait = (timeout) => {
    setMyStories([])
    getMyStories()
    getAdvertisement()
    getMyFeeds()
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onViewRef = React.useRef(({ viewableItems }, index) => {
    // console.log('viewableItems:::', viewableItems)
    console.log('Index:::', index)

    if (viewableItems && viewableItems.length > 0) {
      console.log('viewableItems____', viewableItems[0].index)
      settemp(viewableItems[0].index)
    }
  })
  const loadMoreFeeds = () => {
    Alert.alert("oooo")
    _skip.current = (_skip.current + 5)
    console.log('skip...............', _skip.current)
    getMyFeeds()
  }
  // const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  //   const paddingToBottom = 20;
  //   return layoutMeasurement.height + contentOffset.y >=
  //     contentSize.height - paddingToBottom;

  // };
  const backAction = () => {
    setTimeout(() => {
      currentCount = 0
    }, 2000); // 2 seconds to tap second-time

    currentCount = (currentCount + 1)
    if (currentCount == 2) {

      console.log("currentCount", currentCount)
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
    }
    return true;

  };
  const onShare = async (id) => {

    const shareOptions = {
      title: 'FAST',
      message: `https://www.fastappss.com/post/${id}`,
      failOnCancel: true
    }


    Share.open(shareOptions)
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(a => {
        console.log("object a:", a)
      })

  };
  const countShare = (id) => {
    axios.post(`${API_URL}/post/share`,
      {
        "user": props.userData._id,
        "comment": "6093b6560087f911b8823cec",
        "post": id
      },
      {
        headers: { 'x-auth-token': props.token }
      }).then(res => {
        console.log('Share count ', res)



      })
      .catch(error => {
        console.log('error', error)
      })
  }

  const _onViewableItemsChanged = (props) => {
    // const changed = props.changed;
    console.log('propsssss from video', props)
    // changed.forEach((item) => {
    //   const cell = this.cellRefs[item.key];
    //   if (cell) {
    //     if (item.isViewable) {
    //       cell.play();
    //     } else {
    //       cell.pause();
    //     }
    //   }
    // });
  };
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };




  return (
    <View style={{ flex: 1 }}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={{ backgroundColor: '#EEEFF6' }}
        // onScroll={({ nativeEvent }) => {
        //   if (isCloseToBottom(nativeEvent)) {
        //     setPostLoading(true)
        //     if (postLoading2 == true) {
        //       loadMoreFeeds()
        //       setPostLoading2(false)
        //     }
        //   }
        // }}
        // scrollEventThrottle={0.001}
        onMomentumScrollEnd={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {

            try {
              if (!noMoreData) {
                if (!checkDataLoading) {
                  console.log("THIS IS PAGINATION !!!")
                  setCheckDataLoading(true)


                  _skip.current = (_skip.current + 5)

                  axios.get(`${API_URL}/post/feed?skip=${_skip.current}&limit=5`,
                    {
                      headers: { 'x-auth-token': props.token }
                    })
                    .then(res => {

                      if (!res.data.length) {
                        setNoMoreData(true)
                      }

                      setCheckDataLoading(false)

                      _posts.current = [..._posts.current, ...res.data]
                      setUserPostData(_posts.current)


                    }).catch((errorMessage) => {
                      Alert.alert(errorMessage)
                    })




                }
              }
            }
            catch (e) {
              console.log("llo", e)
            }

          }

        }
        }

        scrollEventThrottle={1}


        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.subContent}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.storyContainer}
          >

            <TouchableOpacity
              style={{ height: 68, width: 68, backgroundColor: Colors.Primary, borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}
              //Peer
              onPress={() => { props.navigation.navigate('Peer') }}>
              <ResponsiveText style={{ color: 'white' }}>Go Live</ResponsiveText>
            </TouchableOpacity>

            <StoryItem
              border={false}
              // uri="https://picsum.photos/id/1/200/300"
              uri={props?.userData?.imgUrl}
              onPress={() => navigation.navigate('CreateStory')}
            />

            <FlatList
              data={myStories}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id + Date.now()}
              // numColumns={3}
              horizontal={true}

              renderItem={({ item, index }) => {
                return (
                  <View>
                    {item?.thumbnail &&
                      <View style={{ backgroundColor: 'rgba(0,0,0,.3)', height: 68, width: 68, borderRadius: 40, marginRight: 8, }}>
                        <TouchableOpacity
                          onPress={() => {
                            // console.log(item)
                            item.type == "live" ?
                              navigation.navigate('StreamViewer', { liveData: item }) :
                              navigation.navigate('StoryView', { storyData: myStories, selectedindex: index })
                          }

                          }
                          key={index}>


                          <Image
                            style={[styles.storyCircle, { borderColor: item.type == "live" && 'blue' }]}
                            source={{ uri: item.type == "live" ? item._user.imgUrl : item?.thumbnail }}
                          />

                        </TouchableOpacity>
                      </View>
                    }
                  </View>
                )
              }}
            />
          </ScrollView>


          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.advertisementContainer}
            onPress={() => navigation.navigate('AdvertisementInquiry')}
          >

            <ImageBackground
              // :TODO: enable advertisement?.ad?.bannerImg
              source={{ uri: advertisement?.ad?.bannerImg ? advertisement?.ad?.bannerImg : 'https://www.ipr.edu/wp-content/uploads/2020/02/music-studio-768x432.jpg' }}
              // source={{ uri: 'https://www.ipr.edu/wp-content/uploads/2020/02/music-studio-768x432.jpg' }}
              style={styles.advertiseImg}
            >
              <View style={styles.advertiseOverlay}>
                <ResponsiveText style={styles.adverts}>{advertisement?.ad?.comments}</ResponsiveText>
              </View>
            </ImageBackground>
          </TouchableOpacity>



          {props?.userData?._type === "Artist" || props?.userData?._type === "Singer" ?
            null
            :

            <View style={styles.locatedStudioContainer}>
              <ImageBackground
                source={require('../../../assets/images/Rectangle.png')}
                style={styles.locatedStudioImg}
              >
                <View style={styles.locatedStudioOverlay}>
                  <TouchableOpacity
                    style={styles.searchStudio}
                    onPress={() => navigation.navigate('Studios')}
                    activeOpacity={0.9}
                  >
                    <View>
                      <ResponsiveText style={{ color: '#BBB', fontSize: wp(0.8) }}>
                        Discover recording studios or songwriters
                      </ResponsiveText>

                    </View>
                    <Image style={{ width: 18, height: 18, tintColor: 'grey' }} source={Search} />

                  </TouchableOpacity>
                  <ResponsiveText style={{ ...styles.subHeading, marginTop: 20, fontSize: 3.5 }}>
                    Studio Location
                  </ResponsiveText>
                  <ResponsiveText style={styles.adverts}>{country}</ResponsiveText>
                </View>


              </ImageBackground>
            </View>
          }


          <View style={{ alignItems: 'center', }}>
            <ScrollView contentContainerStyle={styles.filterContainer} horizontal showsHorizontalScrollIndicator={false}>

              {filterTypes.map((item, idx) => {
                return (
                  <View style={{}}>
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setLocationFilterTypeIdx(idx)}
                      style={[
                        styles.filterItem,
                        idx === locationFilterTypeIdx
                          ? styles.filterTypeActive
                          : null,
                      ]}
                    >
                      <ResponsiveText
                        style={[
                          styles.filterText,
                          idx === locationFilterTypeIdx ? { color: '#FFF' } : null,
                        ]}
                      >
                        {item}
                      </ResponsiveText>
                    </TouchableOpacity>
                  </View>

                )
              })}
            </ScrollView>
          </View>

          {props?.userData?._type === "Artist" || props?.userData?._type === "Singer" ?
            <FastTrackHome />
            :
            <View style={{ flex: 1 }}>
              {noDataFound ?
                <View style={{ alignItems: 'center' }}>
                  <ResponsiveText>No data</ResponsiveText>
                </View>
                : !_posts.current.length ? <ActivityLoader /> :
                  <FlatList
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={2}
                    // onViewableItemsChanged={_onViewableItemsChanged}
                    // viewabilityConfig={viewabilityConfig}

                    data={_posts.current}


                    // onViewableItemsChanged={onViewRef.current}
                    // viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
                    keyExtractor={item => item._id}
                    renderItem={({ item, index }) => {
                      return (
                        <View key={item.id + index} style={{ marginVertical: 8 }}>
                          <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                              activeOpacity={1}
                              // :TODO: LIVE
                              // onPress={() => navigation.navigate('LiveVideo')}
                              // onPress={() => navigation.navigate('DemoLive')}
                              style={[styles.userInfoContainer, { maxWidth: '45%', height: 80 }]}
                            >
                              <StoryItem
                                containerSize={60}
                                border
                                borderPurple
                                uri={item?.by?.imgUrl}
                              />
                              <View style={styles.userInfoBody}>
                                <View style={styles.userTextualInfoContainer}>
                                  <ResponsiveText style={styles.username}>
                                    {item?.by?.username}

                                  </ResponsiveText>
                                  <ResponsiveText style={styles.userSkill}>
                                    {item?.by?._type}
                                  </ResponsiveText>
                                </View>
                              </View>
                            </TouchableOpacity>

                            {item.by.hasStudio &&
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate('Reviews', { userId: item.by._id, totalRating: item?.by?.reviews?.length })
                                }}
                                style={styles.ratingContainer}
                              >
                                {startCount.map((star, idx) => {
                                  return (
                                    <View key={idx}>
                                      {idx <= item?.by?.rating - 1
                                        ? Icons.RatingStar({
                                          tintColor: '#FFC107',
                                          marginRight: 2,
                                        })
                                        : Icons.RatingStar({
                                          tintColor: '#CCCCCC',
                                          marginRight: 2,
                                        })}
                                    </View>
                                  )
                                })}
                                <ResponsiveText style={styles.ratingInstances}>
                                  (
                                  {item?.by?.reviews?.length}
                                  )
                                </ResponsiveText>
                              </TouchableOpacity>

                            }
                          </TouchableOpacity>

                          <View style={styles.postPayload}>
                            {/* <InViewPort onChange={handlePlaying}> */}

                            <View style={styles.videoContainer}>
                              {/* <InViewPort onChange={handlePlaying}> */}

                              {/* <View style={{
                                  flex: 1,
                                  // backgroundColor: 'red'
                                }}> */}

                              {/* <Video
                                // ref={(ref) => {
                                //     _player.current = ref;
                                // }}
                                paused={true}
                                source={{ uri: item.fileUrl }}
                                // source={require('../../../assets/images/file_example_MP4_640_3MG.mp4')}
                                poster={item.thumbnail}
                                // onProgress={({ currentTime }) => console.log(currentTime)}
                                onBuffer={() => { console.log('onBuffer') }}
                                onError={() => { console.log('error') }}
                                // onLoad={(e) => onVideoLoad(e)}
                                resizeMode="contain"
                                posterResizeMode="cover"
                                repeat
                                style={styles.backgroundVideo}
                              /> */}

                              <VideoPlayer
                                item={item}
                              // videoPaused={videoPaused}
                              ></VideoPlayer>
                              {/* </View> */}

                              {/* </InViewPort> */}

                              {/* <View style={styles.durationContainer}>
                                <ResponsiveText style={styles.videoDuration}>
                                  00: 00
                                </ResponsiveText>
                                <ResponsiveText style={styles.videoDuration}>
                                  00: 30
                                </ResponsiveText>
                              </View> */}
                              {/* <View
                                style={[styles.studioStatus, item?.by?.available ? { borderColor: '#0099A2' } : { borderColor: 'red' }]}
                              >
                                {item?.by?.available ? (
                                  <TouchableOpacity

                                    onPress={() => {
                                      console.log(index)
                                      // props?.userData?._type === "Artist" && props?.userData?._type === "Singer" & navigation.navigate('OfferCard')
                                    }

                                    }
                                  >
                                    <ResponsiveText style={styles.itemStatusText}>Available</ResponsiveText>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                  // onPress={() => navigation.navigate('JobCard')}
                                  >
                                    <ResponsiveText style={styles.itemStatusText}>Booked</ResponsiveText>
                                  </TouchableOpacity>
                                )}
                              </View> */}
                              {/* <View style={[styles.studioStatus, { borderColor: '#0099A2' }]}  >
                            <TouchableOpacity onPress={() => navigation.navigate('OfferCard')}>
                              <ResponsiveText style={styles.itemStatusText}>Available</ResponsiveText>
                            </TouchableOpacity> 
                          </View> */}
                            </View>

                            {/* </InViewPort> */}

                          </View>
                          {/* <View style={styles.postFeatureContainer}>
                            <View style={styles.postActionsContainer}>

                              <TouchableOpacity
                                onPress={() => {
                                  likemypost(item._id)
                                }}
                              >
                                {item.likedby.find(like => like._id == props?.userData?._id) ? Icons.RedHeart(styles.postActionIcon) : Icons.Like(styles.postActionIcon)}
                              </TouchableOpacity>


                              <TouchableOpacity

                                onPress={() => navigation.navigate('comments', { post_id: item._id, thumb: item.thumbnail })}
                                style={{ marginHorizontal: 10 }}
                              >
                                {Icons.Comment(styles.postActionIcon)}

                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => onShare(item._id)}
                              >
                                {Icons.Share({
                                  ...styles.postActionIcon,
                                  width: 35, tintColor: '#000'
                                })}
                              </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                              style={styles.likesContainer}
                              activeOpacity={0.9}
                              onPress={() => navigation.navigate('LikedBy', { post_id: item._id })}

                            >
                              <Image
                                source={{ uri: item?.likedby[0]?.imgUrl }}
                                style={[styles.likedByDP, { marginRight: -12.5 }]}
                              />
                              <Image
                                source={{ uri: item?.likedby[1]?.imgUrl }}
                                style={styles.likedByDP}
                              />
                              <ResponsiveText style={styles.likeCounts}>
                                {item?.likedby.length}
                                {' '}
                                likes
                              </ResponsiveText>
                            </TouchableOpacity>
                            <View style={styles.shareContainer}>




                              {activeUsers.find(x => x == item.by._id) ?
                                <View style={styles.greenCircle} />
                                :
                                <View style={[styles.greenCircle, { backgroundColor: 'grey' }]} />
                              }




                              <ResponsiveText style={styles.likeCounts}>
                                {item?.sharedBy.length}
                                {' '}
                                shares
                              </ResponsiveText>
                            </View>
                          </View> */}
                          {/* Comments Container */}
                          {/* <View style={styles.commentsContainer}>

                            {item?.comments[0] ?
                              <ResponsiveText style={styles.commentBy}>
                                <TouchableOpacity onPress={() => { navigation.navigate('Profile') }}>
                                  <ResponsiveText style={{ fontWeight: 'bold', marginBottom: -5 }}>
                                    {item?.comments[0]?.commentBy?.username}
                                  </ResponsiveText>
                                </TouchableOpacity>

                                <ResponsiveText
                                  style={{ ...styles.comment, color: '#013569' }}
                                >
                                  {' '}{item?.comments[0]?.commentText}
                                </ResponsiveText>
                              </ResponsiveText>

                              : null}

                            <View style={styles.postedTimeContainer}>
                              <ResponsiveText style={styles.hourAgo}>
                                {moment(item.createdAt).endOf('day').fromNow()}

                              </ResponsiveText>


                              {item?.comments?.length >= 1 ?
                                <TouchableOpacity onPress={() => navigation.navigate('comments', { post_id: item._id })}>
                                  <ResponsiveText style={styles.hourAgo}>
                                    View all {item?.comments?.length} comments
                                  </ResponsiveText>
                                </TouchableOpacity>
                                :
                                <ResponsiveText style={styles.hourAgo}>
                                  No comments
                                </ResponsiveText>
                              }

                            </View>

                            <TouchableOpacity
                              style={{ flexDirection: 'row', marginVertical: 5 }}
                              onPress={() => navigation.navigate('comments', { post_id: item._id })}
                              activeOpacity={0.8}
                            >
                              <Image
                                source={{ uri: props?.userData?.imgUrl }}
                                style={{
                                  height: 40, width: 40, borderRadius: 20, marginRight: 10,
                                }}
                              />
                              <View style={{
                                height: 30,
                                marginTop: 5,
                              }}
                              >
                                <ResponsiveText style={{ color: '#817f7f' }}>Add new Comment...</ResponsiveText>
                              </View>

                            </TouchableOpacity>
                          </View> */}
                        </View>

                      )
                    }}
                  />
              }
            </View>
          }


          {/* FlatList ends */}

          {
            checkDataLoading &&
            <View>
              <ActivityIndicator size="small" color="#0099A2" />
            </View>
          }






        </View >
      </ScrollView >
    </View >
  )
}


const styles = StyleSheet.create({
  content: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#F2F3FA',
  },
  subContent: {
    flex: 1,
    paddingBottom: 10,
  },
  storyContainer: {
    flexDirection: 'row',
    maxHeight: wp('30'),
    padding: 5,
    paddingVertical: 15,
  },
  advertisementContainer: {
    width: wp('100'),
    height: wp('60'),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  advertiseImg: {
    width: wp('100'),
    height: wp('60'),
    resizeMode: 'contain',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 3,
  },
  advertiseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locatedStudioContainer: {
    width: wp('100'),
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
  },
  locatedStudioImg: {
    width: wp('100'),
    height: wp('60'),
    resizeMode: 'contain',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 5,
  },
  locatedStudioOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    alignItems: 'center',
    paddingTop: hp(5),
  },
  searchStudio: {
    width: wp('95%'),
    height: wp('15'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    paddingRight: 20,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
  },
  searchIconContainer: {
    alignItems: 'center',
    left: null,
    right: 8,
    width: 30,
  },
  subHeading: {
    color: '#FFF',
    // fontSize: wp('1.2'),
    marginVertical: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    // width: wp(100),
    height: 45,
    elevation: 2,
    marginVertical: 10,

    // marginLeft: wp(5),
    marginRight: wp(5)
    // padding: wp(35)

  },
  filterItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(30),

  },
  filterText: {
    color: Colors.Primary,
    fontSize: 3,
    // width: wp(30),
    textAlign: 'center',


  },
  filterTypeActive: {
    backgroundColor: Colors.Primary,
    // backgroundColor: 'red',
    borderRadius: 10,

  },
  postContainer: {},
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  userInfoBody: {
    // flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },
  userTextualInfoContainer: {
    // paddingVertical: 10,
    // justifyContent: 'space-between',
  },
  username: {
    color: '#000',
    fontWeight: 'bold',
    // fontSize: wp('1.4'),
  },
  userSkill: {
    color: '#000',
    fontSize: 3.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingInstances: {
    fontWeight: 'bold',
    marginLeft: 3,
  },
  postPayload: {
    flex: 1,
    backgroundColor: '#E4E4E4',
    // backgroundColor: 'green'
  },
  videoContainer: {
    position: 'relative',
    width: wp('100'),
    height: wp('70'),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: 'transparent',
    // backgroundColor: 'red'
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('100'),
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 5,
    zIndex: 9999,
  },
  videoDuration: {
    color: '#FFF',
    fontSize: 3,
  },
  postFeatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  postActionsContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
  },
  postActionIcon: {
    height: 25,
    width: 25,
  },
  likesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  likedByDP: {
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  likeCounts: {
    fontSize: 3,
    fontWeight: 'bold',
    marginLeft: 7,
  },
  shareContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 3,

  },
  greenCircle: {
    backgroundColor: '#0099A2',
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  commentsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 5,
    paddingHorizontal: 15,
  },
  commentBy: {
    fontWeight: 'bold',
    marginVertical: 3,
  },
  comment: {
    fontSize: 3.5,
    fontWeight: '300',
    alignItems: 'center',
  },
  postedTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hourAgo: {
    fontWeight: '200',
    color: '#BBB',
    fontSize: 3.5,
    marginVertical: 5,
  },
  studioStatus: {
    paddingHorizontal: wp(5),
    paddingVertical: wp(1),
    position: 'absolute',
    right: 10,
    top: 15,
    borderWidth: 1,
    borderRadius: 5,
  },
  itemStatusText: {
    color: '#FFF',
  },
  storyCircle: {
    height: 68, width: 68, borderRadius: 40, marginRight: 8, borderWidth: 2, borderColor: '#0099A1', overflow: 'hidden'
  },
  adverts: {
    color: 'white',
    // font-size: 25px;
    fontWeight: 'bold',
    fontSize: wp(1.5)
  }
})



function mapStateToProps(state) {
  return {

    token: state.auth.token,
    userData: state.auth.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);