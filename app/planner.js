import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Button, ScrollView,
  ActivityIndicator, Alert, Platform
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { router } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import * as Print from 'expo-print';

export default function PlannerScreen() {
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState({});
  const [markdown, setMarkdown] = useState('');

  const handleExportPdf = async () => {
    if (!markdown) {
      Alert.alert('No data to export.');
      return;
    }

    try {
      const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            th { background-color: #f1f5f9; }
          </style>
        </head>
        <body>
          <h2>Weekly Lesson Plan</h2>
          ${markdownToHtmlTable(markdown)}
        </body>
      </html>
    `;

      const { uri } = await Print.printToFileAsync({ html });

      await Sharing.shareAsync(uri);
    } catch (err) {
      console.error('❌ PDF Export Error:', err);
      Alert.alert('Error', 'Failed to export PDF');
    }
  };

  function markdownToHtmlTable(md) {
    const lines = md.trim().split('\n');
    if (lines.length < 3) return '';

    const headers = lines[0].split('|').slice(1, -1).map(h => h.trim());
    const rows = lines.slice(2).map(row => row.split('|').slice(1, -1).map(cell => cell.trim()));

    const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;

    return `<table>${thead}${tbody}</table>`;
  }


  const parseMarkdownTable = (markdown) => {
    const lines = markdown.trim().split('\n');
    const headers = lines[0]?.split('|').map(h => h.trim()).filter(Boolean);
    const rows = lines.slice(2).map(line =>
      line.split('|').map(cell => cell.trim()).filter(Boolean)
    );
    return { headers, rows };
  };

  const handleGenerate = async () => {
    if (!grade || !subject) {
      Alert.alert('Grade and Subject are required.');
      return;
    }

    try {
      setLoading(true);
      setPlan({});
      setMarkdown('');

      const response = await fetch('http://192.168.0.107:5000/api/lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, subject, theme }),
      });

      const data = await response.json();

      if (response.ok) {
        setPlan(data.plan || {});
        setMarkdown(data.markdown || '');
      } else {
        throw new Error(data.error || 'Failed to generate plan');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!markdown) {
      Alert.alert('Nothing to download yet');
      return;
    }

    try {
      const fileUri = FileSystem.documentDirectory + `lesson_plan_${Date.now()}.md`;

      await FileSystem.writeAsStringAsync(fileUri, markdown, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Download complete', 'File saved to device.');
      }
    } catch (error) {
      console.error('Download Error:', error);
      Alert.alert('Error', 'Failed to download file');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📅 Weekly Lesson Planner</Text>

      <TextInput
        style={styles.input}
        placeholder="Grade (e.g., 5)"
        keyboardType="numeric"
        value={grade}
        onChangeText={setGrade}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject (e.g., Science)"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={styles.input}
        placeholder="Optional Theme (e.g., Plants or Sustainability)"
        value={theme}
        onChangeText={setTheme}
      />

      <Button title="Generate Plan" onPress={handleGenerate} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {markdown && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📊 Weekly Lesson Plan</Text>
          <ScrollView horizontal style={{ marginVertical: 10 }}>
            <Markdown style={markdownStyles}>
              {markdown}
            </Markdown>
          </ScrollView>

          <View style={{ marginTop: 16 }}>
            <Button title="🧾 Export as PDF" onPress={handleExportPdf} />
          </View>

        </View>
      )}


    </ScrollView>
  );
}

const markdownStyles = {
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  table_header: {
    backgroundColor: '#f1f5f9',
  },
  th: {
    padding: 8,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  td: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#eef2f5',
  },
  tableTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },

  tableCell: {
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#ddd',
    minWidth: 120,
    textAlign: 'left',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  dayBlock: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dayHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2a5d84',
    marginBottom: 6,
  },
  planText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
