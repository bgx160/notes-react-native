import React, { useRef, useState } from 'react';
import { Modal, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { uploadFileToStorage } from '../services/firebaseService'; // Import your image upload function

const CameraComponent = ({ cameraVisible, setCameraVisible, richText, imagePath }) => {
  const camera = useRef(null);
  const [picture, setPicture] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const takePicture = async () => {
    if (camera.current) {
      const photo = await camera.current.takePictureAsync({ quality: 0.3 });
      setPicture(photo.uri);
      setPreviewVisible(true);
      setCameraVisible(false);
    }
  };

  const handleSavePicture = async (picture) => {
    const image = await uploadFileToStorage(picture, imagePath);
    richText.current.insertImage(image, 'height: 320px; width: 240px;');

    setCameraVisible(false);
    setPreviewVisible(false);
  }

  const handleCancelPreview = () => {
    setPreviewVisible(false);
    setCameraVisible(true);
  }

  return (
    <>
      <Modal visible={cameraVisible} style={styles.cameraContainer}>
        <Camera ref={camera} style={styles.camera} onCameraReady={() => console.log('Camera ready')} />
        <TouchableOpacity style={styles.cameraButton} onPress={() => takePicture()}>
          <Text>Take a pic</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCameraVisible(false)} style={styles.cameraButton}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </Modal>
      <Modal visible={previewVisible} style={styles.cameraContainer}>
        {
          picture ?
            <>
              <Image style={styles.image} source={{ uri: picture }} />
              <TouchableOpacity style={styles.cameraButton} onPress={() => handleSavePicture(picture)}>
                <Text>
                  Save picture
                </Text>
              </TouchableOpacity>
            </>
            :
            <>
              <Text>No picture found</Text>
            </>
        }
        <TouchableOpacity style={styles.cameraButton} onPress={() => handleCancelPreview()}>
          <Text>
            Go back
          </Text>
        </TouchableOpacity>


      </Modal>
    </>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 4,
    minWidth: '100%',
  },
  cameraButton: {
    backgroundColor: 'skyblue',
    width: '100%',
    paddingHorizontal: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  image: {
    flex: 1,
  },
});

