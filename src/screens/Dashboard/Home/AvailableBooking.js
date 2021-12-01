import React from 'react'
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import AppHeader from '../../../components/layout/AppHeader';
import Input from '../../../components/layout/Input';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Content from '../../../components/layout/Content';
import Button from '../../../components/layout/Button';
import ResponsiveText from '../../../components/layout/ResponsiveText';
import axios from 'axios';


export default function AvailableBooking(props) { 
    return (

        <View style={{ flex: 1 }}>
            <AppHeader onLeftPress={() => props.navigation.goBack()} />
            <Content style={styles.content}>
                <FlatList
                    data={Data}
                    renderItem={({ item }) => (
                        <View style={styles.mainContainer}>
                            <View style={{ padding: 10, }}>
                                <ResponsiveText style={styles.mainTitle}>{item.title}</ResponsiveText>
                                <ResponsiveText style={{ marginTop: 10, color: '#222529' }}>{item.msg}</ResponsiveText>
                                <View style={{ backgroundColor: 'grey', borderColor: '#DCDCDC', height: '0.3%', width: '80%', marginVertical: 10, alignSelf: 'center' }} />

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <View style={{ width: '70%' }} >

                                        <View style={{ justifyContent: 'space-between' }}>

                                            <View style={{ flexDirection: 'row' }}>

                                                <Image
                                                    style={styles.tinyLogo}
                                                    source={{ uri: item.img }}
                                                />

                                                <View style={{ left: 10, alignSelf: 'center' }}>
                                                    <ResponsiveText >{item.name}</ResponsiveText>
                                                    <ResponsiveText style={{ fontSize: 3.2, color: 'grey' }}>{item.date}</ResponsiveText>

                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                    <View style={{ width: '30%', alignSelf: 'center' }} >
                                        <TouchableOpacity style={styles.proceedBtnContainer}>
                                            <ResponsiveText style={{ color: 'white' }}>Reply</ResponsiveText>
                                        </TouchableOpacity>
                                    </View>
                                </View>



                            </View>
                        </View>
                    )}
                />


            </Content>
        </View>
    )
};



const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 8,
        backgroundColor: '#FCFCFC',

    },
    mainTitle: {
        fontSize: 4,
        fontWeight: 'bold'
    },
    errorMessage: {
        color: 'red',
        marginTop: 10
    },
    tinyLogo: {
        width: 50,
        height: 50,
        borderRadius: 100,

    },
    mainContainer: {
        backgroundColor: '#fff',
        elevation: 2,
        margin: 2,
        marginVertical: 2,
        borderRadius: 5,
        zIndex: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        color: '#000',
        paddingVertical: 5,
        flex: 1

    },
    proceedBtnContainer: {
        height: 40,
        width: '80%',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#0099A2',
        borderRadius: 10,
        justifyContent: 'center'
    },
})