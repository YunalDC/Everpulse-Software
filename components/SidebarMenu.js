import { FontAwesome5 } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SidebarMenu({ navigation, userInfo, signOut }) {
  const menuItems = [
    { label: 'Home', icon: 'home', route: 'Home' },
    { label: 'Profile', icon: 'user', route: 'ProfileScreen' },
    { label: 'Services', icon: 'tools', route: 'ServicesScreen' },
    { label: 'News', icon: 'newspaper', route: 'NewsScreen' },
    { label: 'Calculation', icon: 'calculator', route: 'CalculationMenu' },
    { label: 'Search', icon: 'search', route: 'ValveOption' },
  ];

  return (
    <View style={styles.container}>
      {/* Logo Area with White Background */}
      <View style={styles.logoWrapper}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/everpulse.png')} // ✅ Replace with actual logo
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => navigation.navigate(item.route)}
        >
          <FontAwesome5 name={item.icon} size={18} color="#ffffff" style={styles.icon} />
          <Text style={styles.menuText}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      {/* Separator */}
      <View style={styles.separator} />

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[styles.menuItem, styles.signOutButton]}
        onPress={signOut}
      >
        <FontAwesome5 name="sign-out-alt" size={18} color="#fff" style={styles.icon} />
        <Text style={styles.menuText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingTop: 0,
  },
  logoWrapper: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 50,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 16,
    marginTop: 10,
  },
  icon: {
    width: 24,
    textAlign: 'center',
    marginRight: 14,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#ffffff44',
    marginVertical: 24,
    marginHorizontal: 16,
  },
  signOutButton: {
    backgroundColor: '#D32F2F',
    marginHorizontal: 16,
    marginBottom: 20,
  },
});
