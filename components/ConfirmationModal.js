import React from 'react';
import { View, Text, Modal, Button, StyleSheet } from 'react-native';

const ConfirmationModal = ({ isVisible, onConfirm, onCancel, message }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>{message}</Text>
          <View style={styles.buttonContainer}>
            <Button title="No" onPress={onCancel} />
            <Button title="Yes" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default ConfirmationModal;