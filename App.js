

import 'react-native-gesture-handler';
import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    ActionSheetIOS,
    Alert,
    BackHandler,
    Linking,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogIn from './screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyStack from './Navigation/Stacknavigation';
import { UserContext } from './context/UserContext';
import MainLoader from './Componenets/MainLoader';
import BaseService from './services/BaseService';
import SplashScreen from 'react-native-splash-screen'

const RootStack = createStackNavigator();
const OtpStack = createStackNavigator();

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: false,
//         shouldSetBadge: false
//     })
// });

// export async function allowsNotificationsAsync() {
//     const settings = await Notifications.getPermissionsAsync();
//     return (
//       settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
//     );
//   }
componentDidMount=()=> {
    setTimeout(() => {
      SplashScreen.hide()
    }, 300)
}
const App = () => {

//    const componentDidMount=() =>{
//     	// do stuff while splash screen is shown
//         // After having done stuff (such as async tasks) hide the splash screen
//         SplashScreen.hide();
//     }


    const [userObj, setUserObj] = useState({
        storedId: null,
        storedToken: null,
        storedMobile: null,
        storedWarehouseName: null,
        storedWarehouseCode: null,
    });

    const initialUserState = {
        isLoading: true,
        userId: null,
        userToken: null,
        userMobile: null,
        userWarehouseName: null,
        userWarehouseCode: null,
    }

    // useEffect(() => {
    //     registerForPushNotificationsAsync();
    //     CheckAppVersionUpdate();

    //     setTimeout(async () => {
    //         try {
    //             userObj.storedId = await AsyncStorage.getItem('@id');
    //             userObj.storedToken = await AsyncStorage.getItem('@token');
    //             userObj.storedMobile = await AsyncStorage.getItem('@mobile');
    //             userObj.storedOtpStatus = await AsyncStorage.getItem('@isVerified')
    //             userObj.storedUserType = await AsyncStorage.getItem('@userType');
    //         } catch (e) {
    //             console.log("Error Unable to fetch loggedIn User", e.message);
    //         }

    //         BaseService.post('app/Login/login', { "mobileNo": userObj.storedMobile }).then(response => {
    //             let res = response.data;
    //             console.log(res);
    //             if (res.token == "" && response.status == 200) {
    //                 SignOut();
    //             }
    //             else if (response.status == 200 && res.id != userObj.storedId) {
    //                 SignOut();
    //             }
    //         }).catch(err => console.log(err))

    //         dispatch({
    //             type: 'RETRIEVE_TOKEN',
    //             userId: userObj.storedId,
    //             token: userObj.storedToken,
    //             mobile: userObj.storedMobile,
    //             otpStatus: JSON.parse(userObj.storedOtpStatus),
    //             userType: userObj.storedUserType
    //         });
    //     }, 1500);

    //     const unsubscribe = NetInfo.addEventListener(state => {
    //         if (!state.isConnected) {
    //             Alert.alert(
    //                 "Check your internet connection",
    //                 [
    //                     { text: 'OK' }
    //                 ],
    //                 { cancelable: true }
    //             );
    //             // Alert.alert('Check your internet connection');
    //         }
    //     });
    //     unsubscribe();
    // }, []);

    // const registerForPushNotificationsAsync = async () => {
    //     if (Constants.isDevice) {
    //         const { status: existingStatus } = await Notifications.getPermissionsAsync();
    //         let finalStatus = existingStatus;
    //         if (existingStatus !== 'granted') {
    //             const { status } = await Notifications.requestPermissionsAsync();
    //             finalStatus = status;
    //         }
    //         // if (finalStatus !== 'granted') {
    //         //      alert('Failed to get push token for push notification!');
    //         //     return;
    //         // }
    //         const token = (await Notifications.getExpoPushTokenAsync()).data;
    //         console.log('At line 53', token);
    //         await AsyncStorage.setItem('@MobileToken', token);
    //         //console.log('@MobileToken')
    
    //     } else {
    //         alert('Must use physical device for Push Notifications');
    //     }
    
    //     if (Platform.OS === 'android') {
    //         Notifications.setNotificationChannelAsync('default', {
    //             name: 'default',
    //             importance: Notifications.AndroidImportance.MAX,
    //             vibrationPattern: [0, 250, 250, 250],
    //             lightColor: '#FF231F7C',
    //         });
    //     }
    // };




    // const CheckAppVersionUpdate = async () => {
    //     try {
    //         const update = await Updates.checkForUpdateAsync();
    //         if (update.isAvailable) {
    //             await Updates.fetchUpdateAsync();

    //             Alert.alert(
    //                 'Update',
    //                 `Latest App Version Available`,
    //                 [
    //                     { text: 'OK', onPress: async () => await Updates.reloadAsync() }
    //                 ],
    //                 { cancelable: false }
    //             );
    //         }
    //     } catch (e) {
    //         console.log('Error thrown during app update check', e.message);
    //     }
    // }


    const userReducer = (prevState, action) => {
        switch (action.type) {
            case "LOGIN":
                return {
                    ...prevState,
                    userMobile: action.mobile,
                    userId: action.id,
                    userToken: action.token,
                    userWarehouseCode: action.pCode,
                    userWarehouseName: action.pName,
                    isLoading: false
                };
            case "LOGOUT":
                return {
                    ...prevState,
                    userId: null,
                    userToken: null,
                    userMobile: null,
                    userWarehouseCode: null,
                    userWarehouseName: null,
                    isLoading: false
                };
            // case "RETRIEVE_TOKEN":
            //     return {
            //         ...prevState,
            //         userToken: action.token,
            //         userId: action.userId,
            //         userMobile: action.mobile,
            //         isLoading: false,
            //     };

            default:
                return null;
        }
    }

    const [userState, dispatch] = React.useReducer(userReducer, initialUserState);

    const signInUser = async (pId, pToken, pCode , pName) => {
        // let otpStatus = false;
        if (pToken != null) {
            try {
                await AsyncStorage.setItem('@token', pToken);
                // await AsyncStorage.setItem('@mobile', pMobile);
                await AsyncStorage.setItem('@id', pId);
                await AsyncStorage.setItem('@WarehouseName', pName);
                await AsyncStorage.setItem('@WarehouseCode', pCode);
            } catch (e) {
                console.log(e)
            }
        }
        dispatch({ type: 'LOGIN', id: pId, token: pToken,  WarehouseName: pName, WarehouseCode: pCode });
    };


    // const VerifyOtp = async (isVerified) => {
    //     console.log('App.js Inside Verify Otp');
    //     isVerified = true;
    //     try {
    //         await AsyncStorage.setItem('@isVerified', JSON.stringify(isVerified));
    //     } catch (e) {
    //         console.log(e);
    //     }
    //     dispatch({ type: 'VERIFY_OTP', isOtpVerified: true });
    // };

    // const SignUpUser = async (pId, pToken, pMobile, pUserType) => {
    //     console.log('SignUp User Called');
    //     let otpStatus = false;
    //     if (pToken != null && pMobile != null && pUserType != null) {
    //         try {
    //             await AsyncStorage.setItem('@token', pToken);
    //             await AsyncStorage.setItem('@mobile', pMobile);
    //             await AsyncStorage.setItem('@id', pId);
    //             await AsyncStorage.setItem('@isVerified', JSON.stringify(false));
    //             await AsyncStorage.setItem('@userType', pUserType);


    //         } catch (e) {
    //             console.log(e)
    //         }
    //     }
    //     dispatch({ type: 'REGISTER', id: pId, token: pToken, mobile: pMobile, isVerified: otpStatus, userType: pUserType });
    // }


    const SignOut = async () => {
        try {
            await AsyncStorage.removeItem('@token');
            await AsyncStorage.removeItem('@mobile');
            await AsyncStorage.removeItem('@id');
            await AsyncStorage.removeItem('@WarehouseName');
            await AsyncStorage.removeItem('@WarehouseCode');
        } catch (e) {
            console.log(e)
        }
        dispatch({ type: 'LOGOUT' });
    }


    // if (userState.isLoading) {
    //     return (
    //         <MainLoader />
    //     )
    // };


    return (

        <UserContext.Provider value={{ data: userState, signInUser, SignOut}}>
            <NavigationContainer>
                {userState.userToken == null ?
                    <RootStack.Navigator>
                        <RootStack.Screen name="Login" component={LogIn}
                            options={{
                                headerShown: false
                            }}
                        />
                    </RootStack.Navigator>
                    :
                    <MyStack/>
                }
            </NavigationContainer>
        </UserContext.Provider>
    )
};

export default App;


const styles = StyleSheet.create({
    logo: { borderRadius: 6, alignItems: 'flex-start', width: 100, height: 60, marginLeft: 16, }
})


