
import { Stack } from 'expo-router';


import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  

  return (
   
    <Stack>
        <Stack.Screen name='index'/>
    </Stack>
  );
}
