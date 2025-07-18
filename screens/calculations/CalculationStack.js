// File: screens/calculations/CalculationStack.js

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalculationMenu from '../CalculationMenu';
import WaterInCalculatorScreen from './CondensationCalculation';
import ExhaustCrossSectionCalculatorScreen from './ExhaustCalculation';
import LeakageCalculatorScreen from './LeakageCalculation';
import PipeDiameterCalculatorScreen from './NominalPipeCalculation';
import PressureDropCalculator from './PressureCalculation';
import ReceiverSizeCalculatorScreen from './ReceiverCalculation';
import SoundPressureCalculatorScreen from './SoundPressureCalculation';
import TubingCalculation from './TubingCalculation';
import UnitConverterScreen from './UnitConvertion';

const Stack = createNativeStackNavigator();

export default function CalculationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CalculationMenu" component={CalculationMenu} />
      <Stack.Screen name="WaterInCalculator" component={WaterInCalculatorScreen} />
      <Stack.Screen name="ExhaustCalculator" component={ExhaustCrossSectionCalculatorScreen} />
      <Stack.Screen name="LeakageCalculator" component={LeakageCalculatorScreen} />
      <Stack.Screen name="NominalPipeCalculator" component={PipeDiameterCalculatorScreen} />
      <Stack.Screen name="PressureCalculator" component={PressureDropCalculator} />
      <Stack.Screen name="ReceiverCalculator" component={ReceiverSizeCalculatorScreen} />
      <Stack.Screen name="SoundPressureCalculator" component={SoundPressureCalculatorScreen} />
      <Stack.Screen name="TubingCalculation" component={TubingCalculation} />
      <Stack.Screen name="UnitConvertor" component={UnitConverterScreen} />
      <Stack.Screen name="CondensationCalculator" component={WaterInCalculatorScreen} />
    </Stack.Navigator>
  );
}