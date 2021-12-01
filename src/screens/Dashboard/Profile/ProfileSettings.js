import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
import Container from "../../../components/layout/Container";
import AppHeader from "../../../components/layout/AppHeader";
import Content from "../../../components/layout/Content";
import ResponsiveText from "../../../components/layout/ResponsiveText";
import Colors from "../../../theme/colors";
import ProfileSettingsCard from "../../../components/ProfileSettingsCard";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import axios from "axios"
import { connect } from 'react-redux';
import { setError, updateData } from '../../../redux/actions/authActions'
import Button from '../../../components/layout/Button';
import Auth from '../../../services/Auth';
import ImageUplaod from '../../../services/ImageUplaod'


const ProfileSettings = (props) => {
    useEffect(() => {
        // console.log('user data.....>', props.userData)
        props.setMyError("")
        console.log('user props.....>', props.userData.imgUrl)
        setNewImg(props?.userData?.imgUrl)
        setDummyImg(props?.userData?.imgUrl)

        setName(props.userData.name)
        setUsername(props.userData.username)
        setEmail(props.userData.email)
        setBio(props.userData.bio)
        setPhone(props.userData.phone.number)
        setGender(props.userData.gender)


    }, [])

    const [showUploadBox, setShowUploadBox] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploadImage, setUploadImage] = useState('')

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('Please select your type')
    const [phone, setPhone] = useState('')
    const [dummyImg, setDummyImg] = useState('http://www.wrnrtv.com/wp-content/uploads/2017/05/male.png')
    const [newImg, setNewImg] = useState('')
    const [showtype, setshowtype] = useState(false);




    const uploadPhoto = () => {
        console.log('uploadPhoto')
        launchCamera({
            mediaType: 'photo',
            storageOptions: {
                skipBackup: true,
                path: 'Pictures/myAppPicture/', //-->this is neccesary
                privateDirectory: true,
            },
        },
            (response) => {
                console.log('camera image found', response.uri)
                setNewImg(response.uri)
            },
        );
        setShowUploadBox(false)
    }



    const getImageUri = (uploadImage) => {
        console.log('uploadImage....', uploadImage)


        ImageUplaod.UploadmyImage(uploadImage)
            .then(res => res.data)
            .then(res => {
                setNewImg(res.files[0].Location)
                console.log('res__________', res.files[0].Location)


            })
            .catch(err => {
                console.log('error')
                console.log(err);
            })


    }

    const chooseFromGallery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 200,
            maxWidth: 200,
            storageOptions: {
                // skipBackup: true,
                // path: 'Pictures/myAppPicture/', //-->this is neccesary
                privateDirectory: true,
            },
        },
            (response) => {
                console.log('response..', response.uri)
                setUploadImage(response.uri)
                getImageUri(response.uri)

            },
        );
        setShowUploadBox(false)
    }


    const updateProfile = async () => {
        if (name.length === 0) {
            console.log('error in name')
            await props.setMyError(
                "Please enter name")
        }
        else if (username.length === 0) {
            await props.setMyError(
                "Please enter user name")
        } else if (bio.length === 0) {
            await props.setMyError(
                "Please enter bio")
        } else if (email.length === 0) {
            await props.setMyError(
                "Please enter valid email")
        }
        else if (phone.length === 0) {
            await props.setMyError(
                "Please enter phone")
        } else if (gender == "Please select your gender") {
            await props.setMyError(
                "Please select gender")
        }

        else {
            // console.log("name:::", name, "username:::", username, "bio:::", bio, "email::", email, "phone:::", phone.number, "gender", gender)

            props.setMyError(" ");
            axios.put(`${API_URL}/user/update-profile`, {
                "name": name,
                "username": username,
                "bio": bio,
                "email": email,
                // "imgUrl": uploadImage ? uploadImage : dummyImg,
                "imgUrl": newImg,
                "gender": gender,
                "phone": {
                    "code": "+92",
                    "number": phone
                }

            }, {
                headers: { 'x-auth-token': `${props.token}` }
            })
                .then(res => res.data)
                .then(res => {
                    props.setMyUserData(res)
                    Alert.alert(
                        "Profile updated",
                        "Profile has been updated successfully!",
                        [{ text: "OK", onPress: () => props.navigation.goBack() }]
                    );
                })
                .catch((err) => {
                    console.log('ERROR:::', err)
                });
        }
    }
    const updateType = (props) => {
        console.log('updateType:::', props);
        setGender(props)
        setshowtype(false)
    };






    return (
        <Container>
            <AppHeader title={'Profile Settings'} onLeftPress={() => props.navigation.goBack()} />
            <Content>
                <TouchableOpacity style={{ alignSelf: 'center', marginTop: 30, alignItems: 'center' }} onPress={() => setShowUploadBox(true)} >
                    <Image source={{ uri: uploadImage ? uploadImage : dummyImg }} style={styles.profileImage} />
                    <ResponsiveText style={styles.changeText}>Change Profile Photo</ResponsiveText>
                </TouchableOpacity>

                {/* __________________INPUT FIELD_______________ */}

                <View style={{ flex: 1, marginTop: 40, marginHorizontal: 25 }}>

                    <View style={{ marginBottom: 15 }}>
                        <ResponsiveText style={{ color: 'lightgrey', fontSize: 3.5 }}>Name</ResponsiveText>
                        <TextInput maxLength={20} placeholder='Enter your Name...' value={name} placeholderTextColor='black' style={styles.textInput} onChangeText={e => setName(e)} />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <ResponsiveText style={{ color: 'lightgrey', fontSize: 3.5 }}>Username</ResponsiveText>
                        <TextInput maxLength={20} placeholder='Enter your Username...' value={username} placeholderTextColor='black' style={styles.textInput} onChangeText={e => setUsername(e)} />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <ResponsiveText style={{ color: 'lightgrey', fontSize: 3.5 }}>Bio</ResponsiveText>
                        <TextInput maxLength={125} placeholder='Enter your Bio...' value={bio} placeholderTextColor='black' style={styles.textInput} onChangeText={e => setBio(e)} />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <ResponsiveText style={{ color: 'lightgrey', fontSize: 3.5 }}>Email</ResponsiveText>
                        <TextInput maxLength={30} editable={false} placeholder='Enter your Email...' value={email} placeholderTextColor='black' style={styles.textInput} onChangeText={e => setEmail(e)} />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <ResponsiveText style={{ color: 'lightgrey', fontSize: 3.5 }}>Phone</ResponsiveText>
                        <TextInput maxLength={12} keyboardType={'numeric'} placeholder='Enter your Phone...' value={phone} placeholderTextColor='black' style={styles.textInput} onChangeText={e => setPhone(e)} />
                    </View>
                    {/* <View style={{ marginBottom: 15 }}>
                        <ResponsiveText style={{ color: 'lightgrey', fontSize: 3.5 }}>Gender</ResponsiveText>
                        <TextInput maxLength={6} placeholder='Your Gender...' value={gender} placeholderTextColor='black' style={styles.textInput} onChangeText={e => setGender(e)} />
                    </View> */}


                    <TouchableOpacity style={styles.btndrop}
                        onPress={() => setshowtype(!showtype)}>
                        <View style={styles.dropField}>
                            <Image
                                source={require('../../../assets/icons/people-outline.png')}
                                style={{ marginLeft: 10, height: wp(6), width: wp(6), resizeMode: 'contain', tintColor: Colors.Primary }}
                            />
                        </View>
                        <View style={styles.dropField2}>
                            <ResponsiveText style={{ marginLeft: 10 }}>{gender}</ResponsiveText>
                        </View>
                        <View style={styles.dropField}>
                            <Image
                                source={!showtype ? require('../../../assets/icons/Path.png') : require('../../../assets/icons/PathA.png')}
                                style={{
                                    height: 12, width: 12, resizeMode: 'contain', alignSelf: 'center',
                                }}
                            />
                        </View>
                    </TouchableOpacity>


                    {showtype &&

                        <View >

                            <TouchableOpacity style={styles.droptext} onPress={() => updateType("Male")}>
                                <ResponsiveText>Male</ResponsiveText>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.droptext} onPress={() => updateType("Female")}>
                                <ResponsiveText>Female</ResponsiveText>
                            </TouchableOpacity>
                        </View>
                    }

                    <ResponsiveText style={{ color: 'red' }}>
                        {props.ErrorMesassage}
                    </ResponsiveText>
                </View>
                {/* __________________INPUT FIELD_______________ */}
                {/* <ProfileSettingsCard /> */}


                <TouchableOpacity
                    onPress={updateProfile}

                    style={styles.buttonView}>
                    <ResponsiveText style={{ paddingVertical: 10, color: 'white' }}>Save</ResponsiveText>
                </TouchableOpacity>

            </Content>
            {showUploadBox && (
                <View style={styles.uploadOptionsContainer}>
                    <TouchableOpacity
                        style={styles.captureOptionItem}
                        activeOpacity={0.9}
                        onPress={uploadPhoto}>
                        <ResponsiveText>Capture Image</ResponsiveText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.captureOptionItem, { borderBottomWidth: 0 }]}
                        activeOpacity={0.9}
                        onPress={chooseFromGallery}>
                        <ResponsiveText>Choose from Gallery</ResponsiveText>
                    </TouchableOpacity>
                </View>
            )}
        </Container>
    )
}

