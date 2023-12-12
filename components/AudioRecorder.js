import { View, Text, Modal, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Audio } from 'expo-av'
import { uploadFileToStorage } from '../services/firebaseService';
import { IconButton } from 'react-native-paper';

const AudioRecorder = ({ recorderVisible, setRecorderVisible, richText, audioPath }) => {
    const [recording, setRecording] = useState();
    const [recordingUri, setRecordingUri] = useState();

    useEffect(() => {
        requestAudioPermissions();
    }, [])

    const requestAudioPermissions = async () => {
        const { status } = await Audio.requestPermissionsAsync();
        return status === 'granted';
    }

    const startRecording = async () => {
        try {
            console.log('Requesting permissions..');
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.LOW_QUALITY = {
                android: {
                    extension: '.mp3',
                    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
                    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
                },
                ios: {
                    extension: '.m4a',
                    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
                    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
                }
            });
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    const stopRecording = async () => {
        try {
            console.log('Stopping recording..');
            await recording.stopAndUnloadAsync();
            setRecording(undefined);
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            const uri = recording.getURI();
            setRecordingUri(uri);
            console.log('Recording stopped and stored at', uri);
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    }

    const handleSaveRecording = async (recording) => {
        const audio = await uploadFileToStorage(recording, audioPath);
        const audioId = `audio-${new Date().getTime()}`;
        richText.current.insertHTML(`
        <br>
            <div id="${audioId}">
               <audio controls>
                  <source src=${audio} type="audio/x-m4a">
               </audio>
            </div>
     `);
        setRecorderVisible(false);
        setRecordingUri('');
    }

    return (
        <Modal visible={recorderVisible}
            animationType="slide"
            transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.buttonContainer}>
                        <Button
                            color='purple'
                            title={recording ? 'Stop recording' : 'Start recording'}
                            onPress={recording ? stopRecording : startRecording}
                        />
                        <Button color='gray' title="Cancel" onPress={() => setRecorderVisible(false)} />
                    </View>
                    {
                        recordingUri &&
                        <View style={styles.buttonContainer}>
                            <Button title="Save" color='green' onPress={() => handleSaveRecording(recordingUri)} />
                            <Button title="Delete" color='red' onPress={() => setRecordingUri('')} />
                        </View>
                    }
                </View>
            </View>
        </Modal>
    )
}

export default AudioRecorder;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        backgroundColor: 'whitesmoke',
        width: '90%',
        alignItems: 'center'
    },
})
