import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';

import * as Speech from 'expo-speech';
import { router } from 'expo-router';

export default function KnowledgeScreen() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const speak = () => {
        if (answer.trim()) {
            const textToSpeak = cleanText(answer);
            Speech.speak(textToSpeak, {
                language: 'en', // or dynamic later
                rate: 1.0,
            });
        }
    };


    const cleanText = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold markdown
            .replace(/_(.*?)_/g, '$1')       // remove italic markdown
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove markdown links [text](url)
            .replace(/`([^`]+)`/g, '$1')     // remove inline code
            .replace(/\*\s*/g, '')           // remove bullet point stars
            .replace(/#+\s*/g, '')           // remove heading hashes
            .replace(/\n{2,}/g, '\n')        // normalize newlines
            .trim();
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

    const askQuestion = async () => {
        if (!question.trim()) {
            Alert.alert('Please enter a question');
            return;
        }


        try {
            setLoading(true);
            setAnswer('');

            const response = await fetch('http://192.168.0.107:5000/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            });

            const data = await response.json();

            if (response.ok) {
                setAnswer(data.answer);
            } else {
                throw new Error(data.error || 'Failed to get answer');
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
            <Text style={styles.title}>💡 Ask a Question</Text>

            <View style={styles.card}>
                <TextInput
                    placeholder="E.g., Why is the sky blue?"
                    value={question}
                    onChangeText={setQuestion}
                    style={styles.input}
                    multiline
                    textAlignVertical="top"
                />
                <View style={styles.buttonRow}>
                    <Button title="Ask" onPress={askQuestion} />
                </View>
            </View>

            {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

            {answer ? (
                <View style={styles.card}>
                    <Text style={styles.answerTitle}>🔍 AI's Answer:</Text>

                    <View style={styles.ttsControls}>
                        <Button title="Listen" onPress={speak} />
                        <View style={{ width: 10 }} />
                        <Button title="⏹ Stop" onPress={() => Speech.stop()} />
                    </View>

                    {answer
                        .split('\n')
                        .filter(line => line.trim() !== '')
                        .map((line, index) => (
                            <Text key={index} style={styles.answerText}>
                                {parseMarkdown(line)}
                            </Text>
                        ))}
                </View>
            ) : null}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e1e1e',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fdfdfd',
    padding: 14,
    borderRadius: 8,
    minHeight: 80,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  buttonRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ttsControls: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  answerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#1d3557',
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    marginTop: 10,
    alignItems: 'center',
  },
});
