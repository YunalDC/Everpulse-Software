import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TopNavIcons({ navigation }) {
  return (
    <View style={styles.topIcons}>
      {/* Back Icon (on the left) */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome5 name="arrow-left" size={18} color="#1a1a1a" />
      </TouchableOpacity>

      {/* Sidebar Icon (on the right) */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.openDrawer()}
      >
        <FontAwesome5 name="bars" size={18} color="#1a1a1a" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topIcons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  iconContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
