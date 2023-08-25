import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ScrollView, Alert, Text } from 'react-native';
import GlobalStyles from '../../styles/style';
import HeaderBar from '../../components/HeaderBar';
import CustomizedInput from '../../components/CustomizedInput';
import PrimaryButton from '../../components/PrimaryButton';
import PasswordInput from '../../components/PasswordInput';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import GoDeliveryColors from '../../styles/colors';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native';
import storage from '@react-native-firebase/storage'; // Import the firestore module
import store from '../../redux/store';
import { useFocusEffect } from '@react-navigation/native';
import Action from '../../service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import allActions from '../../redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import CustomizedPhoneInput from '../../components/CustomizedPhoneInput';

interface ScreenProps {
    navigation: any;
}

const ProfileScreen = ({ navigation }: ScreenProps): JSX.Element => {
    var currentUser = store.getState().CurrentUser.user;
    const [userData, setUserData] = useState({});
    const [avatarUri, setAvatarUri] = useState(currentUser.avatar);
    const [phone, setPhone] = useState(currentUser.phone.slice(3));
    const [phoneError, setPhoneError] = useState('');
    const [username, setUsername] = useState(currentUser.name);
    const [usernameError, setUsernameError] = useState('');
    const [password, setPassword] = useState('');
    const [modalActivitiIndicator, setModalActivityIndicator] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [activiIndicator, setActivityIndicator] = useState(false);

    const dispatch = useDispatch();

    const storeData = async (userData: any) => {
        try {
            await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
        } catch {
            console.log('error occured!');
        }
    }

    const validateForm = () => {
        var validFlag = true;
        if (phone.length != 9) {
            setPhoneError('Please insert valid phone number.');
            validFlag = false;
        } else {
            setPhoneError('');
        }
        if (!username) {
            setUsernameError('Please insert user name.');
            validFlag = false;
        } else {
            setUsernameError('');
        }
        return validFlag;
    }

    const handleSubmit = () => {
        if (validateForm()) {
            setActivityIndicator(true);
            const param = {
                clientId: store.getState().CurrentUser.user.id
            }
            if (avatarUri) {
                param.avatar = avatarUri;
            }
            if (phone) {
                param.phone = `258${phone}`;
            }
            if (username) {
                param.name = username;
            }
            if (password) {
                param.password = password;
            }

            Action.client.updateProfile(param)
                .then((res) => {
                    const response = res.data;
                    if (response.success) {
                        Alert.alert("Save success!");
                        dispatch(allActions.UserAction.setUser(response.data));
                        storeData(response.data);
                    }
                    setActivityIndicator(false);
                }).catch((err) => {
                    console.log("error: ", err);
                    setActivityIndicator(false);
                });
        }
    }

    const setPickerResponse = async (response: any) => {
        setModalActivityIndicator(true);
        try {
            const uri = response?.assets[0].uri;
            const storageRef = storage().ref();
            const imageRef = storageRef.child('images/' + Date.now()); // Use a unique path for each upload

            const res = await fetch(uri);
            const blob = await res.blob();
            //upload image to firebase storage
            await imageRef.put(blob);
            // Get the public download URL
            const downloadURL = await imageRef.getDownloadURL();
            console.log('Image uploaded successfully');
            console.log('Download URL:', downloadURL);
            setAvatarUri(downloadURL.toString());
            setModalActivityIndicator(false);
            setModalVisible(false);
        } catch (error) {
            console.error('Error uploading image: ', error);
            setModalActivityIndicator(false);
        }
    };

    const onImageLibraryPress = () => {
        const options = {
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: false,
        };
        launchImageLibrary(options, setPickerResponse);
    };

    const onCameraPress = () => {
        const options = {
            saveToPhotos: true,
            mediaType: 'photo',
            includeBase64: false,
            cameraType: 'front',
        };
        launchCamera(options, setPickerResponse);
    };

    useFocusEffect(
        useCallback(() => {
            currentUser = store.getState().CurrentUser.user;
            setUsername(currentUser.name);
            setPhone(currentUser.phone.slice(3));
        }, [])
    );

    return (
        <View style={[GlobalStyles.container]}>
            <HeaderBar navigation={navigation} title={'MY PROFILE'} />
            <ScrollView style={GlobalStyles.container}>
                <View style={styles.avatarArea}>
                    <View style={{ width: 160, height: 160 }}>
                        {
                            !avatarUri && (<Image source={require('../../../assets/images/user_default_avatar.png')} style={styles.avatarImg} />)
                        }
                        {
                            avatarUri && (<Image source={{ uri: avatarUri }} style={styles.avatarImg} />)
                        }

                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(true);
                            }}
                            style={{
                                backgroundColor: GoDeliveryColors.place,
                                padding: 10,
                                borderRadius: 100,
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                            }}>
                            <FeatherIcon
                                name="camera"
                                size={25}
                                style={{
                                    color: GoDeliveryColors.primary,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.profileFormArea}>
                    <View style={{ marginTop: 20 }}>
                        <CustomizedPhoneInput value={phone} handler={setPhone} placeholder='phone number' />
                        {/* <CustomizedInput icon='call-outline' placeHolder='Phone number' keyboardType='number' handler={setPhone} val={phone} /> */}
                        <Text style={styles.textFieldErrorMsgArea}>{phoneError}</Text>
                        <CustomizedInput icon='person-outline' placeHolder='Username' handler={setUsername} val={username} />
                        <Text style={styles.textFieldErrorMsgArea}>{usernameError}</Text>
                        <PasswordInput handler={(val) => { setPassword(val) }} />
                        <View style={styles.textFieldErrorMsgArea}>
                        </View>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <PrimaryButton buttonText='Submit' handler={handleSubmit} />
                    </View>
                </View>
            </ScrollView>
            {
                activiIndicator && <ActivityIndicator size="large" style={{ position: 'absolute', bottom: 150, alignSelf: 'center' }} />
            }
            <Modal
                isVisible={isModalVisible}
                onSwipeComplete={() => setModalVisible(false)}
                onBackdropPress={() => { setModalVisible(false) }}
                swipeDirection={['down']}
                propagateSwipe={true}
                style={styles.modalContainer}>
                <View style={styles.modalContentContainer}>
                    {modalActivitiIndicator && (
                        <ActivityIndicator
                            size="large"
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                            }}
                        />
                    )}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 40,
                        }}>
                        <TouchableOpacity
                            style={styles.modalButtonBack}
                            onPress={onImageLibraryPress}>
                            <FeatherIcon
                                name="image"
                                color={GoDeliveryColors.white}
                                size={30}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButtonBack}
                            onPress={onCameraPress}>
                            <FeatherIcon
                                name="camera"
                                color={GoDeliveryColors.white}
                                size={30}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    avatarArea: {
        marginTop: 30,
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImg: {
        width: 160,
        height: 160,
        borderRadius: 200,
    },
    profileFormArea: {
        padding: 20,
        flex: 1,
    },
    textFieldErrorMsgArea: {
        height: 35,
        paddingLeft: 20,
        color: GoDeliveryColors.primary
    },
    modalContainer: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContentContainer: {
        backgroundColor: GoDeliveryColors.white,
        paddingVertical: 30,
        paddingHorizontal: 20,
        height: 150,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalButtonBack: {
        backgroundColor: GoDeliveryColors.primary,
        padding: 10,
        borderRadius: 100,
    },
});

export default ProfileScreen;