import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { calculatingFinancing } from '@monorepo/financing-calculator';

export default function App() {
  const [value, setValue] = useState('');
  const [months, setMonths] = useState('');
  const [interest, setInterest] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const financing = calculatingFinancing({
      principal: parseFloat(value),
      months: parseInt(months, 10),
      monthlyInterestRate: parseFloat(interest),
    });
    setResult(financing);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Financiamento Imobiliário</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor do imóvel"
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de parcelas"
        keyboardType="numeric"
        value={months}
        onChangeText={setMonths}
      />
      <TextInput
        style={styles.input}
        placeholder="Juros mensais (%)"
        keyboardType="numeric"
        value={interest}
        onChangeText={setInterest}
      />
      <Button title="Calcular" onPress={handleCalculate} />
      {result && (
        <View style={styles.result}>
          <Text>Parcela: R$ {result.installment.toFixed(2)}</Text>
          <Text>Total Pago: R$ {result.totalPaid.toFixed(2)}</Text>
          <Text>Juros Totais: R$ {result.totalInterest.toFixed(2)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  result: { marginTop: 20 },
});
