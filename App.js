import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import EditorScreen from './screens/EditorScreen';
import { AuthProvider, useAuth } from './AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {
          user
            ? (
              <>
                <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
                <Stack.Screen options={{ headerShown: false }} name="Editor" component={EditorScreen} />
              </>
            )
            : (
              <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
            )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}