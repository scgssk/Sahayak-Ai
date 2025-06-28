import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

export default function WorksheetScreen() {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [worksheets, setWorksheets] = useState({});

  const parseMarkdown = (text) => {
    const lines = text.split('\n');

    return lines.map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <Text key={i} style={{ marginBottom: 8 }}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <Text key={j} style={{ fontWeight: 'bold' }}>
                {part.replace(/\*\*/g, '')}
              </Text>
            ) : (
              <Text key={j}>{part}</Text>
            )
          )}
        </Text>
      );
    });
  };


  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Camera roll access is needed!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleGenerate = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    try {
      setLoading(true);
      setWorksheets({});

      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'textbook.jpg',
        type: 'image/jpeg',
      });
      formData.append('prompt', prompt);

      const response = await fetch('http://192.168.0.107:5000/api/generate-worksheet', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setWorksheets(data);
      } else {
        throw new Error(data.error || 'Failed to generate worksheet');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📸 Generate Multi-Grade Worksheets</Text>

      <View style={styles.card}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>No image selected</Text>
        )}
        <Button title="Upload Textbook Page" onPress={pickImage} />
      </View>

      <View style={styles.card}>
        <TextInput
          placeholder="Optional: Add a prompt (e.g., explain the soil types)"
          value={prompt}
          onChangeText={setPrompt}
          style={styles.input}
          multiline
        />
        <Button title="Generate Worksheet" onPress={handleGenerate} />
      </View>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {Object.entries(worksheets).map(([grade, content], i) => (
        <View key={i} style={{ marginBottom: 20 }}>
          <Text style={styles.gradeHeader}>Grade {grade}</Text>
          <View style={styles.worksheetText}>
            {parseMarkdown(content)}
          </View>
        </View>
      ))}


      <View style={{ marginTop: 20 }}>
        <Button title="⬅ Go Back" onPress={() => router.back()} />
      </View>
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
  image: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
  },
  placeholder: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#999',
    marginBottom: 10,
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
  gradeHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1d3557',
  },
  worksheetText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    paddingLeft: 5,
  },

});
