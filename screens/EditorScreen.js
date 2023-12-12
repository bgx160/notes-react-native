import { createRef, useRef, useState, useEffect } from "react";
import { SafeAreaView, ScrollView, KeyboardAvoidingView, View, Modal, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Image } from "react-native";
import { Icon, IconButton, TextInput } from "react-native-paper";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import { Camera } from 'expo-camera';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { useAuth } from '../AuthContext';
import { saveNoteToDatabase } from "../services/firebaseService.js";
import { Audio } from "expo-av";
import CameraComponent from "../components/CameraComponent.js";
import uuid from 'react-native-uuid';
import app from "../firebase.js";
import AudioRecorder from "../components/AudioRecorder.js";
import ConfirmationModal from "../components/ConfirmationModal.js";



const handleHead = ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>
const handleRecord = () => <Icon source='microphone' size={20} color="gray" />


const EditorScreen = ({ route, navigation }) => {
    const richText = createRef() || useRef();

    const storage = getStorage(app);
    const database = getDatabase(app);

    const { user } = useAuth();

    const [content, setContent] = useState({ id: null, title: '(no title)', content: '', date: Date.now(), filePath: '' });
    const [cameraPermission, setCameraPermission] = useState(null);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [recorderPermission, setRecorderPermission] = useState(null);
    const [recorderVisible, setRecorderVisible] = useState(false);

    useEffect(() => {
        if (route.params && route.params.id) {
            setContent((prevContent) => ({
                ...prevContent,
                title: route.params.title,
                content: route.params.content,
                id: route.params.id,
                filePath: route.params.filePath
            }));
        } else {
            setContent((prevContent) => ({
                ...prevContent, filePath: uuid.v4()
            }))
        }
        askCameraPermission();
        askAudioPermissions();
    }, []);

    const saveAndExit = () => {
        saveNoteToDatabase(user, content);
        navigation.goBack();
    };

    const askCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(status === 'granted');
    };

    const askAudioPermissions = async () => {
        const { status } = await Audio.requestPermissionsAsync();
        setRecorderPermission(status === 'granted');
    }

    const openCamera = () => cameraPermission && setCameraVisible(true);

    const openRecorder = () => recorderPermission && setRecorderVisible(true)

    return (
        <View>
            <CameraComponent cameraVisible={cameraVisible} setCameraVisible={setCameraVisible} richText={richText} filePath={`${user.uid}/${content.filePath}/images`} />
            <AudioRecorder recorderVisible={recorderVisible} setRecorderVisible={setRecorderVisible} richText={richText} filePath={`${user.uid}/${content.filePath}/recordings`} />


            <SafeAreaView>
                <ScrollView>
                    <KeyboardAvoidingView behavior="padding">

                        <View>
                            <ConfirmationModal
                                isVisible={confirmationVisible}
                                onConfirm={() => saveAndExit()}
                                onCancel={() => navigation.goBack()}
                                message="Do you want to save current changes?"
                            />
                            <IconButton icon="keyboard-backspace" size={40} color="#000" onPress={() => setConfirmationVisible(true)} />
                            <RichToolbar
                                editor={richText}
                                actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1, actions.insertImage, 'record']}
                                iconMap={{ [actions.heading1]: handleHead, record: handleRecord }}
                                onPressAddImage={() => openCamera()}
                                record={openRecorder}
                            />
                            <View>
                                <TextInput value={content.title} onChangeText={text => setContent({ ...content, title: text })} />
                            </View>

                            <View style={styles.container}>
                                <RichEditor
                                    initialHeight={500}
                                    ref={richText}
                                    initialContentHTML={content.content}
                                    onChange={text => setContent({ ...content, content: text })}
                                    editorStyle={{ color: '#000' }}
                                />
                            </View>
                        </View>

                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView>
        </View>

    );
}

export default EditorScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        marginTop: 5,
    },
    cameraContainer: {
        flex: 1,

    },
    camera: {
        flex: 4,
        minWidth: "100%",
    },
    cameraButton: {
        backgroundColor: 'skyblue',
        width: '100%',
        paddingHorizontal: 10,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
    },

});