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
import TopNavIcons from '../../components/NavbarConfiguration'; // top back + home

// === LOGIC FUNCTIONS ===
function calculateFlowRate({ diameter, length, pressureIn, pressureOut }) {
  const d2 = Math.pow(diameter, 2);
  const pDiff = (Math.pow(pressureIn, 2) - Math.pow(pressureOut, 2)) / length;
  if (pDiff <= 0) return 0;
  const flow = 190 * d2 * Math.sqrt(pDiff);
  return Math.round(flow);
}

function calculatePressureDrop({ diameter, length, flowRate, K = 1.5 }) {
  const d5 = Math.pow(diameter, 5);
  if (d5 === 0) return 0;
  const pressureDrop = K * (length / d5) * Math.pow(flowRate, 2);
  return pressureDrop.toFixed(2);
}

function recommendTubeSize(flowRate) {
  if (flowRate <= 100) return 4;
  if (flowRate <= 300) return 6;
  if (flowRate <= 800) return 8;
  if (flowRate <= 1400) return 10;
  return 12;
}

// === COMPONENT ===
export default function TubingCalculation({ navigation }) {
  const [diameter, setDiameter] = useState('');
  const [length, setLength] = useState('');
  const [pressureIn, setPressureIn] = useState('');
  const [pressureOut, setPressureOut] = useState('');
  const [flowResult, setFlowResult] = useState(null);
  const [dropResult, setDropResult] = useState(null);
  const [recommendedSize, setRecommendedSize] = useState(null);

  const handleCalculate = () => {
    const d = parseFloat(diameter);
    const l = parseFloat(length);
    const p1 = parseFloat(pressureIn);
    const p2 = parseFloat(pressureOut);

    if (isNaN(d) || isNaN(l) || isNaN(p1) || isNaN(p2)) {
      Alert.alert('Error', 'Please enter all values correctly.');
      return;
    }

    const flow = calculateFlowRate({ diameter: d, length: l, pressureIn: p1, pressureOut: p2 });
    const drop = calculatePressureDrop({ diameter: d, length: l, flowRate: flow });
    const recommended = recommendTubeSize(flow);

    setFlowResult(flow);
    setDropResult(drop);
    setRecommendedSize(recommended);
  };

  const handleReset = () => {
    setDiameter('');
    setLength('');
    setPressureIn('');
    setPressureOut('');
    setFlowResult(null);
    setDropResult(null);
    setRecommendedSize(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TopNavIcons navigation={navigation} />

        <View style={styles.logoBanner}>
          <Image source={require('../../assets/images/everpulse.png')} style={styles.logo} />
        </View>

        <Text style={styles.title}>Calculation of the Pressure Drop in the System</Text>

        {/* ➤ Basis of Calculation */}
        <View style={styles.basisCard}>
          <Text style={styles.basisTitle}>Basis of Calculation</Text>
          <Text style={styles.basisText}>
            The flow rate is calculated using the pressure differential across the tubing and the internal diameter.
            A fixed empirical factor is used for flow estimation. Pressure drop is estimated assuming laminar flow with
            default resistance constant K = 1.5.
          </Text>
        </View>

        {/* ➤ Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Internal Diameter (mm)"
          keyboardType="numeric"
          value={diameter}
          onChangeText={setDiameter}
        />
        <TextInput
          style={styles.input}
          placeholder="Length (m)"
          keyboardType="numeric"
          value={length}
          onChangeText={setLength}
        />
        <TextInput
          style={styles.input}
          placeholder="Inlet Pressure (bar)"
          keyboardType="numeric"
          value={pressureIn}
          onChangeText={setPressureIn}
        />
        <TextInput
          style={styles.input}
          placeholder="Outlet Pressure (bar)"
          keyboardType="numeric"
          value={pressureOut}
          onChangeText={setPressureOut}
        />

        {/* ➤ Calculate Button */}
        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>

        {/* ➤ Result Section */}
        {flowResult !== null && (
          <View style={styles.results}>
            <Text style={styles.resultText}>Estimated Flow Rate: {flowResult} L/min</Text>
            <Text style={styles.resultText}>Estimated Pressure Drop: {dropResult} units</Text>
            <Text style={styles.resultText}>Recommended Tube ID: {recommendedSize} mm</Text>
          </View>
        )}

        {/* ➤ Reset Button */}
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
  safe: {
    flex: 1,
    backgroundColor: '#f4f7fa',
  },
  container: {
    padding: 20,
    paddingTop: 80,
  },
  logoBanner: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 180,
    height: 100,
    resizeMode: 'contain',
  },
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
