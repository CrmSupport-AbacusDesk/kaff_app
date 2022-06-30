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

export default function InvoiceDetail({ navigation, route }) {

    const [DATA, setData] = useState([]);
    const [InvoiceDetail, setInvoiceDetail] = useState({});
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
        await BaseService.post('AppOrder/getInvoiceDetail',

            {
                'id': route.params.id,

            }
        ).then(res => {

            console.log('Invoice Detail line 41 ->', res);
            if (res.data.status == "Success") {
                setInvoiceDetail(res.data.invoiceDetail)
                setData(res.data.invoiceDetail.sales_item)
                setTimeout(() => {
                    setLoading(false)
                }, 600);
            }

        }).catch(err => console.log('Add claim line 151 ->', err))

    }
    const RenderGrnData = ({ item }) => {
        return (
            <View style={[GlobelStyle.Card, { borderWidth: 1, borderColor: AppTheme.Dark, padding: 0 }]}
                >
                <View style={{ backgroundColor: AppTheme.Dark, borderRadius: 6 }}>
                    <Title style={{ fontSize: 13, color: 'white' }}>  {item.category ? item.category : 'N/A'}</Title>
                    <View style={{ flexDirection: 'row', marginTop: -6 }}>
                        <Text style={{ fontSize: 13, color: 'white' }}>  {item.productName ? item.productName : 'N/A'}</Text>
                        <Text style={{ fontSize: 13, color: 'white' }}> - {item.ItemCode ? item.ItemCode : 'N/A'}</Text>
                    </View>
                </View>
                <View style={{ padding: 8 }}>
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                        <View style={{ alignItems: 'center', marginRight: 4, borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, borderStyle: 'dashed' }}>
                            <Text style={{ fontSize: 12,fontWeight:'bold' }}>Order Qty</Text>
                            <Text style={{ fontSize: 12 }}>{item.QtyOrdered ? item.QtyOrdered : "N/A"}</Text>
                        </View>
                        <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, borderStyle: 'dashed' }}>
                            <Text style={{ fontSize: 12,fontWeight:'bold' }}>Pending Qty</Text>
                            <Text style={{ fontSize: 12 }}>₹ {item.QtyPending ? item.QtyPending : "N/A"}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>

                        <View style={{ alignItems: 'center', marginRight: 4, borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, borderStyle: 'dashed' }}>
                            <Text style={{ fontSize: 12,fontWeight:'bold' }}>Rate</Text>
                            <Text style={{ fontSize: 12 }}>₹ {item.SalesPrice ? item.SalesPrice : "N/A"}</Text>
                        </View>
                        <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, borderStyle: 'dashed' }}>
                            <Text style={{ fontSize: 12,fontWeight:'bold' }}>Total Amount</Text>
                            <Text style={{ fontSize: 12 }}>₹ {item.ItemAmount ? item.ItemAmount : "N/A"}</Text>
                        </View>
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
                (DATA.length > 0 ?
                    <View style={{flex:1}}>
                        <View style={[GlobelStyle.Card, { marginHorizontal: 0, marginTop: 0 }]}
                            onPress={() => navigation.navigate('InvoiceDetail', { 'id': item.id })}>
                            <View >
                                <Title style={{ fontSize: 13 }}>S.O No. - {InvoiceDetail.SONumber ? InvoiceDetail.SONumber : 'N/A'}</Title>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -16 }}>
                                    <Title style={{ fontSize: 14, color: "#6e6d6d" }}>{InvoiceDetail.CustomerName ? InvoiceDetail.CustomerName : 'N/A'} -</Title>
                                    <Title style={{ fontSize: 14, color: AppTheme.Medium }}> {InvoiceDetail.CustomerCode ? InvoiceDetail.CustomerCode : 'N/A'}</Title>
                                </View>
                            </View>
                            <View style={{ padding: 8, borderTopWidth: 1, borderColor: AppTheme.Medium }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Title style={{ fontSize: 12 }}>Date : </Title>
                                        <Text style={{ fontSize: 12 }}>{moment(InvoiceDetail.date_created).format("DD MMM YYYY")}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Title style={{ fontSize: 12 }}>Total Item : </Title>
                                        <Text style={{ fontSize: 12 }}>{InvoiceDetail.totalItem ? InvoiceDetail.totalItem : "N/A"}</Text>
                                    </View>

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                    <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, marginRight: 4, borderStyle: 'dashed' }}>
                                        <Title style={{ fontSize: 12 }}>Total Qty</Title>
                                        <Text style={{ fontSize: 12 }}>{InvoiceDetail.totalQty ? InvoiceDetail.totalQty : "N/A"}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, borderStyle: 'dashed' }}>
                                        <Title style={{ fontSize: 12 }}>Total Amount</Title>
                                        <Text style={{ fontSize: 12 }}>₹ {InvoiceDetail.totalAmount ? InvoiceDetail.totalAmount : "N/A"}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, marginLeft: 4, borderColor: AppTheme.Medium, borderStyle: 'dashed' }}>
                                        <Title style={{ fontSize: 12 }}>Order Weight</Title>
                                        <Text style={{ fontSize: 12 }}>{InvoiceDetail.order_weight ? InvoiceDetail.order_weight : "N/A"}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <FlatList
                            data={DATA}
                            renderItem={RenderGrnData}
                            keyExtractor={item => item.id}
                        />
                     <FAB style={[GlobelStyle.fab,{right: 150}]} icon="barcode-scan" onPress={()=>  navigation.navigate('InvoiceScann',{'id': InvoiceDetail.id , 'totalQty' : InvoiceDetail.totalQty , "so_no": InvoiceDetail.SONumber})} animated={true} /> 
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