import React from 'react'
import {View, Text, Image} from "react-native";
import star from "../assets/icons/star.png";




const StarIconCard = (props) => {
    return (
        <View style={{minWidth: 60,justifyContent: 'flex-end',alignItems: 'flex-end',marginRight: 10}}>
        <View style={{flexDirection: 'row'}}>
            {[...Array(props.count)].map((item, index) => {
                return (
                    <View key={index}>
                        <Image source={star} style={{height: 10,width: 12}} />
                    </View>

                );
            })}
        </View>
        </View>
    )
}

export default StarIconCard
