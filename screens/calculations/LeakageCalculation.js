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

export default function LeakageCalculatorScreen({ navigation }) {
  const [vb, setVb] = useState('');
  const [pa, setPa] = useState('');
  const [pe, setPe] = useState('');
  const [t, setT] = useState('');
  const [result, setResult] = useState(null);

  const calculateLeakage = () => {
    const VB = parseFloat(vb);
    const PA = parseFloat(pa);
    const PE = parseFloat(pe);
    const T = parseFloat(t);

    if ([VB, PA, PE, T].some(val => isNaN(val) || val <= 0)) {
      Alert.alert('Invalid Input', 'Please enter all values as positive numbers.');
      return;
    }

    const leakage = (VB * (PA - PE)) / T / 60; // convert to m³/min
    setResult(leakage.toFixed(2));
  };

  const resetForm = () => {
    setVb('');
    setPa('');
    setPe('');
    setT('');
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
          Leakage Quantity by Receiver Drop
        </Text>

        <View style={styles.basisCard}>
          <Text style={styles.basisTitle}>Basis of Calculation</Text>
          <Text style={styles.basisText}>
            V = (Vᴮ × (Pᴬ - Pᴱ)) / t
          </Text>
          <Text style={styles.basisText}>
            - Vᴮ: Receiver Volume [L]{"\n"}
            - Pᴬ: Initial Pressure [bar(g)]{"\n"}
            - Pᴱ: Final Pressure [bar(g)]{"\n"}
            - t: Measuring Time [s]
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Receiver Volume Vᴮ [L]"
          keyboardType="numeric"
          value={vb}
          onChangeText={setVb}
        />
        <TextInput
          style={styles.input}
          placeholder="Initial Pressure Pᴬ [bar(g)]"
          keyboardType="numeric"
          value={pa}
          onChangeText={setPa}
        />
        <TextInput
          style={styles.input}
          placeholder="Final Pressure Pᴱ [bar(g)]"
          keyboardType="numeric"
          value={pe}
          onChangeText={setPe}
        />
        <TextInput
          style={styles.input}
          placeholder="Measuring Time t [s]"
          keyboardType="numeric"
          value={t}
          onChangeText={setT}
        />

        <TouchableOpacity style={styles.button} onPress={calculateLeakage}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>

        {result !== null && (
          <View style={styles.results}>
            <Text style={styles.resultText}>
              Quantity of Leakage: {result} m³/min
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.resetBtn} onPress={resetForm}>
          <Icon name="times-circle" size={20} color="#0077c8" />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>

        <View style={styles.note}>
          <Text style={styles.noteText}>
            Did you know? The average leakage rate in compressed air stations is up to 30%.
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
