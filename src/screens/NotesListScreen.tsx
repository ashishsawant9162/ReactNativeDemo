
import React, { useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { NotesContext } from '../context/NotesContext';
import { NoteCard } from '../components/NoteCard';
import { CustomButton } from '../components/Button';

export const NotesListScreen = ({ navigation }: any) => {
  const { notes } = useContext(NotesContext);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <CustomButton title="Add Note" onPress={() => navigation.navigate('AddNote')} />
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NoteCard note={item} onPress={() => navigation.navigate('NoteDetail', { note: item })} />
        )}
      />
    </View>
  );
};


