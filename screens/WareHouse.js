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
const opacity = 'rgba(0, 0, 0, .6)';

const Warehouse = ({ navigation }) => {

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
            getwareHouse();
        });
        return focusEvent;

    });


    const startScan = () => {
        scanner._setScanning(false)
    };

    const getwareHouse = async () => {

        // await BaseService.post('CouponCode/wareHouseList',
        const response = await fetch('https://phpstack-414838-2222412.cloudwaysapps.com/askApi/index.php/CouponCode/wareHouseList');
        // const response = await fetch('https://ask.abacusdesk.com/askApi/index.php/CouponCode/wareHouseList');

        const res = await response.json();

        // ).then(res => {
        console.log('Master Coupon data line 64', res);

        if (res.msg == "Success") {
            setwareHouseInfo(res.data);
            setreactive(true)
        }
        else if (res.data.status == "300") {
            setMessage({ type: 'error', title: "Error!", message: res.data.message });
        }
        // }).catch(err => console.log('line 94 ->', err))

    }


    const checkMasterCoupon = async (codeValue) => {

        setScanned(false);
        // console.log('lin 75', CouponData.box_size);
        // console.log('box line 79', Box.length);
        // console.log('primary coupon 80', codeValue.data);
        const response = await fetch('https://phpstack-414838-2222412.cloudwaysapps.com/askApi/index.php/CouponCode/master_box_status',
        // const response = await fetch('https://ask.abacusdesk.com/askApi/index.php/CouponCode/master_box_status',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'master_box_coupon': codeValue.data,
                })
            });
        const res = await response.json();

        // await BaseService.post('CouponCode/master_box_status', { 'master_box_coupon': codeValue.data, }
        // ).then(res => {

        console.log('Master Box line 92', res);
        if (res.data.status == "200") {

            // const index = Box.findIndex(row => row.serial_no == codeValue.data);
            let boxData = []
            boxData = Box;
            const index = boxData.findIndex(row => row.coupon_code == codeValue.data);
            // console.log('index 100', index);
            if (index === -1) {
                boxData.push(res.data.master_box_information);
                setBox(boxData);
                let boxData2 = [];
                // setBox(Box => [...Box, codeValue.data]);
                for (let i = 0; i < boxData.length; i++) {
                    let j = boxData2.findIndex(row => row.part_code == boxData[i].part_code);
                    if (j === -1) {
                        boxData2.push({ 'part_code': boxData[i].part_code, 'count': 1 })
                    }
                    else {
                        boxData2[j].count = boxData2[j].count + 1;
                    }
                }
                console.log('line 123 table count', boxData2);
                setBoxTableList(boxData2);
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
                setMessage({ type: 'error', title: "Warning!", message: 'Master Box Already Exist In List' });
                setshowAlert(true)
                setreactive(false)
            }
        }
        else if (res.data.status == "300") {
            setMessage({ type: 'error', title: "Error!", message: res.data.message });
            setshowAlert(true)
            setreactive(false)
        }
        else {
            setMessage({ type: 'error', title: "Error!", message: res.data.message });
            setshowAlert(true)
            setreactive(false)
        }
        // }).catch(err => console.log('line 94 ->', err))


    }

    const SaveToWarehouse = async () => {

        setButtonDiabled(true);
        let data = [];
        for (let index = 0; index < Box.length; index++) {
            data.push(Box[index].coupon_code)
        }
        console.log('155 coupon code', data);
        const response = await fetch('https://phpstack-414838-2222412.cloudwaysapps.com/askApi/index.php/CouponCode/assign_box_to_warehouse',
        // const response = await fetch('https://ask.abacusdesk.com/askApi/index.php/CouponCode/assign_box_to_warehouse',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'warehouse_id': warehouseType,
                    'box_array': data
                })
            });
        const res = await response.json();
        // await BaseService.post('CouponCode/assign_box_to_warehouse', { 'warehouse_id': warehouseType, 'box_array': Box }
        // ).then(res => {
        console.log('Saved Box coupon data line 163', res);
        // console.log('Saved Box coupon data ', res.data);
        navigation.navigate('Dashboard');
        setButtonDiabled(false);
        // if (res.data.data.status == "200") {
        //     console.log(e);
        //     setBox(Box => [...Box, e]);

        //     // setBox([{...Box,e}])
        //     // seteditable(false)
        //     // setColor('green')
        // }
        // else {
        //     setMessage({ type: 'error', title: "Error!", message: res.data.data.message });
        //     setshowAlert(true)
        // }
        // }).catch(err => console.log('line 94 ->', err))
    }


    const handleOk = () => {
        setScanned(true);
        setreactive(true);
        setshowAlert(false);
        startScan()
    }

    const RenderWarehouse = () => {

        let wareHouseArray = [];
        {
            wareHouseInfo &&
                wareHouseInfo.map((s, index) => {
                    s.id &&
                        wareHouseArray.push(
                            <Picker.Item style={{ fontSize: 13 }} label={s.warehouse_name} value={s.id} key={index} />
                        )

                })
        }
        return wareHouseArray;
    };


    const removeCoupon = (item, index) => {
        let boxData = [];
        boxData = Box;
        boxData.splice(index, 1);
        setBox(boxData);
        // setBox(Box => Box.filter((Box, i) => i !== index));
        let boxData2 = [];
        // setBox(Box => [...Box, codeValue.data]);
        for (let i = 0; i < boxData.length; i++) {
            let j = boxData2.findIndex(row => row.part_code == boxData[i].part_code);
            if (j === -1) {
                boxData2.push({ 'part_code': boxData[i].part_code, 'count': 1 })
            }
            else {
                boxData2[j].count = boxData2[j].count + 1;
            }
        }
        console.log('line 226 table count', boxData2);
        setBoxTableList(boxData2);
    }

    // console.log('MasterBoxInfo',MasterBoxInfo);
    const RenderBoxList = ({ item, index }) => {

        return (
            <View style={[styles.Detail, { marginHorizontal: 10 }]}>
                <View style={{ flexDirection: 'row', backgroundColor: "#d9e7ff", alignItems: 'center', borderBottomWidth: 2, borderColor: AppTheme.LightBlue }}>
                    <Text style={{ fontSize: 12, fontWeight: '500', padding: 8 }}>Master Box {index + 1}:</Text>
                    <Text style={{ fontSize: 12, fontWeight: '500', marginLeft: 8, color: AppTheme.Secondary, flex: 1 }}>{item.coupon_code ? item.coupon_code : 'N/A'}</Text>
                    <IconButton icon="delete-sweep" color={AppTheme.Danger} size={20} style={{ marginLeft: 14 }} onPress={() => removeCoupon(item, index)} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
                    <Text style={{ fontSize: 11, fontWeight: '500', color: AppTheme.Secondary, flex: 1 }}>{item.part_code ? item.part_code : 'N/A'}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '500', paddingLeft: 12 }}>Box Size : </Text>
                    <Text style={{ fontSize: 11, fontWeight: '500', color: AppTheme.Secondary }}>{item.box_size ? item.box_size : 'N/A'}</Text>
                </View>
            </View>
        )

    }


    const RenderPartCodeList = ({ item, index }) => {
        return (
            <>
                <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: AppTheme.LightBlue, alignItems: 'center', }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', width: '70%', marginLeft: 10, borderColor: AppTheme.LightBlue }}>{item.part_code ? item.part_code : 'N/A'}</Text>
                    <Title style={{ fontSize: 11, fontWeight: 'bold', paddingLeft: 16, marginVertical: -0.1, borderLeftWidth: 2, borderColor: AppTheme.LightBlue }}>{item.count ? item.count : 'N/A'}</Title>
                </View>
            </>
        )
    }



    return (

        <View style={{ flex: 1 }}>
            {/* Picker-----------------------------------------------------------------------------------------*/}
            <View style={styles.Picker}>
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
            </View>

            {/* Table------------------------------------------------------------------------------------------ */}
            {boxTableList.length > 0 ?
                <View style={[styles.Detail, { maxHeight: "26%" }]}>
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
                </View>
                : null}
            {/* Scanning Button-------------------------------------------------------------------------------- */}
            {warehouseType != "" ?
                <>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Pressable onPress={() => setScannedPrimaryCoupon(true)} style={{width:200,background:'blue'}} ><Text style={{color:'white'}}>Use with Phone</Text></Pressable>
                                <Pressable style={{marginTop:10}}><Text style={{color:'white'}}>Use With Code</Text></Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text>Hide Modal</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>

                    <View style={{ marginHorizontal: 16, marginVertical: 16 }}>
                        <Button mode='contained' icon={'qrcode-scan'} color={AppTheme.Primary} labelStyle={{ fontSize: 14, color: AppTheme.Light }} style={{ marginVertical: 8, width: '100%' }}  onPress={() => setModalVisible(true)}>Scan Master Box</Button>
                    </View>
                </>
                : null}
            {/* Master Box list and Save Button --------------------------------------------------------------------- */}
            {!scannedPrimaryCoupon &&

                <View style={{ marginVertical: 0, flex: 1 }}>
                    <FlatList nestedScrollEnabled={true} showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index}
                        data={Box}
                        renderItem={RenderBoxList}
                    />
                    {Box.length > 0 ?
                        <View style={{ alignItems: 'center', marginBottom: 18 }}>
                            <View style={{ width: '50%' }}>
                                <AppButton title="Save" disabled={buttonDisabled} onPress={() => SaveToWarehouse()} />
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
                                            message={'Box Added To list'} />
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

export default Warehouse;