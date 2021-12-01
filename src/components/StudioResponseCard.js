import React from 'react'
import {View,Text,Image,TouchableOpacity} from "react-native";
import ResponsiveText from "./layout/ResponsiveText";
import message from  '../assets/icons/message.png'
import dots from  '../assets/icons/dots.png'

const StudioResponseCard = (props) => {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={styles.parentView}>
         <View style={styles.subView}>
             <View>
             <Image source={{uri : 'https://picsum.photos/seed/picsum/200/300'}} style={styles.profileImage} />
             </View>
             <View style={{flex: 1,justifyContent: 'space-between'}}>
                 <ResponsiveText>{props.item.title}</ResponsiveText>
                 <ResponsiveText style={{fontSize: 2.5,color: 'grey'}}>{props.item.date}</ResponsiveText>
             </View>
             <View style={{justifyContent: 'flex-end'}}>
                 <Image source={message} style={styles.messageImage} />
             </View>
             <View style={{justifyContent: 'flex-end'}}>
                 <Image source={dots} style={{height: 25,width: 25}} />
             </View>
         </View>
            <View style={styles.paragraphView}>
            <View style={{width: 50}} />
            <View>
                <ResponsiveText style={{fontSize: 3.5,paddingVertical: 10,color:'grey'}}>{props.item.paragraph}</ResponsiveText>
            </View>
            </View>
        </TouchableOpacity>
    )
}

const styles={
    parentView : {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 15
    },
    subView: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 15
    },
    profileImage : {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 10
    },
    messageImage : {
        height: 25,
        width: 25,
        tintColor: 'lightblue'
    },
    paragraphView : {
        flexDirection: 'row',
        flexWrap: 'wrap'
        ,marginLeft: 60,
        marginRight: 20
    }
}

export default StudioResponseCard
