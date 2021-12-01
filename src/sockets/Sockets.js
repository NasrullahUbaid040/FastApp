import io from "socket.io-client";
import { EVENTS } from './Constant'
import API_URL from '../config/constants'

const socket = io(API_URL);



const myEstablishFunc = (user) => {
    socket.emit(EVENTS.ESTABLISH_CONNECTION, { "user_id": user })
}
const joinRoom = (post) => {
    socket.emit(EVENTS.JOIN_ROOM, { post })
}
const leaveRoom = (post) => {
    socket.emit(EVENTS.LEAVE_ROOM, { post })
}
const postComment = (by, commentText, post) => {
    socket.emit(EVENTS.COMMENT, { by, commentText, post })
}
const postLike = (user, post) => {
    socket.emit(EVENTS.LIKE, { user, post })
}
const newMessage = (by, chat_id, users = [], text, type) => {
    socket.emit(EVENTS.NEW_MESSAGE, { by, chat_id, users, text, type })
}
const chatMessage = (skip, limit, users) => {
    console.log("chatMessage>>>>>", skip, limit, users)

    socket.emit(EVENTS.GET_PAGINATED_MSGS, { skip, limit, users })
}
const readMessage = (chat_id, user) => {

    socket.emit(EVENTS.MARK_ALL_READ, { chat_id, user })
}
const users = () => {
    socket.emit(EVENTS.USERS, { hello1: "1" })
}

const postMention = (users, mentioned_by, type, data) => {
    // console.log(users, mentioned_by, type, data)
    socket.emit(EVENTS.MENTION, { users, mentioned_by, type, data })
}
const followUser = (my_user_id, user) => {
    console.log('followUser____', my_user_id, user)
    socket.emit(EVENTS.FOLLOW, { my_user_id, user })
}
const postLiveId = (_id, id) => {
    console.log('postLiveId___', _id, id)
    socket.emit(EVENTS.POST_ID, { _id, id })
}

//live streaming sockets
const deleteStory = (_id, id) => {
    console.log('*** STORY DELETED ***', _id, id)
    socket.emit(EVENTS.DELTE_STORY, { _id, id })
}
const userJoinStrem = (user, _id) => {
    console.log('userJoinStrem_____________', user, _id)
    socket.emit(EVENTS.LIVE_JOIN_SESSION, { user, _id })
}
const StreamMessage = (by, message, _id) => {
    console.log('StreamMessage_______', by, message, _id)
    socket.emit(EVENTS.LIVE_SESSION_MESSAGE, { by, message, _id })
}
const StreamLike = (_id, user) => {
    console.log('StreamLike__________', _id, user)
    socket.emit(EVENTS.LIVE_SESSION_LIKE, { _id, user })
}
const StreamLeave = (_id, user) => {
    console.log('StreamLeave__________', _id, user)
    socket.emit(EVENTS.LIVE_SESSION_LEAVE, { _id, user })
}


export default {
    socket, myEstablishFunc, joinRoom, leaveRoom, postComment, postLike,
    newMessage, chatMessage, readMessage, users, postMention, followUser,
    postLiveId, deleteStory, userJoinStrem, StreamMessage, StreamLike, StreamLeave
}