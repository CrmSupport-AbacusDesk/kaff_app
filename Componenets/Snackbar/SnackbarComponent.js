import React from 'react'
import { Dimensions, View } from 'react-native';
import { Snackbar } from 'react-native-paper';

export default function SnackbarComponent({ visible, message }) {
    return (
        <View style={{ width: Dimensions.get('screen').width,justifyContent:'center',alignItems:'center' }}>
            <Snackbar
                style={{justifyContent:'center',alignItems:'center',}}
                // style={{alignItems:'center',justifyContent:"center"}}
                visible={visible}
            >
                {message}
            </Snackbar>
        </View>
    )
}