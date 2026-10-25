import { Image } from 'expo-image';
import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text>Without a transition</Text>
      <Image
        testID="plain-image"
        source={require('../assets/icon.png')}
        alt="Plain image"
        style={{ width: 120, height: 120 }}
      />
      <Text>With a 500 ms transition</Text>
      <Image
        testID="transition-image"
        source={require('../assets/icon.png')}
        alt="Image with a transition"
        transition={500}
        style={{ width: 120, height: 120 }}
      />
    </View>
  );
}
