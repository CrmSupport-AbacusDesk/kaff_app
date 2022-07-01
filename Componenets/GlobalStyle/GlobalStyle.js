import { StyleSheet } from 'react-native';
import AppTheme from '../AppTheme.js/AppTheme';

const GlobelStyle = StyleSheet.create({

    cardMaterial: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: AppTheme.Light,
        shadowColor: AppTheme.Dark,
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.40,
        shadowRadius: 6.27,
        elevation: 12,
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18
    },
    noDataContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    MasterCount: {
        borderRadius: 4,
        backgroundColor: '#e6eefc',
        height: 30,
        marginLeft: 26,
        width: '12%',
        borderWidth: 2,
        borderColor: AppTheme.LightBlue,
        alignItems: 'center',
        justifyContent: 'center'
    }, Card: {
        backgroundColor: AppTheme.Light,
        borderRadius: 8,
        padding: 8,
        marginHorizontal: 12,
        marginVertical: 16,
        elevation: 18,
        shadowColor: 'black',
    },fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: AppTheme.Secondary,
        borderWidth: 1,
        borderColor: AppTheme.Light
    },errorMsg : {
        color: AppTheme.Danger
    }

})
export default GlobelStyle;