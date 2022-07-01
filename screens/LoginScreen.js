
import React, { useContext, useState } from 'react';
import { View, Image, Alert, SafeAreaView, ScrollView, StyleSheet, Keyboard, Text, ImageBackground } from 'react-native';
import { Title, TextInput, Button, Caption } from 'react-native-paper';
import { Formik } from 'formik';
import AppButton from '../Componenets/AppButton/AppButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobelStyle from '../Componenets/GlobalStyle/GlobalStyle';
import AppTheme from '../Componenets/AppTheme.js/AppTheme';
import { UserContext } from '../context/UserContext';
import BaseService from '../services/BaseService';
// import NetInfo from "@react-native-community/netinfo";
// import InternetConnectivity from '../../components/InternetConnection/InternetConnectivity';
import AppLoader from '../Componenets/AppLoader/AppLoader';
import SnackbarComponent from '../Componenets/Snackbar/SnackbarComponent';
// import LinearGradient from 'react-native-linear-gradient';
// import Statusbar from '../../components/Statusbar/Statusbar';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function LogIn({ navigation }) {

    const { data, signInUser } = useContext(UserContext);
    const [disableButton, setDisableButton] = useState(false);
    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [hidePass, setHidePass] = useState(true);
    const [connectStatus, setConnectStatus] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [showSnackBar, setShowSnackBar] = useState(false);


    React.useEffect(() => {

        // NetInfo.addEventListener(networkState => {
        //     if (networkState.isConnected) {
        //         setConnectStatus(networkState.isConnected)
        //     }
        //     else {
        //         setConnectStatus(networkState.isConnected)

        //     }
        // });
        const focusEvent = navigation.addListener('focus', () => {

            setTimeout(() => {
                setLoading(false);
            }, 1000);

        });
        return focusEvent;
    });

    const changeIcon = () => {

        setHidePass(!hidePass);

    }

    // const onSubmit = async (values, { setStatus, setSubmitting, resetForm }) => {
    //     try {
    //         setMobileNo(values.mobile);
    //         await submit(values.mobile);
    //         // setIsLoading(true);
    //     } catch (error) {
    //         setStatus({ success: false });
    //         setSubmitting(false);
    //     }
    // }

    const submit = async (values) => {
        Keyboard.dismiss();
        setDisableButton(true);

        if ((values.username) === '' || (values.password) === '') {

            Alert.alert(
                'Warning!',
                'Please Enter User Credentials!',
                [
                    { text: 'OK' }
                ],
                { cancelable: true }
            );
            setDisableButton(false);

        }
        else {
            try {

                let data = {};
                data.username = values.username;
                data.password = values.password;
                // data.passwordType = "password";
                console.log('user data line 82', data);

                let res = await BaseService.post('Login/login', {
                    'username': values.username,
                    'mobile_password': values.password
                })
                console.log('====================================');
                console.log('api respon line 86', res);
                console.log('====================================');
                if (res.data.status == 'Success') {

                    // let loginData = {};
                    // loginData.token = res.data.token,
                    //     loginData.id = res.data.id,
                    //     loginData.warehouse_code = res.data.warehouse_code,
                    //     loginData.warehouse_name = res.data.warehouse_name,

                    //     console.log('line submit 99', loginData);
                    // await AsyncStorage.setItem('userCredentials', JSON.stringify(data));

                    if (res.data.token != '') {
                        signInUser(res.data.id, res.data.token, res.data.warehouse_code, res.data.warehouse_name);
                    }

                    setShowSnackBar(true);
                    setTimeout(() => {
                        // signInUser(loginData);
                        setDisableButton(false);
                        setShowSnackBar(false);
                    }, 500);

                }
                else if (res.data.status == 'deactive') {
                    Alert.alert(
                        'Login Failed!',
                        'Your Status Is Inactive',
                        [
                            { text: 'OK' }
                        ],
                        { cancelable: true }
                    );
                    setDisableButton(false);
                }
                else {
                    setDisableButton(false);
                    if (res.data.status == 'not found') {
                        Alert.alert(
                            'Login Failed!',
                            'Please Check Your Credentials!',
                            [
                                { text: 'OK' }
                            ],
                            { cancelable: true }
                        );
                        setDisableButton(false);
                    }
                    else {
                        Alert.alert(
                            'Error!',
                            'Something Went Wrong',
                            [
                                { text: 'OK' }
                            ],
                            { cancelable: true }
                        );
                        setDisableButton(false);
                    }
                }

            } catch (error) {
                console.log("err", error);
                alert(error);
                setDisableButton(false);
            }
        }
    }

    const SignupSchema = yup.object().shape({
        username: yup.string()
            .required('Required')
            .trim('Username cannot contain  spaces')
            .strict(true)
        ,
        password: yup.string()
            .required('Required')
            .trim('Password cannot contain  spaces')
            .strict(true),
    });


    return (

        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={require("../Assets/background.jpg")} resizeMode="cover" style={styles.image}>


                {/* <Statusbar backgroundColor={AppTheme.Primary} /> */}

                {isLoading ?

                    <AppLoader loading={isLoading} />

                    :

                    // (
                    // connectStatus ?

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 26, }}>
                            <Title style={[styles.logo]} >KAFF</Title>
                        </View>
                        <Formik
                            initialValues={{
                                username: '', password: ''
                            }}
                            valid
                            validationSchema={SignupSchema} 
                            onSubmit={submit}

                        >

                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <>

                                    <View style={{ margin: 16, flex: 1, paddingTop: 12 }}>
                                        <View style={[GlobelStyle.Card, { backgroundColor: "white" }]}>
                                            <View style={[{ paddingTop: 20, padding: 24 }]}>
                                                <Title style={[{ color: "#424242", fontSize: 18, fontFamily: 'Roboto', fontWeight: 'bold' }]}>LOGIN</Title>
                                                <Text>Please sign in to continue.</Text>
                                            </View>
                                            <View style={{ backgroundColor: "white", padding: 16, }}>

                                                {/* <LinearGradient colors={['#00afef', '#00afef', '#3b5998']} style={[GlobelStyle.linearGradient, { height: 340 }]}> */}


                                                <View >
                                                    <TextInput
                                                        icon="phone"
                                                        name="username"
                                                        mode="underlined"
                                                        underlineColor='grey'
                                                        activeUnderlineColor='grey'
                                                        label="Username"
                                                        placeholderTextColor='#828088'
                                                        style={[styles.UserDataContainer]}
                                                        type="textInput"
                                                        value={values.username}
                                                        autoCorrect={false}
                                                        onChangeText={handleChange('username')}
                                                        onBlur={handleBlur('username')}
                                                        left={<TextInput.Icon name="account" color={'#adadad'} />}
                                                    />
                                                    {errors.username && touched.username &&
                                                        <Caption style={GlobelStyle.errorMsg}>{errors.username}</Caption>
                                                    }
                                                </View>
                                                <View >
                                                    <TextInput
                                                        icon="phone"
                                                        name="password"
                                                        label="Password"
                                                        // labelStyle={{color:"white"}}
                                                        style={[styles.UserDataContainer]}
                                                        // placeholder="Enter your password"
                                                        mode="undrlined"
                                                        underlineColor='grey'
                                                        activeUnderlineColor='grey'
                                                        tvParallaxMagnification={4}
                                                        placeholderTextColor='white'
                                                        type="textInput"
                                                        value={values.password}
                                                        autoCorrect={false}
                                                        onChangeText={handleChange('password')}
                                                        onBlur={handleBlur('password')}
                                                        secureTextEntry={hidePass}
                                                        right={values.password.length > 0 && <TextInput.Icon name={hidePass ? 'eye-off' : 'eye'}
                                                            onPress={() => changeIcon()} color={'#adadad'} />}
                                                        left={<TextInput.Icon name="lock" color={'#adadad'} />}
                                                    />
                                                    {errors.password && touched.password &&
                                                        <Caption style={GlobelStyle.errorMsg}>{errors.password}</Caption>
                                                    }
                                                </View>

                                                {/* <View style={[GlobelStyle.alignEnd, { marginRight: -15 }]}>
                                                        <Button labelStyle={{ textTransform: "capitalize", fontSize: 12 }} color={AppTheme.Light} onPress={() => navigation.navigate('ForgetPassword')}>
                                                            Forget Password?
                                                        </Button>
                                                    </View> */}


                                                <View style={[{ paddingTop: 35 }]}>
                                                    <View style={{ width: '100%' }}>
                                                        <AppButton title="Login" color={AppTheme.LightGrey} onPress={handleSubmit} disabled={disableButton} loading={disableButton} />
                                                    </View>
                                                </View>

                                                {/* </LinearGradient> */}

                                            </View>
                                        </View>
                                    </View>

                                </>
                            )}
                        </Formik>
                    </ScrollView>
                    // :

                    // <InternetConnectivity />
                    // )

                }

                <SnackbarComponent visible={showSnackBar}
                    message={'Successfully Login'}
                />
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    image: {
        flex: 1
    },
    UserDataContainer: {
        backgroundColor: "white",
        elevation: 18,
        shadowColor: 'black',
        marginTop: 6
    },
    logo:{
        fontSize: 46,
         fontWeight: 'bold',
          color:"#d9d7d7",
           lineHeight: 50 ,
           textShadowColor:"#000",
        textShadowOffset: { width: 1, height: 1 },
         textShadowRadius: 1,
    }
})