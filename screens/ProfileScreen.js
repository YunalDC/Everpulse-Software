import { Button, Image, StyleSheet, Text, View } from 'react-native';

const HomeScreen = ({ userInfo, signOut }) => {
  return (
    <View style={styles.container}>
      {userInfo?.photoURL ? (
        <Image 
          source={{ uri: userInfo.photoURL }} 
          style={styles.profileImage} 
        />
      ) : (
        <View style={styles.profilePlaceholder}>
          <Text style={styles.placeholderText}>
            {userInfo?.displayName?.charAt(0) || 'U'}
          </Text>
        </View>
      )}
      
      <Text style={styles.welcomeText}>
        Welcome, {userInfo?.displayName || 'User'}!
      </Text>
      
      <Text style={styles.emailText}>
        {userInfo?.email}
      </Text>
      
      <Button 
        title="Sign Out" 
        onPress={signOut} 
        color="#FF3B30"
        style={styles.signOutButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#6200EE',
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#6200EE',
  },
  placeholderText: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  emailText: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
  },
  signOutButton: {
    marginTop: 20,
    width: 200,
  },
});

export default HomeScreen;