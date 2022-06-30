import React from 'react'
import { View, Image } from 'react-native'
import { Caption } from 'react-native-paper';
import GlobelStyle from './GlobalStyle/GlobalStyle';

export default function NoDataFound({title}) {
    return (
        <View style={[GlobelStyle.noDataContainer]}>
            <Image resizeMode="contain" style={{height:180,width:180}} source={require("../Assets/No_data.png")} />
            <Caption style={[GlobelStyle.noDataContent]}>
                {title}
            </Caption>
        </View>
    )
}