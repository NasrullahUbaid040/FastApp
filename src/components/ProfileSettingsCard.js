import React, { useState } from 'react'
import { View, Text, TextInput } from "react-native";
import ResponsiveText from "./layout/ResponsiveText";

const ProfileSettingsCard = () => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [gender, setGender] = useState('')
    return (
        <View style={{ flex: 1, marginTop: 40, marginLeft: 25 }}>
            <View style={{ marginBottom: 15 }}>
                <ResponsiveText style={{ color: 'lightgrey', fontSize: 3.5 }}>Name</ResponsiveText>
                <TextInput placeholder='Enter your Name...' placeholderTextColor='black' style={styles.textInput} onChangeText={e => setName(e)} />
            </View>
            <View style={{ marginBottom: 15 }}>
                <ResponsiveText style={{ color: 'lightgrey', fontSize: 3.5 }}>Username</ResponsiveText>
                <TextInput placeholder='Enter your Username...' placeholderTextColor='black' style={styles.textInput} onChangeText={e => setUsername(e)} />
            </View>
            <View style={{ marginBottom: 15 }}>
                <ResponsiveText style={{ color: 'lightgrey', fontSize: 3.5 }}>Bio</ResponsiveText>
                <TextInput placeholder='Enter your Bio...' placeholderTextColor='black' style={styles.textInput} onChangeText={e => setBio(e)} />
            </View>
            <View style={{ marginBottom: 15 }}>
                <ResponsiveText style={{ color: 'lightgrey', fontSize: 3.5 }}>Email</ResponsiveText>
                <TextInput placeholder='Enter your Email...' placeholderTextColor='black' style={styles.textInput} onChangeText={e => setEmail(e)} />
            </View>
            <View style={{ marginBottom: 15 }}>
                <ResponsiveText style={{ color: 'lightgrey', fontSize: 3.5 }}>Phone</ResponsiveText>
                <TextInput placeholder='Enter your Phone...' placeholderTextColor='black' style={styles.textInput} onChangeText={e => setPhone(e)} />
            </View>
            <View style={{ marginBottom: 15 }}>
                <ResponsiveText style={{ color: 'lightgrey', fontSize: 3.5 }}>Gender</ResponsiveText>
                <TextInput placeholder='Your Gender...' placeholderTextColor='black' style={styles.textInput} onChangeText={e => setGender(e)} />
            </View>

        </View>
    )
}

const styles = {
    textInput: {
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
        width: '90%',
        height: 40,
        textAlignVertical: 'top',
    }

}

export default ProfileSettingsCard;
