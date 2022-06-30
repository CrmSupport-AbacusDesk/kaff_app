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

export default function Invoice({ navigation }) {

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
        await BaseService.post('AppOrder/invoiceList',

            {
                'warehouse_id': warehouseId,

            }
        ).then(res => {

            console.log('Invoice data line 38 ->', res);
            if (res.data.status == "Success") {
                setData(res.data.invoiceList)
                setTimeout(() => {
                    setLoading(false)
                }, 700);
            }

        }).catch(err => console.log('Add claim line 151 ->', err))

    }
    const RenderData = ({ item }) => {
        return (
            <TouchableOpacity style={[GlobelStyle.Card, { borderWidth: 1, borderColor: AppTheme.Dark, padding: 0 }]}
                onPress={() => navigation.navigate('InvoiceDetail', { 'id' : item.id})}>
                <View style={{ backgroundColor: AppTheme.Dark, padding: 0 }}>
                    <Title style={{ fontSize: 13, color: 'white' }}>   {item.SONumber ? item.SONumber : 'N/A'}</Title>
                </View>
                <View style={{ padding: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Title style={{ fontSize: 14 }}>Date : </Title>
                            <Text style={{color:'black'}}>{moment(item.date_created).format("DD MMM YYYY")}</Text>
                        </View>
                       
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Title style={{ fontSize: 14,color:AppTheme.Medium }}>{item.CustomerName ? item.CustomerName : 'N/A'}</Title>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name="arrow-forward-ios" color={AppTheme.LightBlue}/>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                        <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, marginRight: 4, borderColor: AppTheme.Medium,borderStyle:'dashed' }}>
                            <Title style={{ fontSize: 12 }}>Total Item</Title>
                            <Text style={{ fontSize: 12 ,color:"black"}}>{item.totalItem ? item.totalItem : "N/A"}</Text>
                        </View>
                        <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, marginRight: 4,borderStyle:'dashed' }}>
                            <Title style={{ fontSize: 12 }}>Total Item Qty</Title>
                            <Text style={{ fontSize: 12 ,color:"black"}}>{item.totalQty ? item.totalQty :"N/A"}</Text>
                        </View>
                        <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4,borderStyle:'dashed' }}>
                            <Title style={{ fontSize: 12 }}>Total Amount</Title>
                            <Text style={{ fontSize: 12,color:"black" }}>₹ {item.totalAmount ? item.totalAmount : "N/A"}</Text>
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
                        renderItem={RenderData}
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