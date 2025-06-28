// app/visual.js
import { View, Text, StyleSheet, Button } from 'react-native';
import { router } from 'expo-router';

export default function VisualScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🖼 Visual Aids Generator</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
