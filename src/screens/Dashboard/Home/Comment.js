import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Keyboard, KeyboardAvoidingView, BackHandler, Platform, Image, TouchableOpacity, FlatList, Modal } from 'react-native';
import ResponsiveText from '../../../components/layout/ResponsiveText';
import CommentDisplay from '../../../components/CommentDisplay';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppHeader from '../../../components/layout/AppHeader';
import { TextInput } from 'react-native-gesture-handler';
import StoryItem from '../../../components/StoryItem';
import Container from '../../../components/layout/Container';
import Content from '../../../components/layout/Content';
import Input from '../../../components/layout/Input';
import send from '../../../assets/icons/Send.png'
import axios from "axios"
import { connect } from 'react-redux';
import ActivityLoader from '../../../components/ActivityLoader';
import { EVENTS } from '../../../sockets/Constant'
import Socket from '../../../sockets/Sockets'
import Editor, { displayTextWithMentions } from 'react-native-mentions-editor';

const comments = [
  {
    username: 'janlosert',
    text:
      'Hey guys! Please listent to this and share you views and feedback in the comments section below. Don’t forget to rate me  in you love my voice…',
  },


];

function Comment(props) {
  const [commentsDS, setCommentsDS] = useState(comments)
  const [comment, setComment] = useState('');
  const [commentFoucsed, setCommentFocused] = useState(false);
  const [myComments, setMyComments] = useState([]);
  const [myPostId, setMyPostId] = useState('');
  const [noDataFound, setNoDataFound] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([])
  const [mentionUser, setMentionUser] = useState([])

  const _comments = useRef([])

  let scroll = useRef();
  let textInput = useRef()
  let _search = useRef()

  const backPress = () => {
    setCommentFocused(false)
    return
  }

  useEffect(() => {
    console.log('post_id____', props?.route?.params?.thumb)
    Socket.joinRoom(props?.route?.params?.post_id)

    //emits
    Socket.socket.on(EVENTS.JOIN_ROOM, data =>
      console.log('')
    )

    Socket.socket.on(EVENTS.COMMENT, data => {
      console.log('COMMENT::::::::', data.comment)
      _comments.current = [..._comments.current, data.comment]
      setMyComments(_comments.current)

      const comm = [...myComments, data.comment]
      setName('name')

    })

    getMyComments(props?.route?.params?.post_id)

    return () => {
      Socket.leaveRoom(props.route.params.post_id)
    };
  }, [1]);


  const getMyComments = (_props) => {
    axios.post(`${API_URL}/post/get-comments`,
      {
        post: (props?.route?.params?.post_id),
      },
      {
        headers: { 'x-auth-token': props?.token }
      })
      .then(res => res.data.data)
      .then(res => {

        // console.log("res.comments", res.comments)
        if (!res?.comments?.length) {
          setNoDataFound(true)
        } else {
          _comments.current = res?.comments
          setMyComments(res?.comments)

          // console.log('myComments::::::::', _comments.current)
          setNoDataFound(false)
        }

      })
      .catch((err) => {
        console.log('ERROR=======', err)
      });
  }

  const onSend = (commentText, post_id) => {

    Socket.postComment(props?.userData?._id, commentText, post_id)
    Socket.postMention(mentionUser, props?.userData?._id, 'comment', { thumb: props?.route?.params?.thumb, comment: commentText, post_id: post_id })
    setComment('')



  };

  const getIndex = (e) => {
    let a = e.length
    console.log('e..........', comment)
    // if (e[a - 1] === "@") {

    if (e.includes("@")) {

      // setSearch(e.replace(/(.*)@/, ""))
      _search.current = e.replace(/(.*)@/, "")
      console.log('console,,,', _search.current)
      getUserbyId()

      setModalVisible(true)
    }
    else { setModalVisible(false) }

  }
  const getUserbyId = () => {
    axios.post(`${API_URL}/user/search?username=${_search.current}`, null,
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => res.data)
      .then(res => {

        setSuggestions(res.data.users)


      })
      .catch((err) => {
        console.log('ERROR=======', err)
      });


  }
  return (
    <Container>
      <AppHeader
        onLeftPress={() => props.navigation.goBack()}
        title={'People who commented'}
      />
      <View style={{ flex: 1 }}>

        <ScrollView
          style={styles.commentContainer}
          ref={scroll}
          onContentSizeChange={() => scroll.current.scrollToEnd({ animated: true })}
        >

          {noDataFound ?
            <View style={{ alignItems: 'center' }}>
              <ResponsiveText>No comments</ResponsiveText>
            </View>
            :
            <FlatList
              // data={_comments.current}
              data={myComments}
              keyExtractor={item => item._id}
              renderItem={({ item }) => {
                return (
                  <View >
                    <CommentDisplay key={item._id} comment={item} {...props.navigation} />

                  </View>
                )
              }}
            />
          }

        </ScrollView>



        {modalVisible &&
          <View style={styles.mentionView}>
            {suggestions.map(x =>


              <TouchableOpacity onPress={() => {
                console.log(x._id)
                mentionUser.push(x._id)
                console.log('mentionUser', mentionUser)
                setComment(comment + x.username),
                  setModalVisible(false)
                _search.current = ""

              }}>
                <ResponsiveText> {x.username} </ResponsiveText>
              </TouchableOpacity>

            )}
          </View>
        }

        <KeyboardAvoidingView style={styles.postComments} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <StoryItem
            containerSize={45}
            border={true}
            borderPurple={true}
            uri={props?.userData.imgUrl}
          // uri={"https://picsum.photos/id/455/200/300"}
          />

          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TextInput
              placeholder='Add a Comment...'
              ref={textInput}
              style={[styles.input, commentFoucsed ? { borderColor: '#0099A2' } : { borderColor: 'transparent' }]}
              onBlur={() => setComment(false)}
              onFocus={() => setCommentFocused(true)}
              value={comment}
              onChangeText={(e) => { setComment(e), getIndex(e) }
              }

              textAlignVertical={'top'}
              multiline={true}
            />
            <TouchableOpacity style={styles.sendIcon} onPress={() => {
              setNoDataFound(false),
                onSend(comment, props.route.params.post_id)
            }}>
              <Image
                source={send}
                style={{ height: '100%', width: '100%' }} />
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>

      </View>

      {
        noDataFound || !myComments.length &&
        < ActivityLoader />
      }

    </Container >

  );
}



const styles = StyleSheet.create({
  commentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 0,
  },
  postComments: {
    paddingHorizontal: 15,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  input: {
    flex: 1,
    borderColor: 'blue',
    borderWidth: 1.5,
    height: hp(13),
    borderRadius: 5,
    padding: 5
  },
  sendIcon: {
    height: wp(6),
    width: wp(6),
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 10
  },
  mentionView: {
    // maxHeight: hp(15),
    // backgroundColor: 'lightgrey',
    // borderRadius: 10,
    // padding: 10
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

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment);