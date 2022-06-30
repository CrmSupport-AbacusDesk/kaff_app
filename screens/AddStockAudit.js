import React, { useState } from 'react'
import { Text, View, StyleSheet, FlatList, Modal, ActivityIndicator, SafeAreaView, TouchableOpacity, Pressable, Alert } from 'react-native'
// import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import { Title, Button, IconButton, TextInput } from 'react-native-paper';
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
import { Picker } from '@react-native-picker/picker';
import StockAudit from './StockAudit';
import * as yup from 'yup';
const opacity = 'rgba(0, 0, 0, .6)';

const AddStockAudit = ({ navigation, route }) => {

    const [showSnackBar, setShowSnackBar] = useState(false);
    const [reactive, setreactive] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showAlert, setshowAlert] = useState(false);
    const [Box, setBox] = React.useState([]);
    const [InvalidBarcode, setInvalidBarcode] = React.useState('');
    const [ProductInfo, setProductInfo] = React.useState([]);
    const [scanned, setScanned] = React.useState(true);
    const [product, setproduct] = React.useState('');
    const [GlobalBox, setGlobalBox] = React.useState([]);
    const [scannedPrimaryCoupon, setScannedPrimaryCoupon] = React.useState(false)
    const [message, setMessage] = React.useState({ type: '', title: '', message: '' });
    const [buttonDisabled, setButtonDiabled] = React.useState(false);
    const [Data, setData] = React.useState([])
    const [CheckBarcode, setCheckBarcode] = React.useState([])
    const [ProductList, setProductList] = React.useState(false)
    const [AuditTitle, setAuditTitle] = React.useState('')
    const [AuditDetailTitle, setAuditDetailTitle] = React.useState('')
    const [ProductName, setProductName] = React.useState('')
    // const [Count, setCount] = React.useState(1);
    let scanner;

    React.useEffect(() => {
        const focusEvent = navigation.addListener('focus', () => {
            GetProductList()
            GetBarcodeData()
        });
        return focusEvent;

    });


    const startScan = () => {
        scanner._setScanning(false)
    };

    const GetBarcodeData = async () => {
        // setLoading(true)
        let warehouseId = await AsyncStorage.getItem('@id')
        console.log("line 21", warehouseId);
        await BaseService.post('AppStock/get_StockAuditBarcodes',

            {
                'id': route.params.id,
                // 'type': route.params.type

            }

        ).then(res => {
            console.log("response", res);
            if(res.data.status == "Success" ){
                 setCheckBarcode(res.data.barcode_list)
            }
            setProductInfo(res.data.productList)

        }).catch(err => console.log('Add claim line 151 ->', err))

    }
    const GetProductList = async () => {
        // setLoading(true)
        let warehouseId = await AsyncStorage.getItem('@id')
        console.log("line 21", warehouseId);
        await BaseService.post('AppStock/getProductList',

            {
                'warehouse_id': warehouseId,
                // 'type': route.params.type

            }

        ).then(res => {
            console.log("response", res);
            setProductInfo(res.data.productList)

        }).catch(err => console.log('Add claim line 151 ->', err))

    }
    let BarcodeData = []
    let BarcodeArray = []
    BarcodeData = Box;

    const CheckInvoiceCoupon = async (codeValue) => {
        let warehouse_id = await AsyncStorage.getItem("@id")
        console.log("Scanned successfully");
        setScanned(false);
        console.log('product Coupon', codeValue.data);
        // console.log('lin 75', CouponData.box_size);
        console.log('box line 79', Box.length);

        await BaseService.post('AppStock/checkBarcodeForTransfer', { 'barcode': codeValue.data, 'warehouse_id': warehouse_id }
        ).then(res => {
            console.log('Response of Stock Barcode Scanned', res);
            let CheckingBarcode = CheckBarcode.findIndex(row => row.barcode == codeValue.data);
            if(CheckingBarcode == -1){
            if (res.data.barcodeStatus.status == "success") {
                let BoxData = []
                // BarcodeData = res.data.barcodeStatus.barcodeData;
                const index = BarcodeData.findIndex(row => row.barcode == codeValue.data);
                console.log('index 100', index);
                console.log(' line 113 BoxData Length', BoxData.length);
                console.log(' Global Box Length', GlobalBox.length);
                if (index === -1) {
                    BoxData.push(res.data.barcodeStatus.barcodeData);
                    BarcodeArray.push(codeValue.data)
                    setShowSnackBar(true);
                    setTimeout(() => {
                        setShowSnackBar(false);
                        setScanned(true)
                    }, 700);
                    setreactive(true)
                    BarcodeData.push({ "productName": res.data.barcodeStatus.barcodeData.productName, 'product_id': res.data.barcodeStatus.barcodeData.product_id, 'barcode': res.data.barcodeStatus.barcodeData.barcode });
                    setBox(BarcodeData)
                    console.log('line 108 Box', Box);
                    console.log("BoxData Length", GlobalBox.length);
                    for (let i = 0; i < BoxData.length; i++) {
                        if (GlobalBox.length > 0) {
                            // for (let Global_index = 0; Global_index < GlobalBox.length; Global_index++) {
                            let index = GlobalBox.findIndex(row => row.product_id == BoxData[i].product_id)
                            console.log("index", index)
                            if (index != -1) {
                                console.log("In IF")
                                GlobalBox[index]['barcode_list'].push(BoxData[i].barcode)
                            } else {
                                console.log("in else", GlobalBox.length - 1)
                                GlobalBox.push({ 'product_id': BoxData[i].product_id, 'barcode': BoxData[i].barcode });
                                GlobalBox[GlobalBox.length - 1]['barcode_list'] = []
                                GlobalBox[GlobalBox.length - 1]['barcode_list'].push(BoxData[i].barcode)
                            }
                            // }
                        } else {
                            GlobalBox.push({ 'product_id': BoxData[i].product_id, 'barcode': BoxData[i].barcode });
                            GlobalBox[i]['barcode_list'] = []
                            GlobalBox[i]['barcode_list'].push(BoxData[i].barcode)
                        }

                    }
                    console.log('GlobalBox', GlobalBox)
                    // console.log('boxData at assign time line 120', BoxData);

                } else {
                    setMessage({ type: 'error', title: "Warning!", message: 'Barcode already exist in list' });
                    setshowAlert(true)
                    setreactive(false)
                }

            }
            else if (res.data.barcodeStatus.status = "Invalid Barcode") {
                console.log('====================================');
                console.log("else Condition");
                console.log('====================================');
                console.log("In else Box", Box);
                setInvalidBarcode(codeValue.data);
                Alert.alert(
                    "Alert Title",
                    (res.data.barcodeStatus.status) + " " + "Choose product",
                    [
                        {
                            text: "Yes",
                            onPress: () => InvalidCodePush(),
                            // style: "cancel"
                        },
                        { text: "OK", onPress: () => handleOk }
                    ]
                );
                //    {assign == 'yes' ?
                //    setInvalidBarcode(codeValue.Data)
                //    :null}
            } else {
                alert(res.data.barcodeStatus.status)
            }}else{
                alert("This barcode is already  scanned for an audit")
            }
        }).catch(err => console.log('line 94 ->', err))


    }

    const InvalidCodePush = () => {
        setProductList(true);
        setScanned(true);
        setreactive(true);
        setshowAlert(false);
        setScannedPrimaryCoupon(false)
        // startScan()
    }

    const setBoxCoupon = async (Status) => {
        console.log("Audite title", AuditTitle);
        // if (Number(CouponData.box_size) == Number(Box.length)) {
        // console.log('line no 255', Box.length);
        let warehouseId = await AsyncStorage.getItem('@id');
        let warehouseName = await AsyncStorage.getItem('@WarehouseName');
        let data = {};
        data.warehouse_id = warehouseId;
        data.warehouse_name = warehouseName;
        data.audit_title = AuditTitle;
        data.total_qty = Box.length;
        data.status = Status;
        {route.params.scan_type == "from_detail" ?
        data.id = route.params.id : null}
        console.log('Data Items', data);
        console.log('155 coupon code', GlobalBox);
        // setButtonDiabled(true);
return
        await BaseService.post('AppStock/addStockAudit',
            {
                'data': data,
                'item_list': GlobalBox
            }
        ).then(res => {
            console.log("Save response", res);
            if (res.data == 'Success') {
                navigation.navigate('StockAudit');
            }
            else if (res.data == "Send Complete Data") {
                alert(res.data)
            } else {
                alert("Check your internet connectivity")
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

    const RenderProduct = () => {

        let productArray = [];
        {
            ProductInfo &&
                ProductInfo.map((s, index) => {
                    s.id &&
                        productArray.push(
                            <Picker.Item style={{ fontSize: 14, backgroundColor: 'red' }} label={s.productName} value={s.id} key={index} />
                        )
                })
        }
        return productArray;
    };

    const Addproduct = (values) => {
        console.log("Values", product);
        console.log("Product Name", ProductName);
        console.log("Barcode", InvalidBarcode);
        console.log("Barcode Data at ADD time", BarcodeData);
        let checkbarcode = BarcodeData.findIndex(row => row.barcode == InvalidBarcode)
        if (checkbarcode == -1) {
            BarcodeArray.push(InvalidBarcode)
            // setBox(BarcodeData)
            for (let i = 0; i < BarcodeArray.length; i++) {
                if (GlobalBox.length > 0) {
                    let index = GlobalBox.findIndex(row => row.product_id == product)
                    console.log("Index", index)
                    if (index == -1) {
                        console.log("Global Box", GlobalBox);
                        GlobalBox.push({ "product_id": product, "barcode": InvalidBarcode });
                        GlobalBox[GlobalBox.length - 1]['barcode_list'] = []
                        GlobalBox[GlobalBox.length - 1]['barcode_list'].push(InvalidBarcode)
                        BarcodeData.push({ "productName": ProductName, "product_id": product, "barcode": InvalidBarcode });
                        setBox(BarcodeData)
                        console.log("In if", GlobalBox);
                    } else {
                        GlobalBox[index]['barcode_list'].push(InvalidBarcode)
                        BarcodeData.push({ "productName": ProductName, "product_id": product, "barcode": InvalidBarcode })
                        setBox(BarcodeData)
                        console.log("In else", GlobalBox);
                    }
                } else {
                    console.log("In else of global > 0");
                    GlobalBox.push({ "product_id": product, "barcode": InvalidBarcode });
                    BarcodeData.push({ "productName": ProductName, "product_id": product, "barcode": InvalidBarcode });
                    setBox(BarcodeData)
                    console.log("Box", BarcodeData)
                    GlobalBox[i]['barcode_list'] = []
                    GlobalBox[i]['barcode_list'].push(InvalidBarcode)
                    console.log("In if", GlobalBox);
                }
            }

        } else {
            setMessage({ type: 'error', title: "Warning!", message: 'Barcode already exist in list' });
            setshowAlert(true)
        }

        setProductList(false)

    }

    const PlaceOrder = (type) => {
        Alert.alert(
            "Alert!",
            "Are you sure, you want to submit ?",
            [
                { text: "Yes", onPress: () => { type == 'Draft' ? setBoxCoupon('Draft') : setBoxCoupon("Complete") } },

                {
                    text: "No",
                    onPress: () => { cancelable: true },
                    style: "cancel"
                },
            ]

        );
    }

    const SaveAuditSchema = yup.object().shape({
        stock_title: yup.string()
            .required('Required'),
    });
    return (

        <View style={{ flex: 1 }}>


            {!scannedPrimaryCoupon &&

                <View style={{ flex: 1 }}>

                    <Formik
                        initialValues={{
                            product: '',
                            stock_title: AuditTitle,
                        }}
                        valid
                        validationSchema={SaveAuditSchema}
                        onSubmit={PlaceOrder}

                    >

                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <>
                                {/* <View style={[GlobelStyle.Card]}> */}
                                {route.params.scan_type == "from_detail" ?
                                <View style={[GlobelStyle.Card]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Title style={{ fontSize: 14 }}>Audit Info : </Title>
                                        <View style={{flex:1}}>
                                        <Text>{route.params.audit_title}</Text>
                                        </View>
                                    </View>
                                </View>
                                :
                                <View style={{ marginHorizontal: 12 }}>
                                    <TextInput
                                        mode="outlined"
                                        label="Audit Information"
                                        value={AuditTitle}
                                        onChangeText={AuditTitle => setAuditTitle(AuditTitle)}
                                        name="stock_title"
                                        placeholderTextColor={AppTheme.Medium}
                                        type="multiline"
                                        onBlur={handleBlur('stock_title')}
                                        autoCorrect={false}
                                        keyboardType="default"
                                    />
                                    {errors.stock_title && touched.stock_title &&
                                        <Caption style={GlobelStyle.errorMsg}>{errors.stock_title}</Caption>
                                    }
                                </View>}
                                {ProductList == true ?
                                    <View style={[GlobelStyle.Card]}>
                                        <View style={styles.Picker}>
                                            <Picker style={[GlobelStyle.selectText]}
                                                mode="dropdown"
                                                dropdownIconColor={AppTheme.LightBlue}
                                                selectedValue={product}
                                                onValueChange={(e) => {
                                                    setproduct(e)
                                                    let product_id = ProductInfo.findIndex(row => row.id == e)
                                                    if (product_id != -1) {
                                                        // let TransferToName = ('');
                                                        setProductName(ProductInfo[product_id].productName)
                                                    } else {
                                                        console.log("check loop again");
                                                        console.log("WarehouseID", wareHouseInfo[Transfer_id].id);
                                                        console.log("WarehouseID Type", e);
                                                    }
                                                }}
                                            >
                                                <Picker.Item label="Choose Product" value="" />
                                                {RenderProduct()}
                                            </Picker>
                                        </View>
                                        <View style={{ marginHorizontal: 16, alignItems: 'center' }}>
                                            <Button mode='contained' icon={'plus-box'} color={AppTheme.Dark} labelStyle={{ fontSize: 14, color: AppTheme.Light }} style={{ marginVertical: 8, width: '50%' }} onPress={() => Addproduct()}>Add</Button>
                                        </View>
                                    </View>
                                    : null}

                                <View style={{ marginHorizontal: 16, marginVertical: 16, alignItems: 'center' }}>
                                    <Button mode='contained' icon={'qrcode-scan'} color={AppTheme.Dark} labelStyle={{ fontSize: 14, color: AppTheme.Light }} style={{ marginVertical: 8, width: '50%' }} onPress={() => setScannedPrimaryCoupon(true)}>Scan Item</Button>
                                </View>
                                <FlatList nestedScrollEnabled={true} showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => index}
                                    data={Box}
                                    renderItem={RenderBoxList}
                                />
                                <View style={{ alignItems: 'flex-end', marginBottom: 'auto', flexDirection: 'row', justifyContent: "space-evenly" }}>
                                    <View style={{ width: '35%' }}>
                                        <AppButton title="Draft" disabled={buttonDisabled} onPress={() => PlaceOrder("Draft")} />
                                    </View>
                                    <View style={{ width: '35%' }}>
                                        <AppButton title="Save" disabled={buttonDisabled} onPress={() => PlaceOrder("Complete")} />
                                    </View>
                                </View>
                            </>
                        )}
                    </Formik>

                </View>
            }


            {/* <View style={{ backgroundColor: 'blue', flex: 1 }}>
                    <Formik
                        initialValues={{
                            product: ''
                        }}
                        // valid
                        // validationSchema={SignupSchema}
                        onSubmit={submit}

                    >

                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <>
                                
                            </>
                        )}
                    </Formik>
                </View> */}



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

export default AddStockAudit;