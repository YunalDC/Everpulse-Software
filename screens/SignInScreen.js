import { MaterialIcons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth } from '../firebaseConfig';

export default function SignInScreen({ 
  navigation, 
  setAuthError, 
  setIsAuthLoading,
  isAuthLoading,
  authError
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setAuthError('Please fill all fields');
      return;
    }
    
    setIsAuthLoading(true);
    setAuthError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      let errorMessage = 'Sign-in failed';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Account disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        default:
          errorMessage = error.message || 'Authentication error';
      }
      
      setAuthError(errorMessage);
      setIsAuthLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior="padding" 
      style={styles.container}
    >
      <Image 
        source={require('../assets/images/everpulse.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Sign In to Everpulse</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCorrect={false}
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialIcons 
            name={showPassword ? 'visibility-off' : 'visibility'} 
            size={24} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>
      
      {authError && <Text style={styles.errorText}>{authError}</Text>}
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSignIn}
        disabled={isAuthLoading}
      >
        {isAuthLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 30,
    color: '#333'
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    position: 'relative'
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 13
  },
  button: {
    width: '100%',
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 15,
    textAlign: 'center'
  },
  footer: {
    flexDirection: 'row',
    marginTop: 30
  },
  footerText: {
    color: '#666',
    marginRight: 5
  },
  footerLink: {
    color: '#4285F4',
    fontWeight: 'bold'
  }
});