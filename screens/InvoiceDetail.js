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
    const RenderGrnData = ({ item ,index}) => {
        return (
            <View style={[{backgroundColor:'white',shadowColor:'black',elevation:16,marginHorizontal:12,flexDirection:'row',alignItems:'center',flex:1,borderBottomWidth:1,borderBottomColor:'black'}]}
            >
                <View style={{width:"80%",paddingBottom:4}}>
                    <Title style={{ fontSize: 12}}>  {index +1}. {item.category ? item.category : 'N/A'}</Title>
                    <View style={{ flexDirection: 'row', marginTop: -6 }}>
                        <Text style={{ fontSize: 12}}>  {item.productName ? item.productName : 'N/A'}</Text>
                        <Text style={{ fontSize: 12}}> - {item.ItemCode ? item.ItemCode : 'N/A'}</Text>
                    </View>
                </View>
                <View style={{ alignItems: 'center', marginRight: 4, borderLeftWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, borderStyle: 'dashed' }}>
                    <Text style={{ fontSize: 12 }}>{item.QtyOrdered ? item.QtyOrdered : "N/A"}</Text>
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
                    <View style={{ flex: 1 ,backgroundColor:'white'}}>
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

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                    <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, marginRight: 4, borderStyle: 'dashed' }}>
                                        <Title style={{ fontSize: 12 }}>Total Qty</Title>
                                        <Text style={{ fontSize: 12 }}>{InvoiceDetail.totalQty ? InvoiceDetail.totalQty : "N/A"}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, borderStyle: 'dashed' }}>
                                        <Title style={{ fontSize: 12 }}>Total Item</Title>
                                        <Text style={{ fontSize: 12 }}>{InvoiceDetail.totalItem ? InvoiceDetail.totalItem : "N/A"}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.TableHead}>
                            <View style={{ width: "80%" }}>
                                <Title style={{ fontSize: 13, color: 'white', paddingLeft: 6 }}>Item information</Title>
                            </View>
                            <View style={{ width: "20%" }}>
                                <Title style={{ fontSize: 13, color: 'white' }}>Total Qty</Title>
                            </View>
                        </View>
                        <View style={{flex:1,backgroundColor:'white'}}>
                        <FlatList
                            data={DATA}
                            renderItem={RenderGrnData}
                            keyExtractor={item => item.id}
                        />
                        </View>
                        <FAB style={[GlobelStyle.fab, { right: 150 }]} icon="barcode-scan" onPress={() => navigation.navigate('InvoiceScann', { 'id': InvoiceDetail.id, 'totalQty': InvoiceDetail.totalQty, "so_no": InvoiceDetail.SONumber })} animated={true} />
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
    },
    TableHead: {
        flexDirection: 'row',
        backgroundColor: AppTheme.Dark,
        borderRadius: 6,
        marginHorizontal: 12,
        padding: 2,
        marginBottom: -2
    }
})