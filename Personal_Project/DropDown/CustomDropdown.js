import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';

const CustomDropdown = ({ options, defaultValue, onSelect, style }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleSelect = (value) => {
        setIsVisible(false);
        onSelect(value);
    };

    return (
        <View style={style}>
            <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.dropdownButton}>
                <Text style={styles.dropdownText}>{defaultValue}</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    setIsVisible(false);
                }}>
                <TouchableOpacity style={styles.centeredView} onPress={() => setIsVisible(false)}>
                    <View style={styles.modalView}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelect(item)} style={styles.listItem}>
                                    <Text style={styles.modalText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        width: '80%',
        height: '50%',
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
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
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    dropdownButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    dropdownText: {
        textAlign: 'center',
    },
    listItem: {
        width: 200,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }

});

export default CustomDropdown;
