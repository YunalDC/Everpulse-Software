import { FontAwesome5 } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TopNavIcons from '../components/NavbarConfiguration';

const screenWidth = Dimensions.get('window').width;
const buttonWidth = screenWidth / 2.3;  // approx. two buttons per row

export default function CalculationMenu({ navigation }) {
  return (
    <View style={styles.container}>
      <TopNavIcons navigation={navigation} />

      <Text style={styles.title}>Calculation Menu</Text>

      <View style={styles.gridContainer}>
        <CalcButton title="Pressure" icon="thermometer-half" onPress={() => navigation.navigate('PressureCalculator')} />
        <CalcButton title="Water In Calculator" icon="tint" onPress={() => navigation.navigate('WaterInCalculator')} />
        <CalcButton title="Tubing" icon="project-diagram" onPress={() => navigation.navigate('TubingCalculation')} />
        <CalcButton title="Receiver" icon="cogs" onPress={() => navigation.navigate('ReceiverCalculator')} />
        <CalcButton title="Sound Pressure Level" icon="tachometer-alt" onPress={() => navigation.navigate('SoundPressureCalculator')} />
        <CalcButton title="Exhaust Air Aperture" icon="water" onPress={() => navigation.navigate('ExhaustCalculator')} />
        <CalcButton title="Nominal Pipe Width" icon="bolt" onPress={() => navigation.navigate('NominalPipeCalculator')} />
        <CalcButton title="Quantity Of Leakage" icon="oil-can" onPress={() => navigation.navigate('LeakageCalculator')} />
      </View>

      <View style={styles.unitButtonContainer}>
        <TouchableOpacity style={styles.unitButton} onPress={() => navigation.navigate('UnitConvertor')}>
          <FontAwesome5 name="cube" size={34} color="white" />
          <Text style={styles.unitButtonText}>Unit Conversion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CalcButton({ title, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <FontAwesome5 name={icon} size={32} color="white" />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6EEF2',
    paddingTop: 80,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F3D23',
    textAlign: 'center',
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    width: buttonWidth,
    height: 120,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  unitButtonContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  unitButton: {
    backgroundColor: '#4CAF50',
    width: screenWidth * 0.6,
    height: 120,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  unitButtonText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
