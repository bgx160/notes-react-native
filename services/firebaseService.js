import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { getDatabase, ref as databaseRef, push, set, remove } from 'firebase/database';
import { Camera } from 'expo-camera';

import app from "../firebase.js";

const storage = getStorage(app);
const database = getDatabase(app);

export const saveNoteToDatabase = (user, content) => {
    if (content.id !== null && content.id !== '') {
        set(databaseRef(database, `notes/${user.uid}/${content.id}`), content);
    } else {
        push(databaseRef(database, `notes/${user.uid}`), content);
    }
};

export const deleteNote = (id, uid) => {
    return remove(databaseRef(database, `notes/${uid}/${id}`));
}

export const deleteDirectoryFromStorage = async (path) => {
    const ref = storageRef(storage, path);
    const items = await listAll(ref);

    const deletePromises = items.items.map((item) => deleteObject(item));

    await Promise.all(deletePromises);
};

export const uploadFileToStorage = async (uri, path) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storageRef(storage, `${path}/` + new Date().getTime());

    try {
        const snapshot = await uploadBytes(ref, blob);
        console.log('Uploaded file');

        const url = await getDownloadURL(ref);
        return url;
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

export const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status == 'granted';
};