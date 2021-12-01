import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, FlatList } from 'react-native';
import ResponsiveText from '../../../components/layout/ResponsiveText';
import Container from '../../../components/layout/Container';
import Content from '../../../components/layout/Content';
import InboxHeader from '../../../components/InboxHeader';
import InboxItem from '../../../components/InboxItem';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import API_URL from '../../../config/constants';
import axios from "axios"
import Socket from '../../../sockets/Sockets'
import { EVENTS } from '../../../sockets/Constant'
import { useFocusEffect } from "@react-navigation/native";
import socket from 'socket.io-client/lib/socket';
import { color } from 'react-native-reanimated';



function Inbox(props) {
  const [inboxData, setInboxData] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [chats, setChats] = useState([]);
  const [searchChats, setSearchChats] = useState([]);
  const [unread, setUnread] = useState(0);
  const [noDataFound, setNoDataFound] = useState(false);
  const _chat = useRef([])
  const [activeUsers, setActiveUsers] = useState([])
  const [isRefreshing, setisRefreshing] = useState(false);


  let _skip = useRef(0);


  useFocusEffect(
    React.useCallback(() => {


      console.log('user token', props.token)
      _chat.current = []
      _skip.current = 0;
      Socket.users()

      getPaginatedChats()


      Socket.myEstablishFunc(props?.userData?._id)

      Socket.socket.on(EVENTS.USERS, (data) => {
        setActiveUsers(Object.keys(data))
      })

      Socket.socket.on(EVENTS.ESTABLISH_CONNECTION, (data) => {
        // console.log('socket______________', data)
      })

      Socket.socket.on(EVENTS.MARK_ALL_READ, (data) => {
        console.log("object", JSON.stringify(data.chat))
        const mychat = [..._chat.current]
        let myIndex = mychat.findIndex((obj => obj._id == data.chat._id))
        console.log('index:', myIndex)
        mychat[myIndex] = data.chat
        _chat.current = mychat
        setChats(_chat.current)
      })

      Socket.socket.on(EVENTS.NEW_MESSAGE, (data) => {
        console.log("NEW_MESSAGE.............", JSON.stringify(data))

        const mychat = [..._chat.current]
        let myIndex = mychat.findIndex((obj => obj._id == data.chat._id))
        console.log('index:', myIndex)
        mychat[myIndex].lastMessage.text = data.message.text
        mychat[myIndex].lastMessage.createdAt = data.message.createdAt
        mychat[myIndex].lastMessage.createdAt = data.message.createdAt
        mychat[myIndex].lastMessage.type = data.message.type
        mychat[myIndex].unreadCount = mychat[myIndex].unreadCount + 1
        _chat.current = mychat
        setChats(_chat.current)
        setUnread(unread + 1)
      })


    }, [1])
  );

  const getPaginatedChats = () => {
    axios.get(`${API_URL}/chat/paginated-chats`,
      {
        params: {
          skip: _skip.current,
          limit: "10"
        },
        headers: { 'x-auth-token': props.token }
      },
    )
      .then(res => res.data)
      .then(res => {
        setUnread(res.chats.totalUnread)
        _chat.current = [..._chat.current, ...res.chats.chats]

        //sorting according to time
        _chat.current.sort(function (a, b) {
          return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });
        setChats([..._chat.current])
        // console.log(`_chat.current_____________________`, JSON.stringify(_chat.current))


      })
      .catch((err) => {
        console.log('ERROR__::', err)
      });
  }
  const getChats = () => {
    axios.post(`${API_URL}/chat/my-chats`, null,
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => res.data)
      .then(res => {
        setChats(res.data.chats)
        console.log('res.data.chats', JSON.stringify(res.data.chats))

        _chat.current = res.data.chats
      })
      .catch((err) => {
        console.log('ERROR__::', err)
      });
  }
  const searchFilter = (text) => {
    const newData = inboxData.filter((item) => {
      return item.username.toUpperCase().search(text.toUpperCase()) > -1;
    });
    if (text.trim().length === 0) {
      setInboxData(inboxDataSet)
    } else {
      setInboxData(newData)
    }
    setSearchValue(text)
  }
  const onRefreshchat = () => {
    setisRefreshing(true)

    _skip.current = 0
    _chat.current = []
    // setChats(_chat.current)
    getPaginatedChats()
    setisRefreshing(false)
  }
  const loadMoreChat = () => {
    _skip.current = _skip.current + 10
    getPaginatedChats()
  }
  const searchChat = (text) => {
    console.log('search', text)
    axios.get(`${API_URL}/chat/search?skip=0&limit=10&query=${text}`, {
      headers: { 'x-auth-token': props.token }
    })
      .then(res => res.data)
      .then(res => {
        console.log('from response=======', JSON.stringify(res.chats))
        setSearchChats(res.chats)
        setChats([])
        // setChats(res.chats)

        // setUnread(res.chats.totalUnread)
        // _chat.current = [..._chat.current, ...res.chats.chats]
        // setChats([..._chat.current])
        // console.log(`chats....`, JSON.stringify(chats[0].users))


      })
      .catch((err) => {
        console.log('ERROR__::', err)
      });



  }
  return (
    <View style={{ flex: 1 }}>
      <InboxHeader
        searchValue={searchValue}
        onChangeText={(text) => { setSearchValue(text), searchChat(text) }}
        onPressBack={() => props.navigation.goBack()}
        onPress={() => {
          {
            props?.userData?._type === "Artist" || props?.userData?._type === "Singer" ?
              props.navigation.navigate('OfferCard')
              :
              props.navigation.navigate('MyBookings')
          }
        }}
      />
      <Content>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.headingsContainer}>
              <ResponsiveText style={styles.heading}>Messages</ResponsiveText>
            </View>

            {unread >= 1 &&
              <View style={styles.unreadContainer}>
                <ResponsiveText style={styles.subHeading}>
                  You have {unread} new messages
                </ResponsiveText>
              </View>}




            <FlatList
              data={searchChats.length ? searchChats : chats}
              keyExtractor={item => item._id}
              onEndReachedThreshold={0.01}
              ListEmptyComponent={() =>
                <View style={styles.unreadContainer}>
                  <ResponsiveText style={{ color: 'grey', alignSelf: 'center' }}>No messages</ResponsiveText>
                </View>
              }
              // ref={scroll}
              onEndReached={() => {
                loadMoreChat()
              }}
              onRefresh={() => onRefreshchat()}
              refreshing={isRefreshing}
              renderItem={({ item, idx }) => {
                let otherUser = item.users.find(user => user._id != props?.userData?._id)
                return (



                  <InboxItem
                    isOnline={activeUsers.find(a => otherUser._id === a)}
                    key={idx}
                    onPress={() => props.navigation.navigate('Conversation', { ChatId: item._id, userdata: otherUser })}
                    message={item?.lastMessage?.text}
                    timeAgo={item?.lastMessage?.createdAt}
                    statusCount={item?.unreadCount > 0}
                    type={item?.lastMessage?.type}
                    userData={otherUser}
                  />
                )
              }}
            />


          </View>
        </ScrollView>
      </Content>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  heading: {
    fontSize: 8,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginVertical: 5,
  },
  subHeading: {
    fontWeight: '300',
    marginHorizontal: 15,
    color: '#bbb',
    marginVertical: 5,
  },
  headingsContainer: {
    height: wp('12'),
    paddingHorizontal: 10,
  },
  unreadContainer: {
    height: wp('12'),
    // justifyContent: 'center',
    paddingHorizontal: 10,
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

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);