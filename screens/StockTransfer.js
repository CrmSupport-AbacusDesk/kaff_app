import React, { useState } from 'react'
import { Text, View, StyleSheet, FlatList, Modal, ActivityIndicator, SafeAreaView, TouchableOpacity, Pressable } from 'react-native'
// import { Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { Title, Button, IconButton } from 'react-native-paper';
import BaseService from '../services/BaseService';
import AlertMessage from '../Componenets/Alert/AlertMessage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import AppButton from '../Componenets/AppButton/AppButton'
import GlobelStyle from '../Componenets/GlobalStyle/GlobalStyle';
import AppTheme from '../Componenets/AppTheme.js/AppTheme';
import { TextInput } from 'react-native-paper';
// import { Picker } from '@react-native-picker/picker';
import SnackbarComponent from '../Componenets/Snackbar/SnackbarComponent';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';
import { Formik, isEmptyArray } from 'formik';
const opacity = 'rgba(0, 0, 0, .6)';

const StockTransfer = ({ navigation, route }) => {

    const [showSnackBar, setShowSnackBar] = useState(false);
    const [reactive, setreactive] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showAlert, setshowAlert] = useState(false);
    // const [BarcodeData, setBarcodeData] = useState({});
    const [Box, setBox] = React.useState([]);
    const [GlobalBox, setGlobalBox] = React.useState([]);
    const [boxTableList, setBoxTableList] = React.useState([]);
    const [wareHouseInfo, setwareHouseInfo] = React.useState([]);
    const [ItemList, setItemList] = React.useState([]);
    const [scanned, setScanned] = React.useState(true);
    const [warehouseType, setWarehouseType] = React.useState('');
    const [TransferType, setTransferType] = React.useState('');
    const [scannedPrimaryCoupon, setScannedPrimaryCoupon] = React.useState(false)
    const [message, setMessage] = React.useState({ type: '', title: '', message: '' });
    const [buttonDisabled, setButtonDiabled] = React.useState(false);
    const [TransferToName, setTransferToName] = React.useState("");
    let scanner;


    React.useEffect(() => {
        const focusEvent = navigation.addListener('focus', () => {
            // InvoiceData()
            WarehouseData()
            warehouseItemlist()
            // setScannedPrimaryCoupon(true)
        });
        return focusEvent;

    });


    const startScan = () => {
        scanner._setScanning(false)
    };



    const WarehouseData = async () => {
        // setLoading(true)
        let warehouseId = await AsyncStorage.getItem('@id')
        console.log("line 21", warehouseId);
        await BaseService.post('AppStock/get_warehouse_list',

            {
                'warehouse_id': warehouseId,
                'type': route.params.type

            }
        ).then(res => {
            setwareHouseInfo(res.data.warehouse_list)

        }).catch(err => console.log('Add claim line 151 ->', err))

    }

    // let BOX = [];
    const warehouseItemlist = async () => {
        // setLoading(true)
        let warehouseId = await AsyncStorage.getItem('@id')
        console.log("line 21", warehouseId);
        await BaseService.post('AppStock/warehouseItemList',

            {
                'warehouse_id': warehouseId,
                // 'type': route.params.type

            }
        ).then(res => {
            console.log("warehouse item list",res.data);
            setItemList(res.data.itemList)

        }).catch(err => console.log('Add claim line 151 ->', err))

    }

    let BarcodeData = []
                BarcodeData = Box;
    const CheckStockCoupon = async (codeValue) => {
        let warehouse_id = await AsyncStorage.getItem("@id")
        console.log("Scanned successfully");
        setScanned(false);
        console.log('Coupon code', codeValue.data);
        await BaseService.post('AppStock/checkBarcodeForTransfer', { 'barcode': codeValue.data, 'warehouse_id': warehouse_id }
        ).then(res => {
            console.log('Coupon Box line 92', res);
            let ItemIndex = ItemList.findIndex
            if (res.data.barcodeStatus.status == "success") {
                let BoxData = []
                const index = BarcodeData.findIndex(row => row == codeValue.data);
                console.log('index 100', index);
                console.log(' line 113 BoxData Length', BoxData.length);
                console.log(' Global Box Length', GlobalBox.length);
                if (index === -1) {
                    BarcodeData.push({ "productName": res.data.barcodeStatus.barcodeData.productName, 'barcode': res.data.barcodeStatus.barcodeData.barcode });
                    setBox(BarcodeData)
                    console.log('line 115 BoxData Length', BoxData.length);
                    BoxData.push(res.data.barcodeStatus.barcodeData);
                    console.log("BoxData Length", GlobalBox.length);
                    for (let i = 0; i < BoxData.length; i++) {
                        if (GlobalBox.length > 0) {
                            // for (let Global_index = 0; Global_index < GlobalBox.length; Global_index++) {
                            let index = GlobalBox.findIndex(row => row.product_id == BoxData[i].product_id)
                            if (index != -1) {
                                GlobalBox[index]['barcode_list'].push(BoxData[i].barcode)
                            } else {
                                console.log("in else")
                                GlobalBox.push({ 'product_id': BoxData[i].product_id, 'category': BoxData[i].category, 'productName': BoxData[i].productName, 'ItemCode': BoxData[i].ItemCode, 'barcode': BoxData[i].barcode });
                                GlobalBox[GlobalBox.length - 1]['barcode_list'] = []
                                GlobalBox[GlobalBox.length - 1]['barcode_list'].push(BoxData[i].barcode)
                            }
                            // }
                        } else {
                            GlobalBox.push({ 'product_id': BoxData[i].product_id, 'category': BoxData[i].category, 'productName': BoxData[i].productName, 'ItemCode': BoxData[i].ItemCode, 'barcode': BoxData[i].barcode });
                            GlobalBox[i]['barcode_list'] = []
                            GlobalBox[i]['barcode_list'].push(BoxData[i].barcode)

                        }

                    }
                    console.log('GlobalBox', GlobalBox)
                    console.log('boxData at assign time line 120', BoxData);
                    // console.log('GlobalBox at assign time line 120', GlobalBox);
                    // console.log('boxData at assign time line 158', Box);
                    setShowSnackBar(true);
                    setTimeout(() => {
                        setShowSnackBar(false);
                        setScanned(true)
                    }, 700);
                    setreactive(true)
                }
                else {
                    setMessage({ type: 'error', title: "Warning!", message: 'Barcode already exist in list' });
                    setshowAlert(true)
                    setreactive(false)
                }

            }
            else {
                setMessage({ type: 'error', title: "Error!", message: res.data.barcodeStatus.status });
                setshowAlert(true)
                setreactive(false)
            }
        }).catch(err => console.log('line 94 ->', err))


    }



    const setBoxCoupon = async () => {
        console.log('====================================');
        console.log("Ware house name ", TransferToName);
        console.log('====================================');
        let warehouseId = await AsyncStorage.getItem('@id');
        let warehouseName = await AsyncStorage.getItem('@WarehouseName');
        let data = {}
        data.warehouse_name = warehouseName
        data.transferred_type = route.params.type
        data.transferred_to_name = TransferToName
        data.warehouse_id = warehouseId
        data.transferred_to = warehouseType
        console.log('Box Items', data);
        console.log("bar code array", GlobalBox)

        await BaseService.post('AppStock/transferStock',
            {
                'data': data,
                'item_list': GlobalBox
            }
        ).then(res => {
            console.log("line 136", res);
            if (res.data == 'Success') {
                navigation.navigate('StockTransferList');
            }else if(res.data == "Send Complete Data"){
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
            {/* </View> */}
        </View>
        )

    }

    const RenderWarehouse = () => {

        let wareHouseArray = [];
        {
            wareHouseInfo &&
                wareHouseInfo.map((s, index) => {
                    s.id &&
                        wareHouseArray.push(
                            <Picker.Item style={{ fontSize: 14, backgroundColor: 'red' }} label={s.Name} value={s.id} key={index} />

                        )


                })
        }
        return wareHouseArray;
    };

    return (

        <View style={{ flex: 1 }}>

            <>
                <Formik
                    initialValues={{
                        warehouseType: ''
                    }}
                // valid
                // validationSchema={SignupSchema}
                // onSubmit={submit}

                >

                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
                            <View style={styles.Picker}>
                                <Picker style={[GlobelStyle.selectText]}
                                    mode="dropdown"
                                    dropdownIconColor={AppTheme.LightBlue}
                                    selectedValue={warehouseType}
                                    onValueChange={(e) => {
                                        setWarehouseType(e);
                                        // for (let i = 0; i < wareHouseInfo.length; i++) {
                                        let Transfer_id = wareHouseInfo.findIndex(row => row.id == e)
                                        if (Transfer_id != -1) {
                                            // let TransferToName = ('');
                                            setTransferToName(wareHouseInfo[Transfer_id].Name)
                                        } else {
                                            console.log("check loop again");
                                        }
                                        // }
                                    }}
                                >
                                    <Picker.Item label="Warehouse" value="" />
                                    {RenderWarehouse()}
                                </Picker>
                            </View>
                        </>
                    )}
                </Formik>

                {warehouseType != '' ?
                    <View style={{ marginHorizontal: 16, marginVertical: 16, alignItems: 'center' }}>
                        <Button mode='contained' icon={'qrcode-scan'} color={AppTheme.Dark} labelStyle={{ fontSize: 14, color: AppTheme.Light }} style={{ marginVertical: 8, width: '50%' }} onPress={() => setScannedPrimaryCoupon(true)}>Scan Item</Button>
                    </View>
                    : null}
            </>
            {!scannedPrimaryCoupon ?

                <View style={{ marginVertical: 0, flex: 1 }}>
                    <FlatList nestedScrollEnabled={true} showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index}
                        data={Box}
                        renderItem={RenderBoxList}
                    />
                    {/* {Box.length > 0 ? */}
                    <View style={{ alignItems: 'center', marginBottom: 18, flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ width: '35%' }}>
                            <AppButton title="Transfer" disabled={buttonDisabled} onPress={() => setBoxCoupon()} />
                        </View>
                    </View>
                    {/* // : null} */}
                </View>
           :null }

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
                                onRead={scanned ? CheckStockCoupon : undefined}
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
    Picker: {
        backgroundColor: '#e6eefc',
        borderWidth: 2,
        margin: 12,
        borderColor: AppTheme.LightBlue,
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

export default StockTransfer;