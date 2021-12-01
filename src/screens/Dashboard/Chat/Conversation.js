import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Modal,
  PermissionsAndroid
} from 'react-native';
import ConversationHeader from '../../../components/ConversationHeader';
import ConversationPayload from '../../../components/ConversationPayload';
import Container from '../../../components/layout/Container';
import Icons from '../../../theme/icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Input from '../../../components/layout/Input';
import EmojiBoard from 'react-native-emoji-board';
import ResponsiveText from '../../../components/layout/ResponsiveText';
import Content from '../../../components/layout/Content';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { connect } from 'react-redux';
import axios from "axios"
import ActivityLoader from '../../../components/ActivityLoader'
import Socket from '../../../sockets/Sockets'
import { EVENTS } from '../../../sockets/Constant'
import socket from 'socket.io-client/lib/socket';
import ImageUplaod from '../../../services/ImageUplaod'


function Conversation(props) {
  // console.log("props.........................", props.route.params.userdata)
  const [messageField, setMessageField] = useState('');
  const [show, setShow] = useState(false);
  const [upload, setUpload] = useState(false);
  const [chats, setChats] = useState([]);
  const [noDataFound, setNoDataFound] = useState(false)
  const [name, setName] = useState('');
  const [isRefreshing, setisRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadImage, setUploadImage] = useState('')
  const [newImg, setNewImg] = useState('')
  const [activeUsers, setActiveUsers] = useState([])



  const limit = 10;
  let _skip = useRef(0);
  const _chat = useRef([])
  let scroll = useRef();

  useEffect(() => {
    Socket.users()

    // console.log('chat id: ', props.route.params.userdata._id)
    // console.log('user data: ', props.route.params.userdata._id)

    Socket.chatMessage(_skip.current, limit, [props.route.params.userdata._id, props?.userData?._id])
    Socket.readMessage(props.route.params.ChatId, props?.userData?._id)

    Socket.socket.on(EVENTS.GET_PAGINATED_MSGS, ({ chat }) => {
      if (chat?.messages?.length) {
        _chat.current = [...chat.messages, ..._chat.current]
        setChats([..._chat.current])
      }
    })

    Socket.socket.on(EVENTS.NEW_MESSAGE, (data) => {
      console.log("NEW_MESSAGE.............", data.message)
      _chat.current = [..._chat.current, data.message]
      console.log('_chat.current..............', _chat.current)
      setChats([..._chat.current])
      Socket.readMessage(props.route.params.ChatId, props?.userData?._id)

      // scrollDown()



    })

    Socket.socket.on(EVENTS.USERS, (data) => {
      setActiveUsers(Object.keys(data))
    })

  }, [])



  const loadchat = () => {
    _skip.current = (_skip.current + 10)
    Socket.chatMessage(_skip.current, limit, [props.route.params.userdata._id, props?.userData?._id])
    console.log('<<<<<<<< chat loaded >>>>>>>')
  }
  function messageSent() {
    Socket.readMessage(props.route.params.ChatId, props?.userData?._id)
    let new_sent_message = {
      // text: messageField,
      // type: 'text',
      // user: props.userData._id,
      "createdAt": new Date(),
      "read": false,
      "text": messageField,
      "type": "text",
      "updatedAt": new Date(),
      "by": [
        {
          "_id": props.userData._id,
          "createdAt": new Date(),
          "email": props?.userData?.email,
          "imgUrl": props?.userData?.imgUrl
        }
      ],

    };
    _chat.current = [..._chat.current, new_sent_message]
    setChats([..._chat.current])
    // new_sent_message
    // setChats([...chats]);
    Socket.newMessage(props.userData._id, props.route.params.ChatId, [props.route.params.userdata._id, props?.userData?._id], messageField, 'text')
    setMessageField('');

    scrollDown()

  }
  const onRefreshchat = () => {
    setisRefreshing(true)
    loadchat()
    setisRefreshing(false)
  }
  const getChat = () => {
    axios.post(`${API_URL}/chat/get-chat`,
      {
        "chat_id": props.route.params.ChatId
      },
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => {

        console.log('res', JSON.stringify(res.data.data))
        // if (!res.data.data) {
        //   setNoDataFound(false)
        // } else {
        //   _id.current = res.data.data.chat._id
        //   setChats(res.data.data.chat.messages)
        //   setNoDataFound(true)
        //   _chat.current = res.data.data.chat.messages
        // }

      })
      .catch((err) => {
        console.log('ERROR__::', err)
      });
  }
  const onClick = (emoji) => {
    console.warn(emoji);
    setShow(!show);
  };
  const getImageUri = (uploadImage) => {
    // console.log('uploadImage....', uploadImage)
    ImageUplaod.UploadmyImage(uploadImage)
      .then(res => res.data)
      .then(res => {
        setNewImg(res.files[0].Location)
        console.log('res__________', JSON.stringify(res.files[0].Location))

        // {
        //   res.files[0].Location &&

        //     chats.push({
        //       text: res.files[0].Location,
        //       type: 'image',
        //       user: props.userData._id,
        //       "createdAt": new Date(),
        //       "read": false,
        //       "updatedAt": new Date(),
        //       "by": [
        //         {
        //           "_id": props.userData._id,
        //           "createdAt": new Date(),
        //           "email": props.userData.email,
        //           "imgUrl": props.userData.imgUrl
        //         }
        //       ],
        //     });

        //   Socket.newMessage(props.userData._id, props.route.params.ChatId, [props.route.params.userdata._id, props?.userData?._id], res.files[0].Location, 'image')
        //   setChats([...chats]);
        //   scrollDown()
        // }





      })
      .catch(err => {
        console.log('error')
        console.log(err);
      })


  }
  const takeImage = () => {
    setModalVisible(false)

    launchCamera(
      {
        mediaType: 'photo',
        storageOptions: {
          // skipBackup: true,
          // path: 'Pictures/myAppPicture/', //-->this is neccesary
          quality: 0.8,
          maxHeight: 300,
          maxWidth: 300,
          privateDirectory: true,
        },
      },
      (response) => {
        console.log('response.uri......', response.uri)
        getImageUri(response.uri)


        {
          response.uri &&

            chats.push({
              text: response.uri,
              type: 'image',
              user: props.userData._id,
              "createdAt": new Date(),
              "read": false,
              "updatedAt": new Date(),
              "by": [
                {
                  "_id": props.userData._id,
                  "createdAt": new Date(),
                  "email": props.userData.email,
                  "imgUrl": props?.userData?.imgUrl
                }
              ],
            });

          Socket.newMessage(props.userData._id, props.route.params.ChatId, [props.route.params.userdata._id, props?.userData?._id], response.uri, 'image')
          setChats([...chats]);
          scrollDown()
        }

      },
    );
  };

  const chooseFromGallery = () => {

    setModalVisible(false)
    setUpload(false);
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 300,
        maxWidth: 300,

        storageOptions: {
          // skipBackup: true,
          // path: 'Pictures/myAppPicture/', //-->this is neccesary
          privateDirectory: true,
        },
      },
      (response) => {
        console.log('response................', response.uri)
        getImageUri(response.uri)
        {
          response.uri &&
            chats.push({
              text: response.uri,
              type: 'image',
              user: props.userData._id,
              "createdAt": new Date(),
              "read": false,
              "updatedAt": new Date(),
              "by": [
                {
                  "_id": props?.userData?._id,
                  "createdAt": new Date(),
                  "email": props?.userData?.email,
                  "imgUrl": props?.userData?.imgUrl
                }
              ],
            });

          Socket.newMessage(props.userData._id, props.route.params.ChatId, [props.route.params.userdata._id, props?.userData?._id], response.uri, 'image')
          setChats([...chats]);
        }

        scrollDown()
      },
    );
  };
  const scrollDown = () => {
    setTimeout(() => {
      scroll.current.scrollToEnd()
    }, 1000)


  }
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,

      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
        takeImage()
      } else {
        setModalVisible(false)
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // let otherUser = userdata.users.find(user => user._id != props.userData._id)
  console.log({ activeUsers });
  return (
    <Container style={styles.container}>

      <ConversationHeader
        userInfo={props.route.params.userdata}
        isOnline={activeUsers.find(a => props.route.params.userdata._id === a)}
        onBackArrow={() => props.navigation.goBack()} />

      {chats.length ?
        <View style={{ flex: 1 }}>
          <FlatList
            data={chats}
            keyExtractor={item => item._id}
            onEndReachedThreshold={0.01}
            ref={scroll}
            onContentSizeChange={() => _skip.current === 0 && scroll.current.scrollToEnd()}

            onRefresh={() => onRefreshchat()}
            refreshing={isRefreshing}
            renderItem={({ item, index }) => {
              return (
                <View  >
                  <ConversationPayload
                    key={index}
                    other={item?.by[0]?._id === props.userData._id ? "A" : null}
                    data={item}
                  />
                </View>
              )
            }}
          />

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : wp(20)}>
            <View style={styles.inputFieldContainer}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setModalVisible(!modalVisible)

                  }}>
                  {Icons.SendMessageLeft(styles.icons)}
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => setShow(!show)}>
                {Icons.Emojis({ ...styles.icons, marginLeft: 8 })}
              </TouchableOpacity> */}
              </View>
              <Input
                inputStyle={styles.sendMessageInputField}
                placeholder={'Type Something'}
                placeholderTextColor={'#000'}
                onChangeText={(e) => setMessageField(e)}
                value={messageField}
              />
              <TouchableOpacity
                disabled={messageField.length < 1 ? true : false}
                onPress={() => {
                  if (messageField.length > 0) {
                    messageSent()
                  }
                }}>
                {Icons.Send(
                  { height: wp('7') }
                )}
              </TouchableOpacity>
              {/* <EmojiBoard showBoard={show} onClick={(e) => console.warn(e)} /> */}
            </View>
          </KeyboardAvoidingView>

        </View> :
        <ActivityLoader />}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>

          <View style={styles.centeredView}>
            <TouchableOpacity onPress={chooseFromGallery}>
              <ResponsiveText>Choose from Gallery</ResponsiveText>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={takeImage}> */}
            <TouchableOpacity onPress={requestCameraPermission}>
              <ResponsiveText>Capture from Camera</ResponsiveText>
            </TouchableOpacity>

          </View>
        </View>

      </Modal>


    </Container >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  conversationContainer: {
    flex: 1,
    // position: 'relative',
  },
  inputFieldContainer: {
    alignSelf: 'flex-end',
    width: wp('100'),
    height: 55,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icons: {
    height: wp('8'),
    width: wp('8'),
  },
  sendMessageInputField: {
    width: wp('80'),
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  uploadOptionsContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: wp('80'),
    borderRadius: 15,
    alignSelf: 'center',
    top: '30%',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  centeredView: {

    justifyContent: 'space-evenly',
    alignSelf: "center",
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: hp(30),
    width: wp(70),
    height: hp(20),
    elevation: 5

  },
  captureOptionItem: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    height: 50,
    textAlign: 'center',
    justifyContent: 'center',
  },
});
function mapStateToProps(state) {
  return {

    token: state.auth.token,
    userData: state.auth.user

  }
}

function mapDispatchToProps(dispatch) {
  return {
    // loginUser: (payload) => dispatch(loginUser(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);