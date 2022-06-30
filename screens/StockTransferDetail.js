import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import BaseService from '../services/BaseService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import GlobelStyle from '../Componenets/GlobalStyle/GlobalStyle';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import { FAB } from 'react-native-paper';
import NoDataFound from '../Componenets/NoDataFound';
import AppLoader from '../Componenets/AppLoader/AppLoader';
import AppTheme from '../Componenets/AppTheme.js/AppTheme';
import { Title } from 'react-native-paper';
import { TabRouter } from 'react-navigation';

export default function StockTransferDetail({ navigation, route }) {

    const [DATA, setData] = useState([]);
    const [StockDetail, setStockDetail] = useState({});
    const [isLoading, setLoading] = useState(true);

    React.useEffect(() => {
        const focusEvent = navigation.addListener('focus', () => {
            stockTransferData();
        });
        return focusEvent;

    });

    const stockTransferData = async () => {
        console.log('====================================');
        console.log("log",route.params.transfer_id);
        console.log('====================================');
        setLoading(true)
        let warehouseId = await AsyncStorage.getItem('@id')
        console.log("line 21", warehouseId);
        await BaseService.post('AppStock/get_StockTransferDetail',

            {
                'id': route.params.transfer_id,

            }
        ).then(res => {

            console.log('Stock Transfer detail ->', res);
            if (res.data.status == "Success") {
                setStockDetail(res.data.transferDetail)
                setData(res.data.transferDetail.transfer_item)
                setTimeout(() => {
                    setLoading(false)
                }, 700);
            }

        }).catch(err => console.log('error ->', err))

    }
    const RenderTransferItem = ({ item }) => {
        return (
            <View style={[GlobelStyle.Card, { borderWidth: 1, borderColor: AppTheme.Dark, padding: 0 }]}
                >
                <View style={{ backgroundColor: AppTheme.Dark, borderRadius: 6 }}>
                    {/* <Title style={{ fontSize: 13, color: 'white' }}>  {item.category ? item.category : 'N/A'}</Title> */}
                    <View style={{ flexDirection: 'row', marginTop: -6 }}>
                        {/* <Text style={{ fontSize: 13, color: 'white' }}>  {item.productName ? item.productName : 'N/A'}</Text> */}
                        {/* <Text style={{ fontSize: 13, color: 'white' }}> - {item.ItemCode ? item.ItemCode : 'N/A'}</Text> */}
                    </View>
                </View>
                <View style={{ padding: 8 }}>
                    <View style={{  marginTop: 4 }}>
                        {/* <View style={{ alignItems: 'center', marginRight: 4, borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, borderStyle: 'dashed' }}> */}
                            <Text style={{ fontSize: 12,fontWeight:'bold',color:AppTheme.Medium }}>Product Detail</Text>
                            <Text style={{ fontSize: 12 ,fontWeight:'bold'}}>{item.category ? item.category : "N/A"} - {item.productName ? item.productName : 'N/A'} ({item.ItemCode ? item.ItemCode : 'N/A'} )</Text>
                        {/* </View> */}
                    </View>
                        <View style={{ alignItems: 'center', borderWidth: 1, flexDirection:'row', borderColor: AppTheme.Medium, padding: 4, borderStyle: 'dashed',marginTop:10 }}>
                            <Text style={{ fontSize: 12,fontWeight:'bold' }}>Total qty transfered : </Text>
                            <Text style={{ fontSize: 12 }}> {item.qty_transferred ? item.qty_transferred : "N/A"}</Text>
                        </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.Container}>

            {isLoading ?

                <AppLoader loading={isLoading} />

                :
                // (DATA.length > 0 ?
                    // <View style={{flex:1}}>
                    <>
                        <View style={[GlobelStyle.Card, { marginHorizontal: 0, marginTop: 0 }]}
                            onPress={() => navigation.navigate('InvoiceDetail', { 'id': item.id })}>
                            <View >
                                {/* <Title style={{ fontSize: 13 }}>S.O No. - {InvoiceDetail.SONumber ? InvoiceDetail.SONumber : 'N/A'}</Title> */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -16 }}>
                                    {/* <Title style={{ fontSize: 14, color: "#6e6d6d" }}>{InvoiceDetail.CustomerName ? InvoiceDetail.CustomerName : 'N/A'} -</Title> */}
                                    {/* <Title style={{ fontSize: 14, color: AppTheme.Medium }}> {InvoiceDetail.CustomerCode ? InvoiceDetail.CustomerCode : 'N/A'}</Title> */}
                                </View>
                            </View>
                            <View style={{ padding: 8, borderTopWidth: 1, borderColor: AppTheme.Medium }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Title style={{ fontSize: 12 }}>Date : </Title>
                                        <Text style={{ fontSize: 12 }}>{moment(StockDetail.transferred_date).format("DD MMM YYYY")}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Title style={{ fontSize: 12 }}>Transfer Id : </Title>
                                        <Text style={{ fontSize: 12 }}>#ST{StockDetail.id ? StockDetail.id : "N/A"}</Text>
                                    </View>

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                    <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, marginRight: 4, borderStyle: 'dashed' }}>
                                        <Title style={{ fontSize: 12 }}>Transfer By</Title>
                                        <Text style={{ fontSize: 12 }}>{StockDetail.transferred_by_name ? StockDetail.transferred_by_name : "N/A"}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, borderStyle: 'dashed' }}>
                                        <Title style={{ fontSize: 12 }}>Transfer Type</Title>
                                        <Text style={{ fontSize: 12 }}>{StockDetail.transferred_type ? StockDetail.transferred_type : "N/A"}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, marginLeft: 4, borderColor: AppTheme.Medium, borderStyle: 'dashed' }}>
                                        <Title style={{ fontSize: 12 }}>Transfer To</Title>
                                        <Text style={{ fontSize: 12 }}>{StockDetail.transferred_to_name ? StockDetail.transferred_to_name : "N/A"}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex:1}}>
                        <FlatList
                            data={DATA}
                            renderItem={RenderTransferItem}
                            keyExtractor={item => item.id}
                        />
                        </View>
                </>
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    Container: {
        flex: 1
    }
})