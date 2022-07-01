import React from 'react'
import { Text, View, Pressable, StyleSheet, FlatList, TouchableOpacity,Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { Avatar, Title, Button } from 'react-native-paper'
import BaseService from '../services/BaseService'
import AppTheme from '../Componenets/AppTheme.js/AppTheme'
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'
import Swiper from 'react-native-swiper'

const Dashboard = ({ navigation }) => {
    const [MasterBoxInfo, setMasterBoxInfo] = React.useState([])
    React.useEffect(() => {
        const focusEvent = navigation.addListener('focus', () => {
            // getMasterBox();
            USerData()
        });
        return focusEvent;

    });
const USerData = async() => {

    let UserData = await AsyncStorage.getItem('@WarehouseName');
    console.log("UserData",UserData);
}
    return (
        <View style={styles.Dashboard}>
            <View style={styles.sliderContainer}>
                <Swiper autoplay activeDotColor={AppTheme.Dark}>
                    <View style={styles.slide}>
                        <Image source={require("../Assets/Banner-1.png")} resizeMode="cover" style={styles.sliderImage} />
                    </View>
                    <View style={styles.slide}>
                        <Image source={require("../Assets/banner-2.jpg")} resizeMode="cover" style={styles.sliderImage} />
                    </View>
                </Swiper>
            </View>
            <View style={[styles.Master]}>
                <View style={{flexDirection:'row',marginTop:46}}>
                <TouchableOpacity style={styles.Product} onPress={()=> navigation.navigate('ReceivedGRN')}>
                <Image source={require("../Assets/productgrn.png")} resizeMode="cover" style={styles.ProductIcons} />
                    <Title style={{fontSize:14}}>Product GRN</Title>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Product} onPress={()=> navigation.navigate('Invoice')}>
                <Image source={require("../Assets/invoice.png")} resizeMode="cover" style={styles.ProductIcons} />
                    <Title style={{fontSize:14}}>Invoice</Title>
                </TouchableOpacity>
                </View>
                {/* <TouchableOpacity style={styles.Product} onPress={()=> navigation.navigate('StockTransferList' ,{'type' : 'External'})}>
                    <Icon name='widgets' />
                    <Title>Stock Transfer External</Title>
                    <Icon name="keyboard-arrow-right"  />
                </TouchableOpacity> */}
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={styles.Product} onPress={()=> navigation.navigate('StockTransferList',{'type':'Internal' })}>
                <Image source={require("../Assets/stocktrans.png")} resizeMode="cover" style={styles.ProductIcons} />
                    <Title style={{fontSize:14}}>Stock transfer</Title>
                    <Title style={{fontSize:14,top:-9}}>Internal</Title>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Product} onPress={()=> navigation.navigate('StockAudit')}>
                <Image source={require("../Assets/audit.webp")} resizeMode="cover" style={styles.ProductIcons} />
                    <Title style={{fontSize:14}}>Stock audit</Title>
                </TouchableOpacity>
                </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    Dashboard: {
        flex: 1,
        backgroundColor:AppTheme.LightGrey
    },
    sliderContainer: {
        height: 180,
        width: '100%',
    },
    slide: {
        flex: 1,
        backgroundColor: 'transparent',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    sliderImage: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
    },
    Master: {
        marginTop:36,
        alignItems:'center',
        backgroundColor:'white',
        flex:1,
        borderTopLeftRadius:26,
        borderTopRightRadius:26,
        shadowColor: 'black',
        elevation: 18,
    },
    MasterCount: {
        borderRadius: 4,
        backgroundColor: '#fff0f0',
        // backgroundColor:'blue',
        height: 40,
        marginLeft: 6,
        padding: 2,
        // width: '12%',
        borderWidth: 2,
        borderColor: '#e3e3e3',
        alignItems: 'center',
        justifyContent: 'center'
    },
    Product: {
        // backgroundColor: 'white',
        height:150,
        width:160,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.40,
        shadowRadius: 6.27,
        elevation: 9,
        marginVertical: 6,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 4,
        marginHorizontal: 16,
        marginBottom: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    ProdCount: {
        flex: 1,
        margin: 5,
        marginLeft: 5,
        justifyContent: 'center',
        //  alignItems: 'center'
    },
    MasterHead: {
        // flex:1,
        height: 40,
        backgroundColor: '#b30006',
        borderRadius: 4,
        width: '80%',
        justifyContent: 'center'
    },
    ProductIcons:{
        height:70,
        width:60
    }
})
export default Dashboard;