import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function TimeInputRow({ time, index, onTimeChange, onRemove }) {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  const handleConfirm = (date) => {
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onTimeChange(index, formattedTime);
    hidePicker();
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <TouchableOpacity onPress={showPicker} style={{ flex: 1 }}>
        <TextInput
          value={time}
          editable={false}
          placeholder="HH:MM"
          style={{
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onRemove(index)} style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 20, color: 'red' }}>✕</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        is24Hour={true}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />
    </View>
  );
}
