// app/offline.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function OfflineScreen() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    loadSavedStories();
  }, []);

  const loadSavedStories = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const storyKeys = allKeys.filter((key) => key.startsWith('story:'));
      const keyValuePairs = await AsyncStorage.multiGet(storyKeys);

      const parsed = keyValuePairs.map(([key, value]) => ({
        key,
        content: value,
      }));

      setStories(parsed.reverse()); // newest first
    } catch (err) {
      console.error('Error loading stories:', err);
    }
  };

  const handleDelete = (key) => {
    Alert.alert('Delete Story', 'Are you sure you want to delete this story?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(key);
          setStories((prev) => prev.filter((s) => s.key !== key));
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📁 Saved Stories</Text>

      {stories.length === 0 ? (
        <Text style={styles.emptyText}>No stories found. Try generating some!</Text>
      ) : (
        stories.map((story, index) => (
          <View key={story.key} style={styles.card}>
            <Text style={styles.cardTitle}>{story.key.split(':')[1]}</Text>
            <Text style={styles.cardText} numberOfLines={3}>
              {story.content}
            </Text>

            <View style={styles.cardActions}>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert('Full Story', story.content, [{ text: 'OK' }])
                }
              >
                <Text style={styles.link}>Read</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDelete(story.key)}>
                <Text style={[styles.link, { color: 'red' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#3e64ff' }}>← Go Back</Text>
        </TouchableOpacity>
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
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  link: {
    color: '#3e64ff',
    fontWeight: 'bold',
  },
});
