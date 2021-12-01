import React, { useEffect, useState } from 'react'
import { View, Text, Image } from "react-native";
import Colors from "../theme/colors";
import StarIconCard from "./StarIconCard";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import ResponsiveText from './layout/ResponsiveText';



const StarCard = (props) => {

    const [data, setData] = useState([])
    const dumy = [
        {
            "_id": 1,
            "total": 0
        },
        {
            "_id": 2,
            "total": 0
        },
        {
            "_id": 3,
            "total": 0
        },
        {
            "_id": 4,
            "total": 0
        },
        {
            "_id": 5,
            "total": 0
        }
    ]

    useEffect(() => {
        console.log('totalRating.........', props)
        if (props?.info) {
            let sorting = props?.info.sort((a, b) => {
                let _a = a._id;
                let _b = b._id;
                return _a - _b;
            })
            // console.log('sorting>>>>>>>>>', sorting)
            setData(sorting)
        }
        else {
            setData(dumy)
        }




    }, [props.info])
    return (
        <View>
            {data.length ?
                <View>
                    <View style={styles.subView}>
                        <StarIconCard count={5} />
                        <View style={styles.greyView1}>
                            <View style={{ ...styles.whiteView1, width: data[4]?.count ? `${data[4].count / props.totalRatings * 100}%` : 0 }} />
                            {/* <View style={{ ...styles.whiteView1, width: 10 }} /> */}
                        </View>
                        {/* <ResponsiveText>{props.totalRatings} </ResponsiveText> */}
                    </View>

                    <View style={styles.subView}>
                        <StarIconCard count={4} />
                        <View style={styles.greyView2}>
                            <View style={{ ...styles.whiteView2, width: data[3] ?.count ? `${data[3].count / props.totalRatings * 100}%` : 0 }} />

                        </View>
                    </View>

                    <View style={styles.subView}>
                        <StarIconCard count={3} />
                        <View style={styles.greyView3}>
                            <View style={{ ...styles.whiteView1, width: data[2] ?.count ? `${data[2].count / props.totalRatings * 100}%` : 0 }} />
                        </View>
                    </View>

                    <View style={styles.subView}>
                        <StarIconCard count={2} />
                        <View style={styles.greyView4}>
                            <View style={{ ...styles.whiteView4, width: data[1] ?.count ? `${data[1].count / props.totalRatings * 100}%` : 0 }} />
                        </View>
                    </View>

                    <View style={styles.subView}>
                        <StarIconCard />
                        <View style={styles.greyView5}>
                            <View style={{ ...styles.whiteView5, width: data[0]?.count ? `${data[0].count / props.totalRatings * 100}%` : 0 }} />
                        </View>
                    </View>
                </View>

                : null}

        </View>
    )
}

const styles = {
    subView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    greyView1: {
        backgroundColor: 'grey',
        height: 4,
        width: '65%',
        borderRadius: 10
    },
    whiteView1: {
        backgroundColor: Colors.Primary,
        height: 4,
        // width: '80%',
        // width: wp(props?.info[1].total / 100 * 17),
        borderRadius: 10
    },
    greyView2: {
        backgroundColor: 'grey',
        height: 4,
        width: '65%',
        borderRadius: 10
    },
    whiteView2: {
        backgroundColor: Colors.Primary,
        height: 4,
        // width: '30%',
        borderRadius: 10
    },
    greyView3: {
        backgroundColor: 'grey',
        height: 4,
        width: '65%',
        borderRadius: 10
    },
    whiteView3: {
        backgroundColor: Colors.Primary,
        height: 4,
        width: '80%',
        borderRadius: 10
    },
    greyView4: {
        backgroundColor: 'grey',
        height: 4,
        width: '65%',
        borderRadius: 10
    },
    whiteView4: {
        backgroundColor: Colors.Primary,
        height: 4,
        width: '10%',
        borderRadius: 10
    },
    greyView5: {
        backgroundColor: 'grey',
        height: 4,
        width: '65%',
        borderRadius: 10
    },
    whiteView5: {
        backgroundColor: Colors.Primary,
        height: 4,
        width: '25%',
        borderRadius: 10
    }

}

export default StarCard
