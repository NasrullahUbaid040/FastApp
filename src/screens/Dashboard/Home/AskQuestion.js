import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import AppHeader from '../../../components/layout/AppHeader';
import Input from '../../../components/layout/Input';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Content from '../../../components/layout/Content';
import Button from '../../../components/layout/Button';
import ResponsiveText from '../../../components/layout/ResponsiveText';
import axios from 'axios';
import API_URL from '../../../config/constants';
import { connect } from 'react-redux';
import moment from 'moment'

const AskQuestion = (props) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')
    console.log('AskQuestion..', props.route.params.studioId)
    console.log('token..', props.token)

    const SendMessage = () => {


        if (!title) {
            setError("Please enter question title")

        } else if (!description) {
            setError("Please enter description")
        } else {
            setError('')
            axios.post(`${API_URL}/studio/booking/ask-question`, {
                "studio": props.route.params.studioId,
                "time": moment(),
                "message": description
            }, {
                headers: { 'x-auth-token': props.token }
            }).then(res => {
                Alert.alert(
                    "Success",
                    "Message has been sent",
                    [
                        {
                            text: "Back",
                            onPress: () => props.navigation.goBack()
                        },
                        { text: "Go to Chat", onPress: () => props.navigation.navigate('ChatStack', { screen: 'Inbox' }) }
                    ]
                );
                console.log('res..>', res)
            }).catch((err) => {
                console.log('ERROR__::', err)
            });
        }

    }
    return (
        <View style={{ flex: 1, backgroundColor: '#fdfdfd' }}>
            <AppHeader onLeftPress={() => props.navigation.goBack()} />
            <Content style={styles.content}>

                <View style={{ flex: 1 }}>
                    <ResponsiveText style={styles.mainText}>Ask a Question</ResponsiveText>

                    <Input
                        placeholder={'Question title'}
                        inputStyle={styles.input}
                        value={title}
                        onChangeText={(e) => setTitle(e)}
                    />


                    <Input
                        placeholder={'Write description'}
                        inputStyle={styles.comment}
                        multiline={true}
                        value={description}
                        onChangeText={(e) => setDescription(e)}
                        textAlignVertical={'top'}
                    />

                    {error.length > 0 && <ResponsiveText style={styles.errorMessage}>{error}</ResponsiveText>
                    }
                </View>

            </Content>
            <Button
                btnContainer={styles.proceedBtnContainer}
                title={'Send'}
                onPress={() => SendMessage()}
            />
        </View>
    )
}


function mapStateToProps(state) {
    return {

        token: state.auth.token,

    }
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AskQuestion);

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 8,
        backgroundColor: '#fdfdfd',

    },
    errorMessage: {
        color: 'red',
        marginTop: 10
    },
    mainText: {
        color: '#8F8FA7',
        fontSize: 5,
        marginBottom: 10,
        marginTop: 5,
        alignSelf: 'center'
    },
    input: {
        backgroundColor: '#fff',
        elevation: 2,
        height: wp('16'),
        // fontWeight: 'bold',
        marginVertical: 0,
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
    },
    comment: {
        backgroundColor: '#fff',
        // fontWeight: 'bold',
        marginVertical: 0,
        height: wp('50'),
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderRadius: wp('2%'),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    proceedBtnContainer: {
        height: wp('16'),
        width: wp('100') - 30,
        alignSelf: 'center',
    },
})