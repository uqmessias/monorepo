import React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import Input from '../Input';

interface FormProps {}
function Form({}: FormProps) {
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={50}
      contentContainerStyle={{ paddingBottom: 320 }}
    >
      <Input label="Qual é o valor do imóvel?" inputType="currency" />
      <Input label="Qual é o valor da entrada?" inputType="currency" />
      <Input label="Em quantos meses pretende financiar?" inputType="numeric" />
      <Input label="Qual é o CET anual?" inputType="percentage" />
      <Input
        label="Qual é o valor disponível para pagar as armotizações por mês?"
        inputType="numeric"
        hint="(o valor da primeira parcela é: R$ 2.500,00)"
      />
    </KeyboardAvoidingView>
  );
}

export default Form;
