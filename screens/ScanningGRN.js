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

const ScanningGRN = ({ navigation, route }) => {

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
    // const [MasterBox, setMasterBox] = React.useState([])
    const [scannedPrimaryCoupon, setScannedPrimaryCoupon] = React.useState(false)
    const [message, setMessage] = React.useState({ type: '', title: '', message: '' });
    const [buttonDisabled, setButtonDiabled] = React.useState(false);
    // const [Count, setCount] = React.useState(1);
    let scanner;

    React.useEffect(() => {
        const focusEvent = navigation.addListener('focus', () => {
            // getwareHouse();
        });
        return focusEvent;

    });


    const startScan = () => {
        scanner._setScanning(false)
    };


    const checkMasterCoupon = async (codeValue) => {
        console.log("Scanned successfully");
        setScanned(false);
        console.log('product Coupon', codeValue.data);
        // console.log('lin 75', CouponData.box_size);
        console.log('box line 79', Box.length);

        await BaseService.post('AppOrder/checkBarcode', { 'barcode': codeValue.data }
        ).then(res => {

            console.log('Master Box line 92', res);
            if (res.data.status == "Success") {
                let boxData = []
                boxData = Box;
                const index = boxData.findIndex(row => row == codeValue.data);
                console.log('index 100', index);
                if (index === -1) {
                    console.log('boxData at assign time line 158', boxData);
                    boxData.push(codeValue.data);
                    setBox(boxData);
                    // setBox(Box => [...Box, codeValue.data]);
                    console.log('line no 160 box size global', Number(Box));
                    console.log('line no 161 box size local', boxData);
                    console.log('line 123 table count', Box);
                    // setBoxTableList(boxData2);
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
            else if (res.data.status == "Exist") {
                setMessage({ type: 'error', title: "Error!", message: "Barcode already exist" });
                setshowAlert(true)
                setreactive(false)
            }
            else {
                setMessage({ type: 'error', title: "Error!", message: "Something went wrong" });
                setshowAlert(true)
                setreactive(false)
            }
        }).catch(err => console.log('line 94 ->', err))


    }
    const setBoxCoupon = async () => {
        let warehouseId = await AsyncStorage.getItem('@id')
        let warehouseName = await AsyncStorage.getItem('@WarehouseName')
        let Data = {}
        Data.warehouse_id = warehouseId
        Data.warehouse_name = warehouseName
        Data.product_id = route.params.productId
        Data.product_name = route.params.product
        console.log('Box Items', Box);
        console.log('155 coupon code', Data);

        await BaseService.post('AppOrder/saveScannedBarcodes',
            {
                'data': Data,
                'box_array': Box
            }
        ).then(res => {
            console.log("line 136", res);

            if (res.data.status == 'Success' ) {
                navigation.navigate('ReceivedGRN');
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
                    <Text style={{ fontSize: 12, fontWeight: '500', padding: 8 }}>Product {index + 1}:</Text>
                    <Text style={{ fontSize: 12, fontWeight: '500', marginLeft: 8, color: AppTheme.Secondary, flex: 1 }}>{item ? item : 'N/A'}</Text>
                    <IconButton icon="delete-sweep" color={AppTheme.Danger} size={20} style={{ marginLeft: 14 }} onPress={() => removeCoupon(item, index)} />
                </View>
            </View>
        )

    }


    return (

        <View style={{ flex: 1 }}>
            {/* Picker-----------------------------------------------------------------------------------------*/}
            {/* <View style={styles.Picker}>
                <Picker style={{ fontSize: 13 }}
                    mode="dropdown"
                    dropdownIconColor={AppTheme.LightBlue}
                    selectedValue={warehouseType}
                    onValueChange={(e) => {
                        setWarehouseType(e)
                    }}
                >
                    <Picker.Item label="Select Warehouse" value="" />
                    {RenderWarehouse()}
                </Picker>
            </View> */}

            {/* Table------------------------------------------------------------------------------------------ */}
            {/* {boxTableList.length > 0 ? */}
            {/* <View style={[styles.Detail, { maxHeight: "26%" }]}>
                    <View style={{ flexDirection: 'row', backgroundColor: AppTheme.LightBlue, }}>
                        <Title style={{ fontSize: 12, width: '70%', marginLeft: 10, borderRightWidth: 2, marginVertical: -0.1, borderColor: AppTheme.LightBlue, color: AppTheme.Light }}>Part Code</Title>
                        <Title style={{ fontSize: 12, marginLeft: 8, color: AppTheme.Light }}>Master Box</Title>
                    </View>
                    <FlatList nestedScrollEnabled={true} showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index}
                        data={boxTableList}
                        renderItem={RenderPartCodeList}
                    />
                    <View style={{ flexDirection: 'row', backgroundColor: AppTheme.LightBlue, alignItems: 'center', justifyContent: 'center', padding: 4 }}>
                        <Text style={{ fontSize: 12, color: AppTheme.Light, fontWeight: 'bold' }}>Total Master Box :</Text>
                        <Text style={{ fontSize: 12, color: AppTheme.Light, fontWeight: 'bold' }}>  {Box.length}</Text>
                    </View>
                </View> */}
            {/* : null} */}
            {/* Scanning Button-------------------------------------------------------------------------------- */}
            {/* {warehouseType != "" ? */}
            <>
                <View style={[GlobelStyle.Card]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Title style={{ fontSize: 14 }}>Product : </Title>
                        <Text>{route.params.product}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Title style={{ fontSize: 14 }}>Stock : </Title>
                        <Text>{route.params.stock}</Text>
                    </View>
                </View>


                <View style={{ marginHorizontal: 16, marginVertical: 16 }}>
                    <Button mode='contained' icon={'qrcode-scan'} color={AppTheme.Dark} labelStyle={{ fontSize: 14, color: AppTheme.Light }} style={{ marginVertical: 8, width: '100%' }} onPress={() => setScannedPrimaryCoupon(true)}>Scan Product</Button>
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
                    {Box.length > 0 ?
                        <View style={{ alignItems: 'center', marginBottom: 18, flexDirection: 'row', justifyContent: 'center' }}>
                            {/* <View style={{ width: '35%', marginRight: 5 }}>
                                <AppButton title="Save" disabled={buttonDisabled} onPress={() => SaveToWarehouse()} />
                            </View> */}
                            <View style={{ width: '35%' }}>
                                <AppButton title="save" disabled={buttonDisabled} onPress={() => setBoxCoupon()} />
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
                                onRead={scanned ? checkMasterCoupon : undefined}
                                flashMode={RNCamera.Constants.FlashMode.off}
                                reactivate={reactive}
                                bottomContent={
                                    !showAlert &&
                                    <>
                                        <SnackbarComponent visible={showSnackBar}
                                            message={'Product Added To list'} />
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

export default ScanningGRN;