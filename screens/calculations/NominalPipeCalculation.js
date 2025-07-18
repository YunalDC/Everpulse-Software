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

export default function PipeDiameterCalculatorScreen({ navigation }) {
  const [v, setV] = useState('');
  const [l, setL] = useState('');
  const [dp, setDp] = useState('');
  const [pmax, setPmax] = useState('');
  const [result, setResult] = useState(null);

  const calculateDiameter = () => {
    const V = parseFloat(v);
    const L = parseFloat(l);
    const Dp = parseFloat(dp);
    const Pmax = parseFloat(pmax);

    if ([V, L, Dp, Pmax].some(val => isNaN(val) || val <= 0)) {
      Alert.alert('Invalid Input', 'Please enter all values as positive numbers.');
      return;
    }

    const numerator = 1.6 * Math.pow(V, 1.85) * L;
    const denominator = 107 * Dp * Pmax;
    const di = 5 * Math.sqrt(numerator / denominator);

    setResult(di.toFixed(2));
  };

  const resetForm = () => {
    setV('');
    setL('');
    setDp('');
    setPmax('');
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
          Nominal Pipe Diameter Calculator
        </Text>

        <View style={styles.basisCard}>
          <Text style={styles.basisTitle}>Basis of Calculation</Text>
          <Text style={styles.basisText}>
            dᵢ = 5 × √((1.6 × V^1.85 × L) / (107 × Δp × Pₘₐₓ))
          </Text>
          <Text style={styles.basisText}>
            - V: Flow Rate [m³/min]{"\n"}
            - L: Pipe Length [m]{"\n"}
            - Δp: Pressure Drop [bar]{"\n"}
            - Pₘₐₓ: Compressor Pressure [bar(g)]
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Volumetric Flow Rate V [m³/min]"
          keyboardType="numeric"
          value={v}
          onChangeText={setV}
        />
        <TextInput
          style={styles.input}
          placeholder="Pipe Length L [m]"
          keyboardType="numeric"
          value={l}
          onChangeText={setL}
        />
        <TextInput
          style={styles.input}
          placeholder="Pressure Drop Δp [bar]"
          keyboardType="numeric"
          value={dp}
          onChangeText={setDp}
        />
        <TextInput
          style={styles.input}
          placeholder="Switch-off Pressure Pₘₐₓ [bar]"
          keyboardType="numeric"
          value={pmax}
          onChangeText={setPmax}
        />

        <TouchableOpacity style={styles.button} onPress={calculateDiameter}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>

        {result !== null && (
          <View style={styles.results}>
            <Text style={styles.resultText}>Nominal Diameter: {result} mm</Text>
          </View>
        )}

        <TouchableOpacity style={styles.resetBtn} onPress={resetForm}>
          <Icon name="times-circle" size={20} color="#0077c8" />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>

        <View style={styles.note}>
          <Text style={styles.noteText}>
            Did you know? Pipe size is affected by flow rate, pressure, pipe length and allowable pressure drop.
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
