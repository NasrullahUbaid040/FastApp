import React, { Component } from 'react';
import { View, Text } from 'react-native'
import { BarIndicator } from 'react-native-indicators';
const ActivityLoader = ({ enable }) => {
    return (
        <View
            style={{
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.2)'

            }}>
            <BarIndicator color='#0099A2' />
        </View >
    )
}

export default ActivityLoader
