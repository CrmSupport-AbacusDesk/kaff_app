import React from 'react'
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import AppTheme from '../AppTheme.js/AppTheme';

export default function AppLoader({ loading }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator animating={loading} color={AppTheme.Dark} size={40} />
        </View>
    )
}
