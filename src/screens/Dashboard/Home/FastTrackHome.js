import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, ImageBackground, Image, FlatList, ScrollView } from 'react-native'
import Feed from '../../../components/Feed'
import ResponsiveText from '../../../components/layout/ResponsiveText'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import axios from 'axios'
import API_URL from '../../../config/constants';
import { connect } from 'react-redux';
import Colors from '../../../theme/colors'
import StarRating from 'react-native-star-rating'
import Icons from '../../../theme/icons'


function FastTrackHome(props) {
    const [studio, setStudio] = useState({})
    const startCount = ['', '', '', '', '']
    const [locationFilterTypeIdx, setLocationFilterTypeIdx] = useState(0)
    const filterTypes = ['Feed', 'Popular', 'Recommended', 'Nearby']

    useEffect(() => {
        getStudios()
    }, [])


    const getStudios = () => {
        axios.post(`${API_URL}/studio/get-studios`,
            null,
            {
                headers: { 'x-auth-token': props.token }
            }).then(res => {
                // console.log('res one_signal..... ', JSON.stringify(res.data))
                setStudio(res.data)
            })
            .catch(error => {
                console.log('error', error)
            })
    }

    return (
        <View>
            {/* <View style={{ width: wp(100), alignItems: 'flex-end' }}>
                <ScrollView contentContainerStyle={styles.filterContainer} horizontal showsHorizontalScrollIndicator={false}>

                    {filterTypes.map((item, idx) => {
                        return (
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
                        )
                    })}
                </ScrollView>
            </View> */}


            {/* <TouchableOpacity
                activeOpacity={0.9}
                style={styles.advertisementContainer}
                onPress={() => { }}
            >
                <ImageBackground
                    source={{ uri: 'https://www.ipr.edu/wp-content/uploads/2020/02/music-studio-768x432.jpg' }}
                    style={styles.advertiseImg}
                >
                    <View style={styles.advertiseOverlay}>
                        <ResponsiveText style={styles.adverts}>Advertise here</ResponsiveText>
                    </View>
                </ImageBackground>
            </TouchableOpacity> */}



            <FlatList
                data={studio}
                //   showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                // numColumns={3}
                // horizontal={true}

                renderItem={({ item, index }) => {
                    return (
                        <View style={styles.mainView}>
                            <View style={styles.subView}>
                                <TouchableOpacity style={styles.imageView} onPress={() => { }}>
                                    <Image source={{ uri: 'https://picsum.photos/id/9/300/300' }} style={styles.imageStyle} />
                                </TouchableOpacity>
                                <View style={styles.nameView}>
                                    <ResponsiveText style={{ fontWeight: 'bold', fontSize: 4.5 }}>{item.owner.username}</ResponsiveText>
                                    <ResponsiveText style={{ fontSize: 3.5 }}>Studio Owner</ResponsiveText>
                                </View>
                                <View style={styles.starView}>
                                    <View style={{ flexDirection: 'row' }}>
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

                                        {/* {[...Array(5)].map((item, index) => {
                                            return (
                                                <Image key={index} source={{ uri: 'https://picsum.photos/id/9/300/300' }} style={{ height: 18, width: 18 }} />
                                            )
                                        })} */}
                                        <ResponsiveText style={{ fontWeight: 'bold', paddingLeft: 5 }}>{item.reviews.length}</ResponsiveText>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.serviceButton}>
                                <ResponsiveText style={{ paddingVertical: 6, fontWeight: 'bold' }}>Services Included</ResponsiveText>
                            </TouchableOpacity>
                            <View style={styles.bottomView}>
                                {item.services.map((item, index) => {
                                    return (
                                        <TouchableOpacity style={styles.touchButton} key={index}>
                                            <ResponsiveText style={{ paddingVertical: 5, paddingHorizontal: 5, fontSize: 3.5 }}>{item}</ResponsiveText>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                    )
                }}
            />



            {/* < Feed /> */}
        </View >
    )
}

const styles = StyleSheet.create({

    advertisementContainer: {
        width: wp('100'),
        height: wp('60'),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        // borderBottomLeftRadius: 10,
        // borderTopLeftRadius: 10,
        // width: wp('97'),
        height: 45,
        elevation: 2,
        marginVertical: 10,
        paddingRight: 10,
        marginLeft: wp(5),
    },
    filterTypeActive: {
        backgroundColor: Colors.Primary,
        // backgroundColor: 'red',
        borderRadius: 10,
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
    adverts: {
        color: 'white',
        // font-size: 25px;
        fontWeight: 'bold',
        fontSize: wp(1.5)
    },

    mainView: {
        width: wp(90),
        backgroundColor: 'white',
        alignSelf: 'center',
        marginTop: wp(5),
        paddingBottom: wp(2),
        borderRadius: 10,
        elevation: 3,
    },
    subView: {
        flexDirection: 'row',
        paddingTop: wp(2),
        paddingHorizontal: wp(2),
        paddingBottom: wp(3),
    },
    imageView: {
        borderColor: 'purple',
        borderWidth: 2,
        width: wp(12),
        height: wp(12),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp(6),
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    nameView: {
        marginLeft: wp(3),
        justifyContent: 'center',
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
        width: wp(30),
        textAlign: 'center',
    },
    starView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    serviceButton: {
        borderColor: Colors.Primary,
        borderWidth: 1.5,
        borderRadius: 8,
        alignItems: 'center',
    },
    bottomView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: wp(3),
        paddingHorizontal: wp(2),
    },
    touchButton: {
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(2.5),
        marginBottom: wp(2),
        borderColor: 'lightgrey',
    },
})




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

export default connect(mapStateToProps, mapDispatchToProps)(FastTrackHome);