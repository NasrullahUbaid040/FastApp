import React, { useState, useEffect, useRef } from 'react';

import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image
} from 'react-native'
import moment from 'moment'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ResponsiveText from './layout/ResponsiveText';
import Colors from './../theme/colors'
import { backgroundColor } from 'react-native-calendars/src/style';




const ScheduledCard = ({
    item,
    image,
    fullName,
    description,
    startDate,
    endDate,
    hours,
    status,
    price,
    bookingType,
}) => {


    console.log("__________________")
    console.log(bookingType)


    return (
        <View>
            <View style={styles.Container}>
                <View style={styles.profileContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            // source={require('../assets/images/profile.png')}
                            source={{ uri: image }}
                            style={styles.profileStyle}
                        />

                        <View style={styles.nameDateStyle}>
                            <ResponsiveText style={styles.nameText}>
                                {fullName}
                            </ResponsiveText>
                            <ResponsiveText style={styles.dateText}>
                                {moment(startDate).format("ll")}
                            </ResponsiveText>
                        </View>

                    </View>

                    <TouchableOpacity>
                        <Image
                            source={require('./../assets/icons/menu-dots.png')}
                            style={styles.menuStyle}
                            resizeMode='contain'
                        />

                    </TouchableOpacity>
                </View>

                <View style={styles.description}>
                    <View style={{ width: '15%' }}>

                    </View>

                    <View style={
                        styles.descriptionTextContainer
                    }>
                        <ResponsiveText style={styles.descriptionText}
                        >
                            {description}
                        </ResponsiveText>
                    </View>
                </View>


                {bookingType === 'inprogress' || bookingType === 'upcoming' &&
                    <View style={styles.statsContainer}>
                        <View style={styles.dateStyle}>
                            <ResponsiveText style={styles.statsTitle}>
                                Starts
                            </ResponsiveText>
                            <ResponsiveText style={styles.statsValueStyle}>
                                {moment(startDate).format("ll")}
                            </ResponsiveText>
                        </View>

                        <View style={
                            styles.barGapStyle
                        }>

                        </View>
                        <View
                            style={styles.dateStyle}>
                            <ResponsiveText style={styles.statsTitle}>
                                Ends
                            </ResponsiveText>
                            <ResponsiveText style={styles.statsValueStyle}>
                                {moment(endDate).format("ll")}
                            </ResponsiveText>
                        </View>

                        <View style={styles.barGapStyle
                        }>

                        </View>
                        <View style={styles.dateStyle}>
                            <ResponsiveText style={styles.statsTitle}>
                                Hours
                            </ResponsiveText>
                            <ResponsiveText style={styles.statsValueStyle}>
                                {hours}
                            </ResponsiveText>
                        </View>

                    </View>
                }
            </View>
            <View
                style={[styles.bottomBarContainer,


                { backgroundColor: bookingType === 'rejected' ? 'red' : Colors.Primary }]}>

                {bookingType === 'inprogress' ?
                    < ResponsiveText style={styles.progressText}>
                        In Progress
                    </ResponsiveText>
                    :
                    bookingType === 'upcoming' ?
                        < ResponsiveText style={styles.progressText}>
                            Scheduled in
                        </ResponsiveText> :
                        bookingType === 'completed' ?
                            < ResponsiveText style={styles.progressText}>
                                Completed on
                            </ResponsiveText> :

                            < ResponsiveText style={styles.progressText}>
                                Rejected
                            </ResponsiveText>

                }
                <>

                    {bookingType === 'inprogress' ?
                        < ResponsiveText style={styles.progressText}>
                            ${price}
                        </ResponsiveText>
                        :
                        bookingType === 'upcoming' ?
                            <ResponsiveText style={styles.progressText
                            }>
                                {hours} hours
                            </ResponsiveText>
                            :
                            bookingType === 'completed' ?
                                < ResponsiveText style={styles.progressText}>
                                    ${price}
                                </ResponsiveText> :
                                null
                    }
                </>
            </View>
        </View >

    )
}

export default ScheduledCard;


const styles = StyleSheet.create({

    Container: {
        backgroundColor: 'white',
        elevation: 1,
        // height: hp(30),
        width: wp(90),
        borderTopEndRadius: 5,
        // borderTopEndRadius: 5,
        borderTopStartRadius: 5,
        marginTop: hp(2),
        zIndex: 0
    },

    profileStyle: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(10) / 2
    },
    menuStyle: {
        width: wp(8),
        height: wp(8),
    },
    description: {
        marginVertical: hp(2),
        paddingHorizontal: wp(3),
        // backgroundColor: 'red',
        flexDirection: 'row',
        width: '100%'
    },
    dateStyle: {
        // backgroundColor: 'yellow',
        alignItems: 'center',
        width: '25%'
    },
    bottomBarContainer: {

        height: hp(8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: Colors.Primary,
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
        width: wp(90),
        padding: wp(5),



    }, progressText: {
        color: '#fff',
        fontSize: 4.5,
        fontWeight: 'bold'

    },
    profileContainer: {
        flexDirection: 'row',
        width: '100%',
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(3),
        paddingVertical: wp(3)
    }, nameDateStyle: {

        paddingHorizontal: wp(2),
        // backgroundColor: 'green',
        justifyContent: 'space-around'

    }, nameText: {
        color: '#161F3D',
        fontWeight: '800',
        fontSize: 5


    }, dateText: {

        // color: '#fff',
        color: '#979797',
        // fontWeight: '800',
        fontSize: 3.5

    }, descriptionTextContainer: {
        // backgroundColor: 'yellow',
        // flexWrap: 'wrap'
        // flexShrink: 1
        width: '85%'
    },
    descriptionText: {
        color: '#151D3F'

    }, statsContainer: {

        // backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: hp(2),
        // paddingHorizontal: wp(5)
        // backgroundColor: 'yellow'

    }, statsTitle: {
        fontSize: 4,
        fontWeight: 'bold',
        color: '#707070', paddingVertical: wp(1)

    }, barGapStyle: {
        width: wp(0.3),
        backgroundColor: 'grey',
        height: hp(6)
    }, statsValueStyle: {
        fontWeight: 'bold',
        fontSize: 4,
    }
});
