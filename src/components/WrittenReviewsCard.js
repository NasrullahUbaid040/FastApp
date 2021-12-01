import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import ResponsiveText from "./layout/ResponsiveText";
import Star from 'react-native-star-view';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';


const WrittenReviewsCard = (props) => {
    console.log('props>>>>>>>>>>>>>>>>>>>>>>>>>> >', props.item.reviewer.username)
    const navigation = useNavigation();
    return (
        <View style={styles.mainView}>
            <View>
                {/* :TODO: working here */}
                <View style={[styles.inner, { marginTop: 10 }]}>
                    <ResponsiveText numberOfLines={1} style={{ width: '60%' }} >{props.item.title}</ResponsiveText>
                    <ResponsiveText numberOfLines={1} style={{ width: '35%', textAlign: 'right' }} >{props.item.reviewer.username}</ResponsiveText>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                    <Star score={props.item.rating} style={styles.starStyle} />
                    <ResponsiveText style={{ color: 'grey' }}>{moment(props.item.date).endOf('day').fromNow()}</ResponsiveText>
                </View>
                <ResponsiveText style={{ marginTop: 10 }}>
                    {props.item.description}
                </ResponsiveText>


            </View>
        </View >

        // <View style={{ marginTop: 30 }}>
        //     <View style={styles.mainView}>
        //         <View style={styles.subView}>
        //             <View>


        //                 <View style={{ justifyContent: 'space-between' }}>
        //                     <ResponsiveText style={{ fontWeight: 'bold' }}>{props.item.title}</ResponsiveText>
        //                     <ResponsiveText style={{ fontWeight: 'bold' }}>Hello</ResponsiveText>
        //                 </View>


        //                 <Star score={props.item.rating} style={styles.starStyle} />
        //             </View>
        //             <View>
        //                 <TouchableOpacity onPress={() => { navigation.navigate('Profile') }}>
        //                     <ResponsiveText style={{ fontSize: 3.5 }}>{props.item.name}</ResponsiveText>
        //                 </TouchableOpacity>

        //                 <ResponsiveText style={{ fontSize: 3.5, color: 'grey', marginLeft: -2 }}>
        //                     {props?.item?.reviewer?.username}
        //                 </ResponsiveText>
        //                 <ResponsiveText style={{ fontSize: 3.5, color: 'grey', marginLeft: -2 }}>
        //                     {moment(props.item.date).endOf('day').fromNow()}
        //                 </ResponsiveText>
        //             </View>
        //         </View>
        //         <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
        //             <Text>{props.item.description}</Text>
        //         </View>
        //     </View>
        // </View>
    )

}

const styles = {
    starStyle: {
        width: 80,
        height: 20,
        marginRight: 20,
    },
    inner: { flexDirection: 'row', justifyContent: 'space-between' },

    mainView: {
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
        padding: 10,
        marginTop: 5
    },
    subView: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginBottom: 20
    }
}

export default WrittenReviewsCard
