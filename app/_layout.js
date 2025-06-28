// app/_layout.js
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '🧩 Home',
          headerStyle: { backgroundColor: '#0e3d6e' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="knowledge"
        options={{
          title: '🧩 Knowledge',
          headerStyle: { backgroundColor: '#0e3d6e' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="offline"
        options={{
          title: '🧩 Offline',
          headerStyle: { backgroundColor: '#0e3d6e' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="planner"
        options={{
          title: '🧩 Planner',
          headerStyle: { backgroundColor: '#0e3d6e' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="story"
        options={{
          title: '📖 Generate Story',
          headerStyle: { backgroundColor: '#0e3d6e' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="visual"
        options={{
          title: '⚙️ Visual Aids',
          headerStyle: { backgroundColor: '#0e3d6e' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="worksheet"
        options={{
          title: '📄 Worksheet',
          headerStyle: { backgroundColor: '#0e3d6e' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      />
      
    </Stack>
  );
}
