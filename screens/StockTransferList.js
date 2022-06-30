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
import { FAB, Title } from 'react-native-paper';
import { TabRouter } from 'react-navigation';

export default function StockTransferList({ navigation, route }) {

    const [DATA, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    React.useEffect(() => {
        const focusEvent = navigation.addListener('focus', () => {
            InvoiceData();
        });
        return focusEvent;

    });

    const InvoiceData = async () => {
        setLoading(true)
        let warehouseId = await AsyncStorage.getItem('@id')
        console.log("line 21", warehouseId);
        await BaseService.post('AppStock/getInternalTransferList',

            {
                'warehouse_id': warehouseId,
                'transferred_type': route.params.type,

            }
        ).then(res => {

            console.log('Stock data line 38 ->', res);
            if (res.data.status == "Success") {
                setData(res.data.transferList)
                setTimeout(() => {
                    setLoading(false)
                }, 700);
            }

        }).catch(err => console.log('Add claim line 151 ->', err))

    }
    const TransferType = route.params.type;

    const RenderGrnData = ({ item }) => {
       
        return (
            <TouchableOpacity style={[GlobelStyle.Card, { borderWidth: 1, borderColor: AppTheme.Dark, padding: 0 }]} onPress={()=> navigation.navigate('StockTransferDetail',{"transfer_id" : item.id})}>
                <View style={{ backgroundColor: AppTheme.Dark, padding: 0 ,justifyContent:'space-between',flexDirection:'row'}}>
                    <Title style={{ fontSize: 13, color: 'white' }}>   {item.transferred_to_name ? item.transferred_to_name : 'N/A'} - {item.transferred_to ? item.transferred_to : 'N/A'}</Title>
                    <Title style={{ fontSize: 13, color: 'white',marginRight:10 }}>#ST{item.id ? item.id : 'N/A'}</Title>
                </View>
                <View style={{ padding: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Title style={{ fontSize: 14 }}>Date : </Title>
                            <Text>{moment(item.transferred_date).format("DD MMM YYYY")}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name="arrow-forward-ios" color={AppTheme.LightBlue} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                        <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, marginRight: 4, borderColor: AppTheme.Medium, borderStyle: 'dashed' }}>
                            <Title style={{ fontSize: 12 }}>Transfer By</Title>
                            <Text style={{ fontSize: 12 }}>{item.transferred_by_name ? item.transferred_by_name : "N/A"}</Text>
                        </View>
                        <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, marginRight: 4, borderColor: AppTheme.Medium, borderStyle: 'dashed' }}>
                            <Title style={{ fontSize: 12 }}>Total Item</Title>
                            <Text style={{ fontSize: 12 }}>{item.total_item ? item.total_item : "N/A"}</Text>
                        </View>
                        <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, marginRight: 4, borderStyle: 'dashed' }}>
                            <Title style={{ fontSize: 12 }}>Status</Title>
                            <Text style={{ fontSize: 12 }}>{item.status ? item.status : "N/A"}</Text>
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
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={DATA}
                        renderItem={RenderGrnData}
                        keyExtractor={item => item.id}
                    />
                    <FAB style={[GlobelStyle.fab]} icon="transfer" onPress={() => navigation.navigate('StockTransfer',{'type' : TransferType})} animated={true} />
                </View>
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