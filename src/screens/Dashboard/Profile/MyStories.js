import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native'
import AppHeader from '../../../components/layout/AppHeader'
import ResponsiveText from '../../../components/layout/ResponsiveText';
import Content from '../../../components/layout/Content';
import Icons from '../../../theme/icons';
import { connect } from 'react-redux';
import axios from "axios"
import moment from 'moment';

const MyStories = (props) => {
    useEffect(() => {
        console.log(props.token)
        getMyStories()
    }, [])
    const [myStories, setMyStories] = useState([])

    const getMyStories = () => {
        axios.get(`${API_URL}/user/story/my-stories`,
            {
                headers: { 'x-auth-token': props.token }
            })
            .then(res => {
                setMyStories(res.data.stories)
                // console.log('myStories____________', myStories)
            })
            .catch((err) => {
                console.log('ERROR___ getMyStories__-_', err.res)
            });
    }

    return (
        <View style={{ flex: 1 }}>

            <AppHeader onLeftPress={() => props.navigation.goBack()} />

            <Content style={styles.content}>
                <FlatList
                    data={myStories}
                    renderItem={({ item, index }) => (
                        <View style={styles.mainContainer}>
                            <View style={{ padding: 5, }}>


                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <View style={{ width: '70%' }} >

                                        <View style={{ justifyContent: 'space-between' }}>

                                            <View style={{ flexDirection: 'row' }}>

                                                <Image
                                                    style={styles.tinyLogo}
                                                    source={{ uri: item.thumbnail }}
                                                />

                                                <View style={{ left: 10, alignSelf: 'center' }}>
                                                    <ResponsiveText  >
                                                        {item.caption.length < 17
                                                            ? `${item.caption}`
                                                            : `${item.caption.substring(0, 17)}...`}
                                                        {/* {item.caption} */}
                                                    </ResponsiveText>
                                                    <ResponsiveText style={{ fontSize: 3.2, color: 'grey' }}> {moment(item.createdAt).fromNow()}</ResponsiveText>

                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                    <View style={{ width: '30%', alignSelf: 'center' }} >
                                        <TouchableOpacity style={[styles.proceedBtnContainer, { flexDirection: 'row' }]}
                                            // onPress={() => console.log(index)}
                                            onPress={() => props.navigation.navigate('StoryView', { storyData: myStories, selectedindex: index })}
                                        >
                                            {/* {Icons.Eye()} */}
                                            <ResponsiveText style={{ color: 'white' }}>View</ResponsiveText>
                                        </TouchableOpacity>
                                    </View>
                                </View>



                            </View>
                        </View>
                    )}
                />
            </Content>
        </View>
    )
}



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

export default connect(mapStateToProps, mapDispatchToProps)(MyStories);
const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 8,
        backgroundColor: '#FCFCFC',

    },
    mainTitle: {
        fontSize: 4,
        fontWeight: 'bold'
    },
    errorMessage: {
        color: 'red',
        marginTop: 10
    },
    tinyLogo: {
        width: 50,
        height: 50,
        borderRadius: 5,

    },
    mainContainer: {
        backgroundColor: '#fff',
        elevation: 2,
        margin: 2,
        marginVertical: 2,
        borderRadius: 5,
        zIndex: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        color: '#000',
        paddingVertical: 5,
        flex: 1

    },
    proceedBtnContainer: {
        height: 40,
        width: '80%',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#0099A2',
        borderRadius: 10,
        justifyContent: 'center'
    },
})