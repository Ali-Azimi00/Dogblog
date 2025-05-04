import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Image } from 'react-native';


const LoadingScreen = ({ message }: any) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#FF9C01" />
            <Text style={styles.loadingText}>{message ? message : 'Fetching bones...'}</Text>
        </View>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161622',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#333',
    },
    animation: {
        width: 200,
        height: 200,
    },
    gif: {
        width: 200,
        height: 200,
    },
});
