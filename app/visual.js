import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Button, TextInput,
  ScrollView, ActivityIndicator, Alert
} from 'react-native';
import * as Speech from 'expo-speech';
import { router } from 'expo-router';

export const options = {
  title: '🧩 Visual Aid Generator',
  headerStyle: {
    backgroundColor: '#0e3d6e',
  },
  headerTintColor: '#fff',
  headerTitleAlign: 'center',
};


export default function VisualScreen() {
  const [prompt, setPrompt] = useState('');
  const [diagramText, setDiagramText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const speak = () => {
    if (explanation.trim()) {
      Speech.speak(explanation, { language: 'en', rate: 1.0 });
    }
  };

  const cleanText = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\s*/g, '')
      .replace(/#+\s*/g, '')
      .replace(/\n{2,}/g, '\n')
      .trim();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Please enter a visual prompt');
      return;
    }

    try {
      setLoading(true);
      setExplanation('');
      setDiagramText('');

      const response = await fetch('http://192.168.0.107:5000/api/visual-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to generate visual aid');

      setDiagramText(data.diagramText || '');
      setExplanation(data.explanation || '');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎨 Visual Aid Generator</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="e.g., Show me water cycle with 4 steps"
          value={prompt}
          onChangeText={setPrompt}
          style={styles.input}
          multiline
        />
        <Button title="Generate Visual Aid" onPress={handleGenerate} />
      </View>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {diagramText !== '' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📐 Text Diagram</Text>
          <Text style={styles.diagramText}>{cleanText(diagramText)}</Text>
        </View>
      )}

      {explanation !== '' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🧠 Sketch Guide</Text>
          <Button title="🔊 Speak" onPress={speak} />
          <Button title="⏹ Stop" onPress={() => Speech.stop()} />
          <Text style={styles.answerText}>{cleanText(explanation)}</Text>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  diagramText: {
    fontFamily: 'monospace',
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fdfdfd',
    padding: 14,
    borderRadius: 8,
    minHeight: 80,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginTop: 10,
  },
});
