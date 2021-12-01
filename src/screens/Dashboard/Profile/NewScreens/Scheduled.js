
import React, { useEffect, useRef, useState } from 'react'
import {
    Image,
    TouchableOpacity,
    View,
    ScrollView,
    FlatList,
    Alert,
    Text,
    StyleSheet,
} from 'react-native'


import { connect } from 'react-redux';
import moment from 'moment'
import axios from 'axios'

import Button from '../../../../components/layout/Button'
import AppHeader from '../../../../components/layout/AppHeader'
import Container from '../../../../components/layout/Container'
import ResponsiveText from '../../../../components/layout/ResponsiveText'
import ScheduledCard from '../../../../components/ScheduledCard';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import Colors from '../../../../theme/colors'
import Icons from '../../../../theme/icons'
import API_URL from '../../../../config/constants';

const filterTypes = ['In progress', 'Upcoming', 'Completed', 'Rejected']
const CardData = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        type: 'In progress',
        image: 'Roxy Leshea',
        name: '35',
        date: '',
        description: 'Hi, I’m looking for a studio to record my new song. I found yours and it almost matches everything that I’m looking for. Would love to have my song recorded at your studio.        ',
        startDate: '21 Jan , 2021',
        endDate: '23 Jan , 2021',
        Hours: '60',
        value: '$9,000'

    },

    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba42',
        type: 'Upcoming',
        image: 'Roxy Leshea',
        name: '35',
        date: '',
        description: 'Hi, I’m looking for a studio to record my new song. I found yours and it almost matches everything that I’m looking for. Would love to have my song recorded at your studio.        ',
        startDate: '21 Jan , 2021',
        endDate: '23 Jan , 2021',
        Hours: '60',
        value: '24 Hours'


    },

    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba67',
        type: 'Completed',
        image: 'Roxy Leshea',
        name: '35',
        date: '',
        description: 'Hi, I’m looking for a studio to record my new song. I found yours and it almost matches everything that I’m looking for. Would love to have my song recorded at your studio.        ',
        startDate: '21 Jan , 2021',
        endDate: '23 Jan , 2021',
        Hours: '60',
        value: '$499'


    },

    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba09',
        type: 'Rejected',
        image: 'Roxy Leshea',
        name: '35',
        date: '',
        description: 'Hi, I’m looking for a studio to record my new song. I found yours and it almost matches everything that I’m looking for. Would love to have my song recorded at your studio.        ',
        startDate: '21 Jan , 2021',
        endDate: '23 Jan , 2021',
        Hours: '60',
        value: ''


    },
]



const Scheduled = (props) => {

    const [locationFilterTypeIdx, setLocationFilterTypeIdx] = useState(0)
    const [data, setData] = useState([])
    let _skip = useRef(0)
    let _filterType = useRef("inprogress")


    useEffect(() => {
        console.log("USE EFFEECT")
        getBookingsData()
    }, [])


    const getBookingsData = () => {

        axios.get(`${API_URL}/studio/booking?filter_type=${_filterType.current}&skip=${_skip.current}&limit=5&filter=studios`,
            {
                headers: { 'x-auth-token': props.token }
            }).then(res => res.data).then(res => {
                console.log(">>>> ||||| ", res.bookings)

                setData(res.bookings)

                if (_skip.current == 0) {
                    setData(res.bookings)
                } else {
                    const oldData = data
                    const newData = res.bookings
                    const totalData = [...oldData, ...newData]
                    console.log(">>>> ||||| >>>>>  ", totalData)

                    setData(totalData)
                }

            })
            .catch(error => {
                console.log('error', error)
            })
    }


    const onFilterChange = (item, idx) => {
        setLocationFilterTypeIdx(idx)
        _skip.current = 0
        setData([])

        if (item === 'In progress') {
            _filterType.current = 'inprogress'
            getBookingsData()


        } else if (item === 'Upcoming') {

            _filterType.current = 'upcoming'
            getBookingsData()
        } else if (item === 'Completed') {

            _filterType.current = 'completed'
            getBookingsData()

        } else if (item === 'Rejected') {
            _filterType.current = 'rejected'
            getBookingsData()

        }

    }

    const loadMoreFeeds = () => {

        if (locationFilterTypeIdx === 0) {
            console.log("NO PAGINATION")
        } else {

            _skip.current = (_skip.current + 5)
            console.log('skip...............', _skip.current)
            console.log('skip...............', _filterType.current)

            getBookingsData()
        }
    }


    const renderItem = ({ item, index }) => {
        return (
            <ScheduledCard
                item={item}
                image={item?.studio?.image ? item?.studio?.image : null}
                fullName={item?.studio?.name ? item?.studio?.name : null}
                description={item?.text}
                startDate={item?.studio?.createdAt}
                endDate={item?.studio?.createdAt}
                hours={60}
                status={item?.status}
                price={item?.price}
                bookingType={_filterType?.current}
            />
        )
    };


    return (
        <View style={{ flex: 1 }}>
            <AppHeader
                onLeftPress={() => props.navigation.goBack()}
                onRightPress={() => props.navigation.navigate('DummyScreen')}
                rightIcon={() => (
                    <Image
                        source={require('../../../../assets/icons/analytics-1.png')}
                        style={{ width: wp('6'), resizeMode: 'contain', tintColor: '#FFF' }}
                    />
                )} />

            <View style={{ alignItems: 'center', }}>
                <ScrollView contentContainerStyle={styles.filterContainer} horizontal showsHorizontalScrollIndicator={false}>

                    {filterTypes.map((item, idx) => {
                        return (
                            <View style={{}}>
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => onFilterChange(item, idx)}
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
                                            idx === locationFilterTypeIdx ? { color: '#FFF', } : null,
                                        ]}
                                    >
                                        {item}
                                    </ResponsiveText>
                                </TouchableOpacity>
                            </View>

                        )
                    })}
                </ScrollView>
            </View>

            {/* <View
                style={{ alignItems: 'center' }}
            > */}
            {/* <ScrollView> */}
            {/* <> */}
            {/* {data.length && */}
            < FlatList contentContainerStyle={{ alignItems: 'center' }}
                data={data}
                // showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item?._id}
                onEndReached={() => loadMoreFeeds()}
                onEndReachedThreshold={0.1}
                // ListEmptyComponent={
                //     <View style={{ flex: 1, alignItems: 'center', marginVertical: hp(8) }}>
                //         <ResponsiveText style={{ fontSize: 6, }}>No Data</ResponsiveText>
                //     </View>
                // }
                renderItem={renderItem}

            />
            {/* } */}
            {/* </> */}

            {/* </ScrollView> */}

            {/* </View> */}

        </View >
    );
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        // borderRadius: 30,
        borderWidth: 1,
        // width: wp(100),
        height: hp(6.5),
        elevation: 3,
        // borderWidth: 0,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 10,

        // marginLeft: wp(5),
        marginRight: wp(5),
        // padding: wp(35)
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
        fontWeight: 'bold',
        // width: wp(30),
        textAlign: 'center',


    },
    filterTypeActive: {
        backgroundColor: Colors.Primary,
        // backgroundColor: 'red',
        borderRadius: 10,

    },
})


function mapStateToProps(state) {
    return {

        token: state.auth.token,
        userData: state.auth.user
    }
}


function mapDispatchToProps(dispatch) {
    return
    {

    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Scheduled)