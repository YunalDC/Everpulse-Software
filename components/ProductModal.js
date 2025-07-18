import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProductModal({ visible, product, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{product?.Name}</Text>
          <Text>Part No: {product?.["Part Number"]}</Text>
          <Text>Size: {product?.Size}</Text>
          <Text>Valve Type: {product?.["Valve Type"]}</Text>
          <Text>Connection: {product?.Connection}</Text>
          <Text>Actuation: {product?.Actuation}</Text>
          {product?.Bore && <Text>Bore: {product.Bore}</Text>}

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2563EB',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
