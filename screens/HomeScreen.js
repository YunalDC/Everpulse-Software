import { FontAwesome5 } from '@expo/vector-icons';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen({ userInfo, navigation }) {
  const buttonScale = new Animated.Value(1);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.8,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

      {/* Top Icons */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('NotificationScreen')}
        >
          <FontAwesome5 name="bell" size={22} color="#1A3819" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.toggleDrawer()}
        >
          <FontAwesome5 name="bars" size={24} color="#1A3819" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Image source={require('../assets/images/everpulse.png')} style={styles.logo} />

        {/* Row 1 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Calculations', {screen: 'CalculationMenu',})}
            onPressIn={animateButton}
          >
            <FontAwesome5 name="clipboard-list" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Calculation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SearchScreen')}
            onPressIn={animateButton}
          >
            <FontAwesome5 name="file-invoice-dollar" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('PromotionsScreen')}
            onPressIn={animateButton}
          >
            <FontAwesome5 name="gift" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Promotions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('NewsScreen')}
            onPressIn={animateButton}
          >
            <FontAwesome5 name="newspaper" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>News</Text>
          </TouchableOpacity>
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ServicesScreen')}
            onPressIn={animateButton}
          >
            <FontAwesome5 name="cogs" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Services</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPressIn={animateButton}
          >
            <FontAwesome5 name="user-friends" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>About Us</Text>
          </TouchableOpacity>
        </View>

        {/* Row 4 - Contact Us */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ContactUsScreen')}
            onPressIn={animateButton}
          >
            <FontAwesome5 name="phone-alt" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: StatusBar.currentHeight || 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  iconButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.3,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    width: 130,
    height: 130,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 6,
    textAlign: 'center',
  },
});
