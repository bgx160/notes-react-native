import { StyleSheet, Text, TouchableOpacity, View, Alert, Button } from 'react-native'
import { Avatar, Card, IconButton, TextInput } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core'
import { getDatabase, push, ref, onValue } from 'firebase/database';
import { useAuth } from '../AuthContext.js';
import ConfirmationModal from '../components/ConfirmationModal.js';
import React from 'react';

import app from "../firebase.js";
import { handleSignOut } from '../services/authService.js';
import { deleteDirectoryFromStorage, deleteImages, deleteNote } from '../services/firebaseService.js';

const database = getDatabase(app);

const HomeScreen = () => {
  const [originalNotes, setOriginalNotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState({});
  const navigate = useNavigation();

  const { user } = useAuth();

  useEffect(() => {
    const itemsRef = ref(database, `notes/${user.uid}`);
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemsWithIds = Object.entries(data).map(([id, item]) => ({
          id,
          ...item,
        }));
        setOriginalNotes(itemsWithIds.reverse());
        setNotes(itemsWithIds);
      } else {
        setNotes([]);
      }
    });
  }, []);

  const filterNotesByKeyword = (keyword) => originalNotes.filter((note) => note.content.includes(keyword.toLowerCase() || note.title.includes(keyword)));

  const handleSearch = (keyword) => {
    if (keyword === '') {
      setNotes(originalNotes);
    } else {
      setNotes(filterNotesByKeyword(keyword));
    }
  }

  const handleDeleteNote = async (id, imagePath, uid) => {
    try {
      if (imagePath) {
        await deleteDirectoryFromStorage(`${uid}/${imagePath}/recordings`);
        await deleteDirectoryFromStorage(`${uid}/${imagePath}/images`);
      }

      await deleteNote(id, uid);

      Alert.alert("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      Alert.alert("Failed to delete note. Please try again.");
    }
    setConfirmationVisible(false);
    setNoteToDelete({});
  };

  handleLongPressNote = (id, path) => {
    setConfirmationVisible(true);
    setNoteToDelete({ id: id, path: path, uid: user.uid });
  }


  return (

    <View style={styles.container}>
      <View style={styles.topBar}>
        <IconButton icon="plus-circle-outline" iconColor='#000' onPress={() => navigate.navigate('Editor')} />
        <View style={styles.logOutButton}>
          <IconButton icon="logout" onPress={() => handleSignOut()} />
        </View>
      </View>
      <ConfirmationModal
        isVisible={confirmationVisible}
        onConfirm={() => handleDeleteNote(noteToDelete.id, noteToDelete.path, noteToDelete.uid)}
        onCancel={() => setConfirmationVisible(false)}
        message="Are you sure you want to delete this note?"
      />
      <TextInput placeholder='Search' onChangeText={(text) => handleSearch(text)} />
      {notes.map((note, index) => {
        return (
          <TouchableOpacity key={index} onLongPress={() => handleLongPressNote(note.id, note.imagePath)} onPress={() => navigate.navigate('Editor', { title: notes[index].title, content: notes[index].content, id: notes[index].id, imagePath: notes[index].imagePath })}>
            <Card.Title key={index}
              title={note.title}
              subtitle={new Date(note.date).toDateString()}
              left={(props) => <Avatar.Icon {...props} icon="newspaper" />}
            />
          </TouchableOpacity>
        )
      })}
    </View>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logOutButton: {},
});