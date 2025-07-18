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
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TopNavIcons from '../../components/NavbarConfiguration';

export default function ExhaustCrossSectionCalculatorScreen({ navigation }) {
  const [vv, setVv] = useState('');
  const [vs, setVs] = useState('');
  const [result, setResult] = useState(null);

  const calculateCrossSection = () => {
    const Vv = parseFloat(vv);
    const Vs = parseFloat(vs);

    if (isNaN(Vv) || isNaN(Vs) || Vv <= 0 || Vs <= 0) {
      Alert.alert('Error', 'Please enter valid positive numbers for both fields.');
      return;
    }

    const Azu = Vv / (3600 * Vs);
    setResult(Azu.toFixed(4));
  };

  const resetForm = () => {
    setVv('');
    setVs('');
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TopNavIcons navigation={navigation} />

        <View style={styles.logoBanner}>
          <Image source={require('../../assets/images/everpulse.png')} style={styles.logo} />
        </View>

        <Text style={styles.title}>
          Exhaust Air Aperture Cross-Section Calculator
        </Text>

        <View style={styles.basisCard}>
          <Text style={styles.basisTitle}>Basis of Calculation</Text>
          <Text style={styles.basisText}>Azu = Vv / (3600 × Vs)</Text>
          <Text style={styles.basisText}>
            - Vv: Ventilator Output [m³/h]{"\n"}
            - Vs: Flow Velocity [m/s]{"\n"}
            - Result Azu: Aperture Area [m²]
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Ventilator Output Vv [m³/h]"
          keyboardType="numeric"
          value={vv}
          onChangeText={setVv}
        />
        <TextInput
          style={styles.input}
          placeholder="Flow Velocity Vs [m/s]"
          keyboardType="numeric"
          value={vs}
          onChangeText={setVs}
        />

        <TouchableOpacity style={styles.button} onPress={calculateCrossSection}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>

        {result !== null && (
          <View style={styles.results}>
            <Text style={styles.resultText}>Minimum Aperture: {result} m²</Text>
          </View>
        )}

        <TouchableOpacity style={styles.resetBtn} onPress={resetForm}>
          <Icon name="times-circle" size={20} color="#0077c8" />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>

        <View style={styles.note}>
          <Text style={styles.noteText}>
            * Flow velocity should be between 3 to 5 m/s for best results.{"\n"}
            * At higher velocities, a supplementary fan is often required.{"\n"}
            * If too little heat is removed, room temperature may rise dangerously.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  note: {
    marginTop: 20,
    backgroundColor: '#ffe0b2',
    borderRadius: 6,
    padding: 12,
  },
  noteText: {
    fontSize: 13,
    color: '#333',
    fontStyle: 'italic',
  },
});
