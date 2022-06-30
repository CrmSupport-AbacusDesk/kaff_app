import * as React from 'react';
import {Alert,View} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../screens/Dashboard';
// import { UserContext } from '../screens/context/UserContext';
import Warehouse from '../screens/WareHouse';
// import InvoiceDetail from '../screens/InvoiceDetail';
import { UserContext } from '../context/UserContext';
import LogIn from '../screens/LoginScreen';
import AppTheme from '../Componenets/AppTheme.js/AppTheme';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReceivedGRN from '../screens/ReceivedGRN';
import ScanningGRN from '../screens/ScanningGRN';
import Invoice from '../screens/Invoice';
import InvoiceDetail from '../screens/InvoiceDetail';
import InvoiceScann from '../screens/InvoiceScann';
import StockTransferDetail from '../screens/StockTransferDetail';
import StockTransferList from '../screens/StockTransferList';
import StockTransfer from '../screens/StockTransfer';
import StockAudit from '../screens/StockAudit';
import AddStockAudit from '../screens/AddStockAudit';
import StockAuditDetail from '../screens/stockAuditDetail';

const MyStack = () => {
  const Stack = createNativeStackNavigator()
  const { SignOut } = React.useContext(UserContext);
  const LogOut = () => {
    return (
        Alert.alert(
            'Alert',
            'Are you sure , you want to logout',
            [{
                text: "Cancel",
                cancelable: true,
                style: "cancel"
            },
            { text: 'OK', onPress: () => SignOut() }]
        )
    )
}
  return (
   
      <Stack.Navigator>
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ 
            title: 'KAFF', 
            fontSize:14,
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
            color:'white'
            // headerTitleStyle: { fontSize: 16 }
          
        },
        headerRight: () => (
          <TouchableOpacity >
              <Icon name="logout" color={AppTheme.Danger} size={22} onPress={() => LogOut()} />
          </TouchableOpacity>
      ),
      }} />
        <Stack.Screen name="Warehouse" component={Warehouse} options={{ 
            title: 'Ware House', 
            headerTintColor:'white',
           headerStyle: {
            backgroundColor:AppTheme.Danger,
            borderBottomWidth: 0,
            //  fontSize: 16 
        }
      }}/>
        <Stack.Screen name="LogIn" component={LogIn} options={{ 
            title: 'LogIn', 
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
             fontSize: 16 
        }
      }}/>
        <Stack.Screen name="ReceivedGRN" component={ReceivedGRN} options={{ 
            title: 'Product GRN', 
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
             fontSize: 16 
        }
      }}/>
        <Stack.Screen name="Invoice" component={Invoice} options={{ 
            title: 'Invoice', 
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
             fontSize: 16 
        }
      }}/>
        <Stack.Screen name="InvoiceDetail" component={InvoiceDetail} options={{ 
            title: 'Invoice Detail', 
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
             fontSize: 16 
        }
      }}/>
        <Stack.Screen name="InvoiceScann" component={InvoiceScann} options={{ 
            title: 'Dispatch Invoice Items', 
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
             fontSize: 16 
        }
      }}/>
        <Stack.Screen name="ScanningGRN" component={ScanningGRN} options={{ 
            title: 'Scan product GRN', 
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
             fontSize: 16 
        }
      }}/>
        <Stack.Screen name="StockTransferDetail" component={StockTransferDetail} options={{ 
            title: 'Stock Transfer Detail', 
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
             fontSize: 16 
        }
      }}/>
        <Stack.Screen name="StockTransferList" component={StockTransferList} options={{ 
            title: 'Stock Transfer List', 
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
             fontSize: 16 
        }
      }}/>
        <Stack.Screen name="StockTransfer" component={StockTransfer} options={{ 
            title: 'Stock Transfer', 
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
             fontSize: 16 
        }
      }}/>
        <Stack.Screen name="StockAudit" component={StockAudit} options={{ 
            title: 'Stock Audit', 
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
             fontSize: 16 
        }
      }}/>
        <Stack.Screen name="AddStockAudit" component={AddStockAudit} options={{ 
            title: 'Add stock Audit', 
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
             fontSize: 16 
        }
      }}/>
        <Stack.Screen name="StockAuditDetail" component={StockAuditDetail} options={{ 
            title: 'Stock Audit Detail', 
            headerTintColor:AppTheme.Medium,
           headerStyle: {
            backgroundColor:AppTheme.Light,
            borderBottomWidth: 0,
             fontSize: 16 
        }
      }}/>
      
      </Stack.Navigator>
    
  );
};

export default MyStack;

