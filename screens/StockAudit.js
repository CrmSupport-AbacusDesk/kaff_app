import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import BaseService from '../services/BaseService'
import { Button } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import GlobelStyle from '../Componenets/GlobalStyle/GlobalStyle';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import NoDataFound from '../Componenets/NoDataFound';
import AppLoader from '../Componenets/AppLoader/AppLoader';
import AppTheme from '../Componenets/AppTheme.js/AppTheme';
import { FAB, Title } from 'react-native-paper';
import { TabRouter } from 'react-navigation';

export default function StockAudit({ navigation, route }) {

    const [DATA, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    React.useEffect(() => {
        const focusEvent = navigation.addListener('focus', () => {
            AuditData();

        });
        return focusEvent;

    });

    const AuditData = async (status) => {
        setLoading(true)
        let warehouseId = await AsyncStorage.getItem('@id')
        console.log("line 21", warehouseId);
        await BaseService.post('AppStock/getStockAudit_list',

            {
                'warehouse_id': warehouseId,
                'status': status,

            }
        ).then(res => {

            console.log('Stock Audit data line 38 ->', res);
            if (res.data.status == "Success") {
                setData(res.data.stockAuditList)
                setTimeout(() => {
                    setLoading(false)
                }, 700);
            }

        }).catch(err => console.log('Add claim line 151 ->', err))

    }
    // const AuditDataDetail = async () => {
    //     setLoading(true)
    //     let warehouseId = await AsyncStorage.getItem('@id')
    //     console.log("line 21", warehouseId);
    //     await BaseService.post('AppStock/get_StockAuditDetail',

    //         {
    //             "id" : "6"

    //         }
    //     ).then(res => {

    //         console.log('Detail Audit data line 38 ->', res);
    //         // if (res.data.status == "Success") {
    //         //     setData(res.data.stockAuditList)
    //         //     setTimeout(() => {
    //         //         setLoading(false)
    //         //     }, 700);
    //         // }

    //     }).catch(err => console.log('Add claim line 151 ->', err))

    // }
    // const TransferType = route.params.type;

    const RenderGrnData = ({ item }) => {

        return (
            <TouchableOpacity style={[GlobelStyle.Card, { borderWidth: 1, borderColor: AppTheme.Dark, padding: 0 }]} onPress={() => navigation.navigate('StockAuditDetail', { "id": item.id })}>
                <View style={{ backgroundColor: AppTheme.Dark, padding: 0, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Title style={{ fontSize: 13, color: 'white' }}>   {item.audit_title ? item.audit_title : 'N/A'}</Title>
                </View>
                <View style={{ padding: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Title style={{ fontSize: 14 }}>Date : </Title>
                            <Text>{moment(item.date_created).format("DD MMM YYYY")}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name="arrow-forward-ios" color={AppTheme.LightBlue} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                        <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, marginRight: 4, borderColor: AppTheme.Medium, borderStyle: 'dashed' }}>
                            <Title style={{ fontSize: 12 }}>Total Qty</Title>
                            <Text style={{ fontSize: 12 }}>{item.total_qty ? item.total_qty : "N/A"}</Text>
                        </View>
                        <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, marginRight: 4, borderColor: AppTheme.Medium, borderStyle: 'dashed' }}>
                            <Title style={{ fontSize: 12 }}>Total Item</Title>
                            <Text style={{ fontSize: 12 }}>{item.total_item ? item.total_item : "N/A"}</Text>
                        </View>
                        {/* <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, marginRight: 4, borderStyle: 'dashed' }}>
                            <Title style={{ fontSize: 12 }}>Status</Title>
                            <Text style={{ fontSize: 12 }}>{item.status ? item.status : "N/A"}</Text>
                        </View> */}
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
                <View style={{ flex: 1 }}>
                    <View style={{ marginHorizontal: 12, marginVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: "space-evenly" }}>
                        <Button mode='contained' color={AppTheme.Warning} labelStyle={{ fontSize: 14, color: AppTheme.Light }} style={{ marginVertical: 8, width: '45%' }} onPress={() => AuditData("Draft")}>Draft</Button>
                        <Button mode='contained' color={AppTheme.Dark} labelStyle={{ fontSize: 14, color: AppTheme.Light }} style={{ marginVertical: 8, width: '45%' }} onPress={() => AuditData("Complete")}>Complete</Button>
                    </View>
                    {DATA.length > 0 ?

                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={DATA}
                                renderItem={RenderGrnData}
                                keyExtractor={item => item.id}
                            />
                            <FAB style={[GlobelStyle.fab]} icon="transfer" onPress={() => navigation.navigate('AddStockAudit',{"scan_type":"from_list"})} animated={true} />
                        </View>
                        :
                        <NoDataFound title="NO DATA FOUND" />
                    }
                </View>
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    Container: {
        flex: 1
    }
})