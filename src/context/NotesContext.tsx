import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '../utils/storage';
import { Note } from '../types/note';


interface NotesContextType {
  notes: Note[];
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
}

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  addNote: () => {},
  deleteNote: () => {},
});

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const NOTES_KEY = 'MY_NOTES_STORAGE';


  useEffect(() => {
    const loadNotes = async () => {
      try {
        const savedNotes = await AsyncStorage.getItem(NOTES_KEY);
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };
    loadNotes();
  }, []);

  const saveNotes = async (newNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const addNote = (note: Note) => {
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};
