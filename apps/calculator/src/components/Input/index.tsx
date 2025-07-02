import React from 'react';
import {
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type InputType = 'percentage' | 'currency' | 'numeric';

interface InputProps {
  hint?: string;
  inputType: InputType;
  label?: string;
  onValueChange?: (newValue: number) => void;
  value?: number;
}

const formatters = {
  toPercentage: (percentile: number): string => {
    return `${percentile.toFixed(2).replace('.', ',')}%`;
  },
  fromPercentage: (text: string): number => {
    const clearedNumericText = text.replace(/[^0-9]/g, '');

    return Number.parseFloat(clearedNumericText) / 100;
  },

  toCurrency: (amount: number): string => {
    const sign = amount < 0 ? '-' : '';
    const absAmount = Math.abs(amount);
    const formattedAmount = absAmount
      .toFixed(2)
      .replace('.', ',')
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1.`);

    return `R$ ${sign}${formattedAmount}`;
  },
  fromCurrency: (formattedAmount: string): number => {
    const clearedNumericAmount = formattedAmount.replace(/^(-)|[^0-9]+/g, '$1');

    return Number.parseFloat(clearedNumericAmount) / 100;
  },

  toNumeric: (value: number): string => {
    return value.toString(10);
  },
  fromNumeric: (text: string): number => {
    return Number.parseFloat(`0${text}`);
  },
} as const;

function Input({ hint, inputType, label, onValueChange, value }: InputProps) {
  const containerStyle: ViewStyle = {
    flex: 0,
    // flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    // marginVertical: 12,
    // backgroundColor: 'green',
  };

  const textInputStyle: TextStyle = {
    // backgroundColor: 'rgba(255,0,0,0.2)',
    minHeight: 48,
    borderRadius: 5,
    // borderBottomWidth: 1,
    // borderEndWidth: 1,
    borderStartWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 16,
    fontSize: 20,
    marginVertical: 4,
  };
  const labelTextStyle: TextStyle = {
    color: 'black',

    fontSize: 14,
  };
  const hintTextStyle: TextStyle = {
    color: 'gray',
    fontSize: 12,
  };

  const titleCasedInputType = React.useMemo(
    () =>
      (inputType.charAt(0).toUpperCase() + inputType.substring(1)) as Capitalize<typeof inputType>,
    [inputType],
  );
  const formatter = formatters[`to${titleCasedInputType}`];
  const unformatter = formatters[`from${titleCasedInputType}`];
  const [formattedValue, setFormattedValue] = React.useState(() =>
    value === undefined ? undefined : formatter(value ?? 0),
  );
  const valueRef = React.useRef(value);

  React.useEffect(() => {
    if (valueRef.current !== value) {
      valueRef.current = value;
    }
  }, [value]);

  const placeholder = React.useMemo(() => formatter(1234567.89), [formatter]);

  const onTextChanged = React.useCallback(
    (newText: string) => {
      const newUnformattedValue = unformatter(newText);
      const newFormattedValue = formatter(newUnformattedValue);

      if (formatter(valueRef.current ?? 0) !== newFormattedValue) {
        valueRef.current = newUnformattedValue;
        onValueChange?.(newUnformattedValue);
        setFormattedValue(newFormattedValue);
      }

      console.log(
        `newText: ${newText}, newUnformatterdValue: ${newUnformattedValue}, newFormattedValue: ${newFormattedValue}, valueRef.current: ${valueRef.current}`,
      );
    },
    [unformatter, onValueChange],
  );
  const selection: TextInputProps['selection'] =
    formattedValue !== undefined
      ? {
          start: formattedValue?.length - (inputType === 'percentage' ? 1 : 0),
        }
      : undefined;

  return (
    <View style={containerStyle}>
      {!!label && <Text style={labelTextStyle}>{label}</Text>}
      <TextInput
        style={textInputStyle}
        keyboardType="number-pad"
        onChangeText={onTextChanged}
        value={formattedValue}
        selection={selection}
        placeholder={placeholder}
      />
      {!!hint && <Text style={hintTextStyle}>{hint}</Text>}
    </View>
  );
}

export default Input;
