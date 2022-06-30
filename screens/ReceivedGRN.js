import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import BaseService from '../services/BaseService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import GlobelStyle from '../Componenets/GlobalStyle/GlobalStyle';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import NoDataFound from '../Componenets/NoDataFound';
import AppLoader from '../Componenets/AppLoader/AppLoader';
import AppTheme from '../Componenets/AppTheme.js/AppTheme';
import { Title } from 'react-native-paper';

export default function ReceivedGRN({ navigation }) {

    const [DATA, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    React.useEffect(() => {
        const focusEvent = navigation.addListener('focus', () => {
            getGRNData();
        });
        return focusEvent;

    });
    
    const getGRNData = async () => {
        // setLoading(true)
        let warehouseId = await AsyncStorage.getItem('@id')
        console.log("line 21", warehouseId);
        await BaseService.post('AppOrder/getGRNList',

            {
                'warehouse_id': warehouseId,

            }
        ).then(res => {

            console.log('Grn data line 29 ->', res);
            if (res.data.status == "Success") {
                setData(res.data.itemList)
                setTimeout(() => {
                    setLoading(false)
                }, 700);
            }

        }).catch(err => console.log('Add claim line 151 ->', err))

    }
    const RenderGrnData = ({ item }) => {
        return (
            <TouchableOpacity style={[GlobelStyle.Card, { borderWidth: 1, borderColor: AppTheme.Dark, padding: 0 }]}
                onPress={() => navigation.navigate('ScanningGRN', { 'product': item.productName+' - '+item.ItemCode, 'stock': item.stock ,"productId" : item.product_id})}>
                <View style={{ backgroundColor: AppTheme.Dark, padding: 0 }}>
                    <Title style={{ fontSize: 13, color: 'white' }}>   {item.category}</Title>
                </View>
                <View style={{ padding: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop:-8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <Title style={{ fontSize: 14 }}>Date : </Title>
                        <Text>{moment(item.date_created).format("DD MMM YYYY")}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                    <Icon name="qr-code-scanner" />
                    <Icon name="arrow-forward-ios" />
                    </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Title style={{ fontSize: 12, }}>{item.productName ? item.productName : 'N/A'} - </Title>
                            <Text style={{ fontSize: 12 }}>{item.ItemCode ? item.ItemCode : 'N/A'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Title style={{ fontSize: 14 }}>Stock : </Title>
                            <Text>{item.stock ? item.stock : 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                        <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, marginRight: 4, borderColor: AppTheme.Medium }}>
                            <Title style={{ fontSize: 12 }}>Last Received Date </Title>
                            <Text style={{ fontSize: 12 }}>{moment(item.last_recieving_date).format("DD MMM YYYY")}</Text>
                        </View>
                        <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium ,paddingBottom:4}}>
                            <Title style={{ fontSize: 12 }}>Last Scanning Date</Title>
                            <Text style={{ fontSize: 12 }}>{moment(item.last_scanning_date).format("DD MMM YYYY")}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.Container}>

            {isLoading ?

                <AppLoader loading={isLoading} />

                :
                (DATA.length > 0 ?
                <FlatList
                    data={DATA}
                    renderItem={RenderGrnData}
                    keyExtractor={item => item.id}
                />
                :
                <NoDataFound title="NO DATA FOUND" />
                )
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    Container: {
        flex: 1
    }
})