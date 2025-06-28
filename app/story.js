import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

export default function StoryScreen() {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('5');
  const [language, setLanguage] = useState('english');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRealStory = async () => {
    if (!topic.trim()) {
      Alert.alert('Please enter a topic');
      return;
    }

    try {
      setLoading(true);
      setStory('');

      const response = await fetch('http://192.168.0.107:5000/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, grade, language }),
      });

      const data = await response.json();

      if (response.ok) {
        setStory(data.story);
        saveToStorage(data.story);
      } else {
        throw new Error(data.error || 'Failed to generate story');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveToStorage = async (storyText) => {
    const key = `story:${topic}:${language}:grade${grade}`;
    try {
      await AsyncStorage.setItem(key, storyText);
      console.log('Story saved locally:', key);
    } catch (err) {
      console.error('Error saving story:', err);
    }
  };

  const parseMarkdown = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={styles.bold}>
          {part.replace(/\*\*/g, '')}
        </Text>
      );
    }
    return <Text key={i}>{part}</Text>;
  });
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📖 Generate Story</Text>

      <TextInput
        placeholder="Enter topic (e.g., soil types)"
        value={topic}
        onChangeText={setTopic}
        style={styles.input}
      />

      <Text style={styles.label}>Select Grade</Text>
      <Picker selectedValue={grade} onValueChange={setGrade} style={styles.picker}>
        {['1', '2', '3', '4', '5'].map((g) => (
          <Picker.Item key={g} label={`Grade ${g}`} value={g} />
        ))}
      </Picker>

      <Text style={styles.label}>Select Language</Text>
      <Picker selectedValue={language} onValueChange={setLanguage} style={styles.picker}>
        <Picker.Item label="English" value="english" />
        <Picker.Item label="Marathi" value="marathi" />
        <Picker.Item label="Tamil" value="tamil" />
        <Picker.Item label="Hindi" value="hindi" />
      </Picker>

      <Button title="Generate Story" onPress={generateRealStory} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {story ? (
  <View style={styles.output}>
    <Text style={styles.storyTitle}>📘 Story Preview</Text>

    {story
      .split('\n')
      .filter(line => line.trim() !== '')
      .map((line, index) => (
        <Text key={index} style={styles.storyParagraph}>
          {parseMarkdown(line)}
        </Text>
      ))}
  </View>
) : null}



      <View style={{ marginTop: 20 }}>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  bold: {
  fontWeight: 'bold',
  color: '#000',
},

  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
output: {
  marginTop: 20,
  backgroundColor: '#fff',
  padding: 15,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
},

  storyText: {
    fontSize: 16,
  },
  storyParagraph: {
  fontSize: 16,
  lineHeight: 24,
  color: '#333',
  marginBottom: 10,
},

storyTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#2a2a2a',
  marginBottom: 12,
  borderBottomWidth: 1,
  borderColor: '#ddd',
  paddingBottom: 4,
},

});
