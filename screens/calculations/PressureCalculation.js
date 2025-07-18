import { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TopNavIcons from '../../components/NavbarConfiguration';

export default function AirPressureDropCalculator({ navigation }) {
  const [flowRate, setFlowRate] = useState('');
  const [length, setLength] = useState('');
  const [diameter, setDiameter] = useState('');
  const [endPressure, setEndPressure] = useState('');
  const [pressureDrop, setPressureDrop] = useState(null);

  const calculatePressureDrop = () => {
    const V = parseFloat(flowRate);       // m³/min
    const L = parseFloat(length);         // m
    const d = parseFloat(diameter);       // mm
    const pe = parseFloat(endPressure);   // bar

    if (isNaN(V) || isNaN(L) || isNaN(d) || isNaN(pe) || d === 0 || pe === 0) {
      Alert.alert('Error', 'Please enter valid values for all fields.');
      return;
    }

    const numerator = 1.6 * Math.pow(V / 60, 1.85) * L * 1e8;
    const denominator = Math.pow(d, 5) * pe;
    const dp = numerator / denominator;

    setPressureDrop(dp.toFixed(3));
  };

  const handleReset = () => {
    setFlowRate('');
    setLength('');
    setDiameter('');
    setEndPressure('');
    setPressureDrop(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TopNavIcons navigation={navigation} />

        <View style={styles.logoBanner}>
          <Image source={require('../../assets/images/everpulse.png')} style={styles.logo} />
        </View>

        <Text style={styles.title}>Calculation of the Pressure Drop in the System</Text>

        {/* BASIS OF CALCULATION */}
        <View style={styles.basisCard}>
          <Text style={styles.basisTitle}>Basis of Calculation</Text>
          <Text style={styles.basisText}>
            The pressure drop Δp in a compressed air system is calculated using the empirical formula:
          </Text>
          <Text style={[styles.basisText, { marginVertical: 6, fontStyle: 'italic' }]}>
            Δp = [1.6 × (V / 60)<Text style={{ fontSize: 10 }}>1.85</Text> × L × 10⁸] / [d⁵ × pₑ]
          </Text>
          <Text style={styles.basisText}>
            Where:
            {'\n'}- V: Flow rate in m³/min
            {'\n'}- L: Pipe length in meters
            {'\n'}- d: Internal pipe diameter in mm
            {'\n'}- pₑ: End pressure in bar
          </Text>
          <Text style={[styles.basisText, { marginTop: 6 }]}>
            This formula helps estimate pressure drop to size pipes correctly and reduce energy loss in compressed air systems.
          </Text>
        </View>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Total Flow Rate V (m³/min)"
          keyboardType="numeric"
          value={flowRate}
          onChangeText={setFlowRate}
        />
        <TextInput
          style={styles.input}
          placeholder="Pipe Length L (m)"
          keyboardType="numeric"
          value={length}
          onChangeText={setLength}
        />
        <TextInput
          style={styles.input}
          placeholder="Internal Diameter d (mm)"
          keyboardType="numeric"
          value={diameter}
          onChangeText={setDiameter}
        />
        <TextInput
          style={styles.input}
          placeholder="Compressor End Pressure pₑ (bar)"
          keyboardType="numeric"
          value={endPressure}
          onChangeText={setEndPressure}
        />

        {/* Calculate Button */}
        <TouchableOpacity style={styles.button} onPress={calculatePressureDrop}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>

        {/* Result */}
        {pressureDrop !== null && (
          <View style={styles.results}>
            <Text style={styles.resultText}>Estimated Pressure Drop: {pressureDrop} bar</Text>
          </View>
        )}

        {/* Reset */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Icon name="times-circle" size={20} color="#0077c8" />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f7fa' },
  container: { padding: 20, paddingTop: 80 },
  logoBanner: { alignItems: 'center', marginBottom: 10 },
  logo: { width: 180, height: 100, resizeMode: 'contain' },
  title: {
    backgroundColor: '#0077c8',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
    marginBottom: 20,
    borderRadius: 6,
  },
  basisCard: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  basisTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0d47a1',
    marginBottom: 6,
  },
  basisText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0077c8',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  results: {
    backgroundColor: '#f3a721',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  resultText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  resetBtn: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0077c8',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  resetText: {
    color: '#0077c8',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
});