const styles = {
    profileImage: {
        height: 100,
        width: 100,
        borderRadius: 50
    },
    btndrop: {
        height: wp('13%'),
        width: '100%',
        backgroundColor: Colors.Secondary,
        borderRadius: wp('2%'),
        flexDirection: 'row'
    },
    dropField2: {
        width: '76%', height: '100%', justifyContent: 'center',

    },
    changeText: {
        color: Colors.Primary,
        marginTop: 10
    },
    dropField: {
        width: '12%', height: '100%', alignItems: 'center', justifyContent: 'center'
    },
    buttonView: {
        backgroundColor: Colors.Primary,
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 5
    },
    uploadOptionsContainer: {


        position: 'absolute',
        backgroundColor: '#fff',
        width: wp('80'),
        borderRadius: 15,
        alignSelf: 'center',
        top: '50%',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    captureOptionItem: {
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        height: 50,
        textAlign: 'center',
        justifyContent: 'center',
    },

}

// export default ProfileSettings;

function mapStateToProps(state) {
    return {

        token: state.auth.token,
        ErrorMesassage: state.auth.errorMessage,
        userData: state.auth.user


    }
}

function mapDispatchToProps(dispatch) {
    return {
        setMyError: (payload) => dispatch(setError(payload)),
        setMyUserData: (payload) => dispatch(updateData(payload))

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);