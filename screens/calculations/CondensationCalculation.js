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

export default function WaterInCalculatorScreen({ navigation }) {
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [flowRate, setFlowRate] = useState('');
  const [fmaxTU, setFmaxTU] = useState('');
  const [result, setResult] = useState(null);

  const calculateWaterIn = () => {
    const T = parseFloat(temperature); // unused but shown in UI
    const φ = parseFloat(humidity);
    const V1 = parseFloat(flowRate);
    const fmax = parseFloat(fmaxTU);

    if (isNaN(T) || isNaN(φ) || isNaN(V1) || isNaN(fmax)) {
      Alert.alert('Error', 'Please enter valid numeric values for all fields.');
      return;
    }

    const waterIn = (fmax * φ * V1 * 60) / 1000;
    setResult(waterIn.toFixed(2));
  };

  const resetForm = () => {
    setTemperature('');
    setHumidity('');
    setFlowRate('');
    setFmaxTU('');
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TopNavIcons navigation={navigation} />

        <View style={styles.logoBanner}>
          <Image source={require('../../assets/images/everpulse.png')} style={styles.logo} />
        </View>

        <Text style={styles.title}>Compressor Water Inlet</Text>

        {/* Basis of Calculation */}
        <View style={styles.basisCard}>
          <Text style={styles.basisTitle}>Basis of Calculation</Text>
          <Text style={styles.basisText}>
            The water inlet to the compressor is estimated by:
          </Text>
          <Text style={[styles.basisText, { marginVertical: 6, fontStyle: 'italic' }]}>
            m₍water in₎ = (fₘₐₓTU × φ₁ × V₁ × 60) / 1000
          </Text>
          <Text style={styles.basisText}>
            Where:
            {'\n'}- φ₁ is relative humidity in %
            {'\n'}- fₘₐₓTU is saturation vapor content [g/m³]
            {'\n'}- V₁ is intake volume [m³/min]
            {'\n'}- Output is water content in [litres/hour]
          </Text>
        </View>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Air Temp. at Intake [°C]"
          keyboardType="numeric"
          value={temperature}
          onChangeText={setTemperature}
        />
        <TextInput
          style={styles.input}
          placeholder="Relative Humidity φ₁ [%]"
          keyboardType="numeric"
          value={humidity}
          onChangeText={setHumidity}
        />
        <TextInput
          style={styles.input}
          placeholder="Compressor Volume V₁ [m³/min]"
          keyboardType="numeric"
          value={flowRate}
          onChangeText={setFlowRate}
        />
        <TextInput
          style={styles.input}
          placeholder="fmaxTU [g/m³]"
          keyboardType="numeric"
          value={fmaxTU}
          onChangeText={setFmaxTU}
        />

        {/* Calculate Button */}
        <TouchableOpacity style={styles.button} onPress={calculateWaterIn}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>

        {/* Result */}
        {result !== null && (
          <View style={styles.results}>
            <Text style={styles.resultText}>Water Inlet: {result} l/h</Text>
          </View>
        )}

        {/* Reset */}
        <TouchableOpacity style={styles.resetBtn} onPress={resetForm}>
          <Icon name="times-circle" size={20} color="#0077c8" />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// === STYLES (copied from AirPressureDropCalculator) ===
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
