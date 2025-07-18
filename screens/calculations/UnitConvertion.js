import { Picker } from '@react-native-picker/picker';
import { useCallback, useRef, useState } from 'react';
import {
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

const pressureUnits = {
  kpa: { toBase: v => v, fromBase: v => v, label: 'kPa' },
  bar: { toBase: v => v * 100, fromBase: v => v / 100, label: 'bar' },
  mbar: { toBase: v => v / 10, fromBase: v => v * 10, label: 'mbar' },
  psi: { toBase: v => v / 0.14504, fromBase: v => v * 0.14504, label: 'Psi' },
  at: { toBase: v => v / 0.0102, fromBase: v => v * 0.0102, label: 'at' },
  atm: { toBase: v => v * 101.325, fromBase: v => v / 101.325, label: 'atm' },
  mmWc: { toBase: v => v / 102, fromBase: v => v * 102, label: 'mm Wc' },
  torr: { toBase: v => v / 7.5, fromBase: v => v * 7.5, label: 'Torr' },
  pa: { toBase: v => v / 1000, fromBase: v => v * 1000, label: 'Pa' },
  mmHg: { toBase: v => v / 7.5, fromBase: v => v * 7.5, label: 'mmHg' },
  inHg: { toBase: v => v / 0.2953, fromBase: v => v * 0.2953, label: 'inHg' },
  kgcm2: { toBase: v => v / 0.0102, fromBase: v => v * 0.0102, label: 'kg/cm²' },
};

export default function UnitConverterScreen({ navigation }) {
  const [category, setCategory] = useState('Pressure');
  const [values, setValues] = useState(Object.fromEntries(Object.keys(pressureUnits).map(k => [k, ''])));
  const [activeField, setActiveField] = useState(null);
  const debounceTimer = useRef(null);

  const debounceConvert = useCallback((unit, val) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => performConversion(unit, val), 300);
  }, []);

  const performConversion = (unit, val) => {
    const num = parseFloat(val);
    if (isNaN(num) || val === '') {
      const cleared = Object.fromEntries(Object.keys(pressureUnits).map(k => [k, k === unit ? val : '']));
      return setValues(cleared);
    }

    const base = pressureUnits[unit].toBase(num);
    const converted = {};
    for (const key in pressureUnits) {
      converted[key] = key === unit
        ? val
        : parseFloat(pressureUnits[key].fromBase(base).toFixed(6)).toString().replace(/\.?0+$/, '');
    }
    setValues(converted);
  };

  const handleChange = (unit, val) => {
    setActiveField(unit);
    setValues(prev => ({ ...prev, [unit]: val }));
    debounceConvert(unit, val);
  };

  const reset = () => {
    setValues(Object.fromEntries(Object.keys(pressureUnits).map(k => [k, ''])));
    setActiveField(null);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  };

  const unitOrder = Object.keys(pressureUnits);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TopNavIcons navigation={navigation} />

        <Text style={styles.title}>Unit Conversion</Text>

        <View style={styles.categoryCard}>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={category}
              onValueChange={val => setCategory(val)}
              style={styles.dropdown}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Pressure" value="Pressure" />
              <Picker.Item label="Volume" value="Volume" />
              <Picker.Item label="Power" value="Power" />
              <Picker.Item label="Temperature" value="Temperature" />
              <Picker.Item label="Flow Rate" value="Flow Rate" />
              <Picker.Item label="Energy" value="Energy" />
            </Picker>
          </View>
        </View>

        <View style={styles.unitsContainer}>
          {unitOrder.map(unit => (
            <View key={unit} style={styles.unitRow}>
              <View style={styles.iconContainer}>
                <Icon name="clipboard" size={20} color="#fff" />
              </View>
              <TextInput
                style={[
                  styles.unitInput,
                  activeField === unit && styles.activeInput
                ]}
                keyboardType="numeric"
                value={values[unit]}
                onChangeText={val => handleChange(unit, val)}
                onFocus={() => setActiveField(unit)}
                onBlur={() => setActiveField(null)}
              />
              <Text style={styles.unitLabel}>{pressureUnits[unit].label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.resetBtn} onPress={reset}>
          <Icon name="times-circle" size={16} color="#0077c8" />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            You can convert pressure values to multiple units at once.{"\n"}
            Input value in kPa to begin.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f7fa' },
  container: { padding: 20, paddingTop: 80 },
  title: {
    backgroundColor: '#0077c8',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 12,
    textAlign: 'center',
    marginBottom: 20,
    borderRadius: 6,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  dropdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  dropdown: {
    width: '100%',
    height: 50,
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
  },
  pickerItem: {
    textAlign: 'center',
    fontSize: 16,
  },
  unitsContainer: {
    marginBottom: 20,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#0077c8',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  unitInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: 8,
  },
  activeInput: {
    borderColor: '#0077c8',
    borderWidth: 2,
  },
  unitLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    minWidth: 60,
    textAlign: 'right',
  },
  resetBtn: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0077c8',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resetText: {
    color: '#0077c8',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  noteBox: {
    marginTop: 15,
    backgroundColor: '#ffecb3',
    borderRadius: 6,
    padding: 12,
    borderColor: '#f39c12',
    borderWidth: 1,
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
