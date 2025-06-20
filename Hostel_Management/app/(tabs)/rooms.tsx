import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RoomsProps {}

const Rooms: React.FC<RoomsProps> = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rooms</Text>
            <Text style={styles.subtitle}>This is the Rooms tab in the hostel management app.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
});

export default Rooms;