import React from 'react'
import { View, FlatList } from "react-native";
import Container from "../../../components/layout/Container";
import AppHeader from "../../../components/layout/AppHeader";
import Content from "../../../components/layout/Content";
import StudioResponseCard from '../../../components/StudioResponseCard'
import { dummyStudioData } from '../../../components/DummyData/dummyData'

const StudioResponse = (props) => {
    return (
        <Container style={{ backgroundColor: '#F0F0F0' }}>
            <AppHeader
                onLeftPress={() => props.navigation.goBack()}
                title={'Studio Response'}
            />
            <View style={{ marginHorizontal: 10, marginTop: 15, backgroundColor: '#F0F0F0' }}>
                <FlatList
                    keyExtractor={(item, index) => item.id}
                    data={dummyStudioData}
                    renderItem={({ item, index }) => {
                        return <StudioResponseCard onPress={() => { props.navigation.navigate('MyBookings') }} item={item} />
                    }}

                />
            </View>
        </Container>
    )
}

const styles = {}

export default StudioResponse
