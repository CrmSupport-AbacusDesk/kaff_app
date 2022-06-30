import React, { useState } from 'react'
import { Text, View, StyleSheet, FlatList, Modal, ActivityIndicator, SafeAreaView, TouchableOpacity, Pressable } from 'react-native'
// import { Button } from 'react-native-elements';
import { Title, Button, IconButton } from 'react-native-paper';
import BaseService from '../services/BaseService';
import AlertMessage from '../Componenets/Alert/AlertMessage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import AppButton from '../Componenets/AppButton/AppButton'
import GlobelStyle from '../Componenets/GlobalStyle/GlobalStyle';
import AppTheme from '../Componenets/AppTheme.js/AppTheme';
// import { Picker } from '@react-native-picker/picker';
import SnackbarComponent from '../Componenets/Snackbar/SnackbarComponent';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';
const opacity = 'rgba(0, 0, 0, .6)';

const InvoiceScann = ({ navigation, route }) => {

    const [showSnackBar, setShowSnackBar] = useState(false);
    const [reactive, setreactive] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showAlert, setshowAlert] = useState(false);
    const [Box, setBox] = React.useState([]);
    const [boxTableList, setBoxTableList] = React.useState([]);
    const [wareHouseInfo, setwareHouseInfo] = React.useState([]);
    const [scanned, setScanned] = React.useState(true);
    const [warehouseType, setWarehouseType] = React.useState('');
    // const [PartCode, setPartCode] = React.useState('');
    // const [MasterBoxInfo, setMasterBoxInfo] = React.useState([])
    const [scannedPrimaryCoupon, setScannedPrimaryCoupon] = React.useState(false)
    const [message, setMessage] = React.useState({ type: '', title: '', message: '' });
    const [buttonDisabled, setButtonDiabled] = React.useState(false);
    const [Data, setData] = React.useState([])
    // const [Count, setCount] = React.useState(1);
    let scanner;

    React.useEffect(() => {
        const focusEvent = navigation.addListener('focus', () => {
            InvoiceData()
            setScannedPrimaryCoupon(true)
        });
        return focusEvent;

    });


    const startScan = () => {
        scanner._setScanning(false)
    };


    const InvoiceData = async () => {
        // setLoading(true)
        let warehouseId = await AsyncStorage.getItem('@id')
        console.log("line 21", warehouseId);
        await BaseService.post('AppOrder/getInvoiceDetail',

            {
                'id': route.params.id,

            }
        ).then(res => {

            console.log('Invoice Detail line 41 ->', res);
            if (res.data.status == "Success") {
                // setInvoiceDetail(res.data.invoiceDetail)
                setData(res.data.invoiceDetail.sales_item)
                // setTimeout(() => {
                //     setLoading(false)
                // }, 700);
            }

        }).catch(err => console.log('Add claim line 151 ->', err))

    }


    let BarcodeData = []
    BarcodeData = Box;
    const CheckInvoiceCoupon = async (codeValue) => {

        console.log("Scanned successfully");
        setScanned(false);
        console.log('product Coupon', codeValue.data);
        // console.log('lin 75', CouponData.box_size);
        console.log('box line 79', Box.length);

        await BaseService.post('AppOrder/checkBarcodeForDispatch', { 'barcode': codeValue.data, 'warehouse_id': '1', 'sales_order_id': route.params.id }
        ).then(res => {

            console.log('Master Box line 92', res);
            if (res.data.status == "success") {
                let boxData = []
                boxData = Box;
                const index = boxData.findIndex(row => row == codeValue.data);
                console.log('index 100', index);
                if (index === -1) {
                    boxData.push(res.data.barcodeData);
                    BarcodeData.push({ "productName": res.data.barcodeData.productName, 'product_id': res.data.barcodeData.product_id, 'barcode': res.data.barcodeData.barcode });
                    setBox(BarcodeData);
                    // setBox(Box => [...Box, codeValue.data]);
                    console.log('line no 160 box size global', Number(Box));
                    console.log('boxData at assign time line 158', boxData);

                    for (let data_key = 0; data_key < Data.length; data_key++) {

                        let item_array = [];

                        for (let box_data_key = 0; box_data_key < boxData.length; box_data_key++) {

                            if (item_array.length < Data[data_key]['QtyOrdered'] && Data[data_key]['product_id'] == boxData[box_data_key]['product_id']) {

                                item_array.push(boxData[box_data_key]['barcode']);

                            } else {
                                console.log("Your item code limit is full");
                            }

                            Data[data_key]['barcode_list'] = item_array;


                        }
                    }
                    console.log('line 123 Data', Data);
                    // console.log("Data",Data);
                    // boxData.push(codeValue.data);
                    // setBox(Box => [...Box, codeValue.data]);
                    // for (let i = 0; i < boxData.length; i++) {
                    //     let j = boxData2.findIndex(row => row.part_code == boxData[i].part_code);
                    //     if (j === -1) {
                    //         boxData2.push({ 'part_code': boxData[i].part_code, 'count': 1 })
                    //     }
                    //     else {
                    //         boxData2[j].count = boxData2[j].count + 1;
                    //     }
                    // }
                    // setBoxTableList(boxData2);
                    setShowSnackBar(true);
                    setTimeout(() => {
                        setShowSnackBar(false);
                        setScanned(true)
                    }, 700);
                    setreactive(true)
                    // setMessage({ type: 'Success', title: "Success!", message: 'Master Box Added To List' });
                    // setshowAlert(true);
                    // setMasterBox(res.data.master_box_codes)
                    // setMasterBoxInfo(res.data.master_box_information)
                }
                else {
                    setMessage({ type: 'error', title: "Warning!", message: 'Master box already exist in list' });
                    setshowAlert(true)
                    setreactive(false)
                }

            }
            else {
                setMessage({ type: 'error', title: "Error!", message: res.data.status });
                setshowAlert(true)
                setreactive(false)
            }
        }).catch(err => console.log('line 94 ->', err))


    }


    const setBoxCoupon = async () => {

        // if (Number(CouponData.box_size) == Number(Box.length)) {
        // console.log('line no 255', Box.length);
        let warehouseId = '1'
        let warehouseName = 'Bhubaneswar New Main WH'
        let data = {}
        data.warehouse_id = warehouseId
        data.warehouse_name = warehouseName
        // data.warehouse_name = ""
        console.log('Box Items', Data);
        console.log('155 coupon code', Data);
        // setButtonDiabled(true);

        await BaseService.post('AppOrder/dispatchInvoice',
            {
                // 'data': data,
                'item_list': Data
            }
        ).then(res => {
            console.log("line 136", res);
            if (res.data == 'Success') {
                navigation.navigate('Invoice');
            } else if (res.data == "Send Complete Data") {
                alert(res.data)
            }
            else {
                alert('Please Check Your Internet Connectivity')
            }
        }).catch(err => console.log('line 94 ->', err))
    }

    const handleOk = () => {
        setScanned(true);
        setreactive(true);
        setshowAlert(false);
        startScan()
    }
    const removeCoupon = (item, index) => {
        setBox(Box => Box.filter((Box, i) => i !== index));
    }
    // console.log('MasterBoxInfo',MasterBoxInfo);
    const RenderBoxList = ({ item, index }) => {

        return (
            <View style={[styles.Detail, { marginHorizontal: 10 }]}>
                <View style={{ flexDirection: 'row', backgroundColor: "#d9e7ff", alignItems: 'center', borderBottomWidth: 2, borderColor: AppTheme.LightBlue }}>
                    <Text style={{ fontSize: 12, fontWeight: '500', padding: 8 }}>Item {index + 1}:</Text>
                    <Text style={{ fontSize: 12, fontWeight: '500', marginLeft: 8, color: AppTheme.Secondary, flex: 1 }}>{item.barcode ? item.barcode : 'N/A'}</Text>
                    {/* <IconButton icon="delete-sweep" color={AppTheme.Danger} size={20} style={{ marginLeft: 14 }} onPress={() => removeCoupon(item, index)} /> */}
                </View>
                <View style={{ flexDirection: 'row', alignItems: "center", padding: 4 }}>
                    <Text>Product : </Text>
                    <Text style={{ fontSize: 12, fontWeight: '500', marginLeft: 8, color: AppTheme.Secondary, flex: 1 }}>{item.productName ? item.productName : 'N/A'}</Text>
                    {/* <IconButton icon="delete-sweep" color={AppTheme.Danger} size={20} style={{ marginLeft: 14 }} onPress={() => removeCoupon(item, index)} /> */}
                </View>
            </View>
        )

    }


    return (

        <View style={{ flex: 1 }}>

            <>

                <View style={[GlobelStyle.Card]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Title style={{ fontSize: 14 }}>S.O No. : </Title>
                        <Text>{route.params.so_no}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Title style={{ fontSize: 14 }}>Total Qty : </Title>
                        <Text>{route.params.totalQty}</Text>
                    </View>
                </View>

                <View style={{ marginHorizontal: 16, marginVertical: 16, alignItems: 'center' }}>
                    <Button mode='contained' icon={'qrcode-scan'} color={AppTheme.Dark} labelStyle={{ fontSize: 14, color: AppTheme.Light }} style={{ marginVertical: 8, width: '50%' }} onPress={() => setScannedPrimaryCoupon(true)}>Scan Item</Button>
                </View>
            </>
            {/* : null} */}
            {/* Master Box list and Save Button --------------------------------------------------------------------- */}
            {!scannedPrimaryCoupon &&

                <View style={{ marginVertical: 0, flex: 1 }}>
                    <FlatList nestedScrollEnabled={true} showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index}
                        data={Box}
                        renderItem={RenderBoxList}
                    />
                    {Box.length == route.params.totalQty ?
                        <View style={{ alignItems: 'center', marginBottom: 18, flexDirection: 'row', justifyContent: 'center' }}>
                            {/* <View style={{ width: '35%', marginRight: 5 }}>
                                <AppButton title="Save" disabled={buttonDisabled} onPress={() => SaveToWarehouse()} />
                            </View> */}
                            <View style={{ width: '35%' }}>
                                <AppButton title="Save" disabled={buttonDisabled} onPress={() => setBoxCoupon()} />
                            </View>
                        </View>
                        : null}
                </View>
            }

            {/* Alert Message --------------------------------------------------------------------------------------- */}
            {showAlert ?
                <View style={styles.Main}>
                    <AlertMessage
                        type={message.type}
                        title={message.title}
                        message={message.message}
                        visible={showAlert}
                        handleOk={handleOk} labelOK='Ok' />
                </View>
                :
                null
            }

            {/* QR Code Modal ---------------------------------------------------------------------------------------------- */}
            <View style={{ alignItems: 'center' }}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={scannedPrimaryCoupon}
                    onRequestClose={() => {
                        setScannedPrimaryCoupon(!scannedPrimaryCoupon);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <QRCodeScanner
                                ref={(camera) => scanner = camera}
                                onRead={scanned ? CheckInvoiceCoupon : undefined}
                                flashMode={RNCamera.Constants.FlashMode.off}
                                reactivate={reactive}
                                bottomContent={
                                    !showAlert &&
                                    <>
                                        <SnackbarComponent visible={showSnackBar}
                                            message={'Item Added To list'} />
                                        <TouchableOpacity style={styles.buttonTouchable} onPress={() => setScannedPrimaryCoupon(false)}>
                                            <Text style={styles.buttonText}>View All</Text>
                                        </TouchableOpacity>
                                    </>
                                }
                                style={{ flex: 1 }}
                            >
                                <View style={styles.layerTop} />
                                <View style={styles.layerCenter}>
                                    <View style={styles.layerLeft} />
                                    <View style={styles.focused} />
                                    <View style={styles.layerRight} />
                                </View>
                                <View style={styles.layerBottom} />
                            </QRCodeScanner>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>

    )

}
const styles = StyleSheet.create({

    Head: {
        backgroundColor: '#f5f5f5',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.40,
        shadowRadius: 6.27,
        elevation: 9,
        borderBottomWidth: 1,
        borderColor: '#e0edff',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        padding: 8,
    },
    centeredView: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#525252',
        // opacity: 0.9,
    },
    modalView: {
        backgroundColor: "black",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    layerTop: {
        flex: 2,
        backgroundColor: opacity
    },
    layerCenter: {
        flex: 3,
        flexDirection: 'row'
    },
    layerLeft: {
        flex: 1,
        backgroundColor: opacity
    },
    focused: {
        flex: 8
    },
    layerRight: {
        flex: 1,
        backgroundColor: opacity
    },
    layerBottom: {
        flex: 2,
        backgroundColor: opacity
    },
    body: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: AppTheme.Light

    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    },
    Detail: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.40,
        shadowRadius: 6.27,
        elevation: 9,
        marginHorizontal: 16,
        marginVertical: 6,
        borderWidth: 2,
        borderColor: AppTheme.LightBlue,
        borderRadius: 4,
        backgroundColor: '#e6eefc',
    },
    Main: {
        marginHorizontal: 16
    },
    MasterNo: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    input: {
        height: 35,
        marginTop: 12,
        marginLeft: 10,
        width: '50%',
        fontSize: 12,
        lineHeight: 18,
        backgroundColor: '#e8edff',
    },
    Boxinput: {
        height: 40,
        width: '90%',
        fontSize: 12,
        lineHeight: 18,
        marginVertical: 6,
        backgroundColor: 'white',

    },
    TextStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginVertical: 10
    },
    CheckBox: {
        height: 30,
        marginLeft: 10
    },
    Picker: {
        backgroundColor: '#e6eefc',
        borderWidth: 2,
        margin: 12,
        borderColor: AppTheme.LightBlue,

    }
})

export default InvoiceScann;