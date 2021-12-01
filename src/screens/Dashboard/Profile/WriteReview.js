import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ScrollView } from "react-native";
import Container from "../../../components/layout/Container";
import AppHeader from "../../../components/layout/AppHeader";
import ResponsiveText from "../../../components/layout/ResponsiveText";
import star from '../../../assets/icons/star.png'
import Colors from "../../../theme/colors";
import { Rating, AirbnbRating } from 'react-native-ratings';
import axios from "axios"
import { connect } from 'react-redux';
import API_URL from '../../../config/constants';
import StarRating from 'react-native-star-rating';

const WriteReview = (props) => {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState('')
    const [starRatting, setStarRatting] = useState(3)
    const [errorMessage, setErrorMessage] = useState('')
    const [showError, setShowError] = useState(false)

    const submitReview = () => {
        console.log('oprop..........', props.route.params.userId)
// console.log('ratting..<', starRatting)
        if (title.length <= 5) {
            setShowError(true)
            setErrorMessage("Review must be greater than 5 characters")

        } else if (description.length <= 0) {
            setShowError(true)
            setErrorMessage("Please enter review description")
        } else {
            setShowError(false)
            axios.post(`${API_URL}/studio/reviews/post-review`,
                {
                    "title": title,
                    "description": description,
                    "rating": starRatting,
                    "user_id": props.route.params.userId
                },
                {
                    headers: { 'x-auth-token': props.token }
                })
                .then(res => {
                    console.log('res', res.data)
                    Alert.alert(
                        "Review updated",
                        "Review has been updated successfully!",
                        [{ text: "OK", onPress: () => props.navigation.goBack() }]
                    );
                })


        }

    }
    return (
        <Container>
            <AppHeader onLeftPress={() => props.navigation.goBack()} />
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, marginTop: 25, marginHorizontal: 30 }}>
                        <ScrollView >
                            <ResponsiveText style={styles.writeReviewText} >Write a review</ResponsiveText>
                            <View style={styles.starView}>
                                <StarRating
                                    disabled={false}
                                    maxStars={5}
                                    rating={starRatting}
                                    selectedStar={(e) => setStarRatting(e)}
                                    fullStarColor={Colors.Primary}
                                    starSize={30}
                                    starStyle={{ padding: 1 }}
                                />
                                {/* <AirbnbRating
                                    showRating={false}
                                    defaultRating={3}
                                    count={5}
                                    // ratingImage={star}
                                    selectedColor="#FFBF09"
                                    onFinishRating={(e) => setStarRatting(e)
                                    }
                                    // ratingColor='#3498db'
                                    // ratingBackgroundColor='#c8c7c8'
                                    // ratingCount={5}
                                    size={25}
                                    // onFinishRating={this.ratingCompleted}
                                    style={{ paddingVertical: 10 }}
                                /> */}
                                <ResponsiveText style={{ fontSize: 3.2, color: 'grey' }}>Tap a star to rate</ResponsiveText>
                            </View>
                            <View style={styles.titleInput}>
                                <TextInput
                                    onChangeText={e => setTitle(e)}
                                    placeholder='Title' placeholderTextColor='#8C8D99' style={{ paddingHorizontal: 10, paddingVertical: 10 }} />
                            </View>
                            <TextInput
                                onChangeText={e => setDescription(e)}
                                placeholder='Review' placeholderTextColor='#8C8D99' multiline={true} style={{ paddingHorizontal: 10, textAlignVertical: 'top', height: 150, backgroundColor: '#F5F5F5', }} />

                            {showError &&
                                <ResponsiveText style={{ color: 'red' }}>{errorMessage}</ResponsiveText>}
                        </ScrollView>
                    </View>
                    <TouchableOpacity
                        onPress={() => submitReview()}
                        style={styles.buttonView}>
                        <ResponsiveText style={{ paddingVertical: 11, color: 'white' }}>Publish</ResponsiveText>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </Container>
    )
}

const styles = {
    starStyle: {
        width: 160,
        height: 30,
        marginRight: 20,
    },
    writeReviewText: {
        fontWeight: 'bold',
        fontSize: 6
    },
    starView: {
        alignSelf: 'center',
        marginTop: 25,
        alignItems: 'center'
    },
    titleInput: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.Primary,
        marginTop: 40,
        backgroundColor: '#F5F5F5',
        marginBottom: 20
    },
    reviewInput: {
        backgroundColor: '#F5F5F5',
        width: '100%',
        marginTop: 15,
        borderRadius: 5,
        // height: '25%'
    },
    buttonView: {
        backgroundColor: Colors.Primary,
        marginHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 5
    }
}


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

export default connect(mapStateToProps, mapDispatchToProps)(WriteReview);