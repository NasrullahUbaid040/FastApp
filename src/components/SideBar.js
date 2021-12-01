import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import ResponsiveText from "./layout/ResponsiveText";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Cross from '../assets/icons/x.png';
import Walk from '../assets/icons/walk.png'
import Bus from '../assets/icons/bus.png';
import Bike from '../assets/icons/bike.png';
import Car from '../assets/icons/car.png';
import CurrentLocation from '../assets/icons/baseline-my_location-24px.png'

const SideBar = (props) => {
    // console.log('...............................', props.distance)

    const modeDriving = (b) => {
        if (b < 60) {
            c = b / 60
            let a = Math.ceil(c)
            return a
        }
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Image style={{ width: 10, height: 10, marginBottom: 5 }} source={Cross} />
            </TouchableOpacity>


            <TouchableOpacity style={{ alignItems: 'center', marginTop: 10 }}>
                <Image style={styles.barIconsStyle} source={Car} />
                <ResponsiveText style={styles.iconTextStyle}>
                    18 min
                </ResponsiveText>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 15 }}>
                <Image style={styles.barIconsStyle} source={Bus} />
                <ResponsiveText style={styles.iconTextStyle}>
                    15 min
                </ResponsiveText>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 15 }}>
                <Image style={styles.barIconsStyle} source={Walk} />
                <ResponsiveText style={styles.iconTextStyle}>
                    43 min
                </ResponsiveText>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 15 }}>
                <Image style={styles.barIconsStyle} source={Bike} />
                <ResponsiveText style={styles.iconTextStyle}>
                    21 min
                </ResponsiveText>
            </TouchableOpacity>


        </View>


    )
}
const styles = {
    container: {
        backgroundColor: '#0099A2',
        width: 40,
        height: wp(62),
        borderRadius: 10,
        position: 'absolute',
        right: 5,
        top: wp(35),
        alignItems: 'center',
        paddingVertical: 10

    },
    barIconsStyle: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginBottom: 3
    },
    iconTextStyle: {
        fontSize: 2.5,
        color: 'white'
    },
    currentStyle: {
        backgroundColor: '#FFFFFF',
        width: 40,
        height: 40,
        borderRadius: 10,
        // marginTop:30,
        justifyContent: 'center',
        alignItems: 'center',
        // position: 'absolute',
        // bottom:-3
    }
}
export default SideBar
