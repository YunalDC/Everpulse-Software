import { StyleSheet, Text, View } from 'react-native';

export default function ServicesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Services</Text>
      <Text style={styles.serviceItem}>• Industrial Automation Solutions</Text>
      <Text style={styles.serviceItem}>• Energy Meter Configuration</Text>
      <Text style={styles.serviceItem}>• PLC & HMI Integration</Text>
      <Text style={styles.serviceItem}>• IoT-Based Monitoring Systems</Text>
      <Text style={styles.serviceItem}>• Web Portals for Real-Time Data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A3819',
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  serviceItem: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
});
