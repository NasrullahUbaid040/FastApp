import React, { useRef, useState, useEffect } from 'react';
import { dummyArray } from "../../../components/DummyData/dummyData";
import { Text, View, Image, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import Container from "../../../components/layout/Container";
import AppHeader from "../../../components/layout/AppHeader";
import ResponsiveText from "../../../components/layout/ResponsiveText";
import Colors from "../../../theme/colors";
import StarCard from "../../../components/starCard";
import WrittenReviewsCard from "../../../components/WrittenReviewsCard";
import { connect } from 'react-redux';
import { useFocusEffect } from "@react-navigation/native";
import Icons from '../../../theme/icons';
import axios from "axios"
import API_URL from '../../../config/constants';
import ActivityLoader from '../../../components/ActivityLoader';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';


const Reviews = (props) => {
    // console.log('.......................', props.route.params.userId)
    const [reviewsData, setReviewsData] = useState([])
    const [data, setData] = useState({})
    const [postLoading, setPostLoading] = useState(false)
    const [noData, setNoData] = useState(false)
    const [loading, setLoading] = useState(true)

    let _skip = useRef(0);
    const _reviews = useRef([])

    useFocusEffect(
        React.useCallback(() => {

            setReviewsData(_reviews.current = [])
            getStudioReviews()

        }, [])
    );


    const getStudioReviews = () => {
        console.log('props?.route?.params.userId', props?.route?.params.userId)
        console.log('props?.route?.params.userId', props.token)
        axios.post(`${API_URL}/studio/reviews/get-reviews?skip=${_skip.current}&limit=5`,
            { "user_id": props?.route?.params.userId },
            {
                headers: { 'x-auth-token': props.token }
            })
            .then(res => res.data)

            .then(res => {
                setLoading(false)
                // console.log('response:::>>> ', JSON.stringify(res.data))
                if (res.data.reviews.length == 0) {
                    console.log("no dadta")

                } else {
                    setPostLoading(false)
                    setData(res.data)
                    console.log('res.data reviews...>> <<>> >>>', JSON.stringify(res.data))
                    setReviewsData(res.data.reviews)
                    _reviews.current = [..._reviews.current, ...res.data.reviews]

                    setReviewsData(_reviews.current)
                }

            })
    }

    const loadMore = () => {
        console.log("loading more...")
        setPostLoading(true)

        _skip.current = (_skip.current + 5)
        getStudioReviews()
    }
    return (
        <Container style={{ flex: 1, backgroundColor: 'white' }}>
            <AppHeader onLeftPress={() => props.navigation.goBack()} />
            {!loading ?
                <View style={{ backgroundColor: 'white', flex: 1, marginHorizontal: 20, }}>
                    <View style={styles.reviewTextView}>
                        <ResponsiveText style={styles.reviewText}>Reviews</ResponsiveText>

                        {/* <TouchableOpacity onPress={() => { props.navigation.navigate('WriteReview', { userId: props.route.params.userId }) }}>
                            <ResponsiveText style={styles.writeReviewText}>Write a review </ResponsiveText>
                        </TouchableOpacity> */}

                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 25 }}>
                        <View style={{ marginRight: 40 }}>
                            <ResponsiveText style={styles.ratingText}>
                                {data.rating ? Math.round(data.rating * 10) / 10 : 0}
                            </ResponsiveText>
                            <ResponsiveText style={styles.outOfText}>out of 5</ResponsiveText>
                        </View>
                        <View style={{ width: wp(50) }}>

                            <StarCard 
                            info={data.statsRating} 
                            totalRatings={props?.route?.params?.totalRating ? props?.route?.params?.totalRating : 100} />
                        </View>
                    </View>

                    {/* {noData ? */}
                    <View style={{}}>
                        <FlatList
                            keyExtractor={(item, index) => item.id}
                            onEndReached={() => loadMore()}
                            // ListFooterComponent={() => (
                            //     postLoading ?
                            //         <View style={{ marginBottom: 10 }}>
                            //             <ActivityIndicator size="small" color="#0099A2" />
                            //         </View>
                            //         : null

                            // )}

                            onEndReachedThreshold={0.01}
                            data={reviewsData}
                            renderItem={({ item, index }) => {
                                return <WrittenReviewsCard item={item} />
                            }}
                        />



                    </View>

                    {/* : <ResponsiveText style={styles.contain}>No reviews yet </ResponsiveText>} */}
                </View>
                : <ActivityLoader />}

        </Container >

    )
}

const styles = {
    reviewTextView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        alignItems: 'center'
    },
    reviewText: {
        fontWeight: 'bold',
        fontSize: 6
    },
    writeReviewText: {
        fontSize: 3.5,
        color: Colors.Primary
    },
    ratingText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.Primary
    },
    outOfText: {
        color: 'grey',
        alignSelf: 'flex-end',
        paddingRight: 15
    },
    contain: {
        flex: 1, alignItems: 'center', marginTop: 10
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

export default connect(mapStateToProps, mapDispatchToProps)(Reviews);