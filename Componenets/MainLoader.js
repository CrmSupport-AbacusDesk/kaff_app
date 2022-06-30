import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';




const MainLoader = () => {
    const [progress, setProgress] = useState(new Animated.Value(0));
    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 2000,
            useNativeDriver:true,
            easing: Easing.linear,
        }).start();   
    })

    return (
        <LottieView
                source={require('../Assets/LoaderJson/lottie_loader.json')}
            progress={progress}/>
    )
}

export default MainLoader;


