import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { LogBox, StatusBar, View } from 'react-native';
import { auth } from './firebaseConfig';

// Screens
import SidebarMenu from './components/SidebarMenu';
import HomeScreen from './screens/HomeScreen';
import NewsScreen from './screens/NewsScreen';
import ProfileScreen from './screens/ProfileScreen';
import PromotionsScreen from './screens/PromotionsScreen';
import BrandSearchScreen from './screens/SearchScreen';
import ServicesScreen from './screens/ServicesScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import CalculationStack from './screens/calculations/CalculationStack'; // ✅ New stack import

LogBox.ignoreLogs(['Constants.platform']);
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AppDrawer({ userInfo, signOut }) {
  const HomeWrapper = (props) => <HomeScreen {...props} userInfo={userInfo} />;
  const ProfileWrapper = (props) => (
    <ProfileScreen {...props} userInfo={userInfo} signOut={signOut} />
  );

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <SidebarMenu {...props} userInfo={userInfo} signOut={signOut} />
      )}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerStyle: { width: 250 },
        drawerType: 'slide',
      }}
    >
      <Drawer.Screen name="Home" component={HomeWrapper} />
      <Drawer.Screen name="ProfileScreen" component={ProfileWrapper} />
      <Drawer.Screen name="Calculations" component={CalculationStack} />
      <Drawer.Screen name="SearchScreen" component={BrandSearchScreen} />
      <Drawer.Screen name="NewsScreen" component={NewsScreen} />
      <Drawer.Screen name="ServicesScreen" component={ServicesScreen} />
      <Drawer.Screen name="PromotionsScreen" component={PromotionsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const [fontsLoaded] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserInfo(user || null);
      setIsAuthLoading(false);
      setAuthError(null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAppIsReady(true);
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      setAuthError(error.message);
    });
  };

  if (!appIsReady || !fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar backgroundColor="#F8FAFC" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userInfo ? (
            <Stack.Screen name="AppDrawer">
              {() => <AppDrawer userInfo={userInfo} signOut={handleSignOut} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="SignIn">
                {(props) => (
                  <SignInScreen
                    {...props}
                    setAuthError={setAuthError}
                    setIsAuthLoading={setIsAuthLoading}
                    isAuthLoading={isAuthLoading}
                    authError={authError}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="SignUp">
                {(props) => (
                  <SignUpScreen
                    {...props}
                    setAuthError={setAuthError}
                    setIsAuthLoading={setIsAuthLoading}
                    isAuthLoading={isAuthLoading}
                    authError={authError}
                  />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
