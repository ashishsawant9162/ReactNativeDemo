// src/screens/AddNoteScreen.tsx
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NotesContext } from '../context/NotesContext';
import { Note } from '../types/note';
import { CustomButton } from '../components/Button';


export const AddNoteScreen = ({ navigation }: any) => {
  const { addNote } = useContext(NotesContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation', 'Please enter both title and content.');
      return;
    }

    const newNote: Note = {
      id: String(),
      title,
      content,
      date: new Date().toISOString(),
    };

    addNote(newNote);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Note Content"
        value={content}
        onChangeText={setContent}
        style={[styles.input, styles.textArea]}
        multiline
      />
      <CustomButton title="Save Note" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
});
