// app/index.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sahayak – AI Teaching Assistant</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/story')}>
        <Text style={styles.buttonText}>📖 Generate Story</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/worksheet')}>
        <Text style={styles.buttonText}>📝 Worksheet Creator</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/knowledge')}>
        <Text style={styles.buttonText}>🤖 Knowledge Assistant</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/visual')}>
        <Text style={styles.buttonText}>🖼 Visual Aids</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/planner')}>
        <Text style={styles.buttonText}>📅 Lesson Planner</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/offline')}>
        <Text style={styles.buttonText}>📁 Offline Content</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3e64ff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
