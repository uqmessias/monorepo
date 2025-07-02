import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Form from './src/components/Form';

export default function App() {
  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Form />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 200,
  },
});
