import React, { useContext } from 'react';
import { Pressable, Text, View, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Note } from '../types/note';
import { NotesContext } from '../context/NotesContext';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

export const NoteCard = ({ note, onPress }: NoteCardProps) => {
  const { deleteNote } = useContext(NotesContext);

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteNote(note.id),
      },
    ]);
  };

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{note.title}</Text>
          <Text numberOfLines={2} style={styles.content}>
            {note.content}
          </Text>
        </View>
        <Pressable onPress={handleDelete} hitSlop={10}>
          <Icon name="trash-outline" size={24} color="red" />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    marginTop:12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  textContainer: {
    flex: 1,
    marginRight: 8, 
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  content: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
