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

export default function StockAuditDetail({ navigation, route }) {

    const [DATA, setData] = useState([]);
    const [AuditDetail, setAuditDetail] = useState({});
    const [isLoading, setLoading] = useState(true);

    React.useEffect(() => {
        const focusEvent = navigation.addListener('focus', () => {
            AuditDataDetail();
        });
        return focusEvent;

    });

   const AuditDataDetail = async () => {
        setLoading(true)
        let warehouseId = await AsyncStorage.getItem('@id')
        console.log("line 21", warehouseId);
        await BaseService.post('AppStock/get_StockAuditDetail',

            {
                "id" : route.params.id

            }
        ).then(res => {

            console.log('Detail Audit data line 38 ->', res);
            if (res.data.status == "Success") {
                setData(res.data.auditDetail.barcodes)
                setAuditDetail(res.data.auditDetail)
                setTimeout(() => {
                    setLoading(false)
                }, 700);
            }

        }).catch(err => console.log('Add claim line 151 ->', err))

    }
    const RenderGrnData = ({ item ,index}) => {
        return (
            <View style={[{backgroundColor:'white',shadowColor:'black',elevation:16,marginHorizontal:12,flexDirection:'row',alignItems:'center',flex:1,borderBottomWidth:1,borderBottomColor:'black'}]}
            >
                <View style={{padding:4, width: "57%" }}>
                    <Title style={{ fontSize: 12}}> {index+1}.  {item.category ? item.category : 'N/A'}</Title>
                    <View style={{ flexDirection: 'row', marginTop: -6 }}>
                        <Text style={{ fontSize: 12}}>  {item.productName ? item.productName : 'N/A'}</Text>
                        <Text style={{ fontSize: 12}}> - {item.ItemCode ? item.ItemCode : 'N/A'}</Text>
                    </View>
                </View>
                        <View style={{  borderLeftWidth: 1, flex: 1, borderColor: AppTheme.Medium, padding: 4, borderStyle: 'dashed' , width: "40%" }}>
                            <Text style={{ fontSize: 12 , fontWeight:'bold' }}>{item.barcode ? item.barcode : "N/A"}</Text>
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

                                <View style={{flexDirection:'row',marginHorizontal:12}}>
                            <View >
                                <Title style={{ fontSize: 13 }}>Audit Info. - </Title>
                            </View>
                            <View style={{flex:1}}>
                                <Title style={{ fontSize: 13 }}>{AuditDetail.audit_title ? AuditDetail.audit_title : 'N/A'}abcdefg</Title>
                            </View>
                            </View>
                            <View style={{ padding: 8, borderTopWidth: 1, borderColor: AppTheme.Medium }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Title style={{ fontSize: 12 }}>Date : </Title>
                                        <Text style={{ fontSize: 12 }}>{moment(AuditDetail.date_created).format("DD MMM YYYY")}</Text>
                                    </View>

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                    <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, marginRight: 4, borderStyle: 'dashed' }}>
                                        <Title style={{ fontSize: 12 }}>Total Qty</Title>
                                        <Text style={{ fontSize: 12 }}>{AuditDetail.total_qty ? AuditDetail.total_qty : "N/A"}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, borderColor: AppTheme.Medium, paddingBottom: 4, borderStyle: 'dashed' }}>
                                        <Title style={{ fontSize: 12 }}>Total Item</Title>
                                        <Text style={{ fontSize: 12 }}>{AuditDetail.total_item ? AuditDetail.total_item : "N/A"}</Text>
                                    </View>
                                    {/* <View style={{ alignItems: 'center', borderWidth: 1, flex: 1, marginLeft: 4, borderColor: AppTheme.Medium, borderStyle: 'dashed' }}>
                                        <Title style={{ fontSize: 12 }}>Order Weight</Title>
                                        <Text style={{ fontSize: 12 }}>{AuditDetail.order_weight ? AuditDetail.order_weight : "N/A"}</Text>
                                    </View> */}
                                </View>
                            </View>
                        </View>
                        
                     
                        <View style={styles.TableHead}>
                            <View style={{ width: "60%" }}>
                                <Title style={{ fontSize: 13, color: 'white', paddingLeft: 6 }}>Item information</Title>
                            </View>
                            <View style={{ width: "40%" }}>
                                <Title style={{ fontSize: 13, color: 'white' }}>Barcode</Title>
                            </View>
                        </View>
                        <FlatList
                            data={DATA}
                            renderItem={RenderGrnData}
                            keyExtractor={item => item.id}
                        />
                     <FAB style={[GlobelStyle.fab,{right: 150}]} icon="barcode-scan" onPress={()=>  navigation.navigate('AddStockAudit',{"scan_type":"from_detail", "audit_title" :AuditDetail.audit_title , "id" : AuditDetail.id})} animated={true} /> 
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