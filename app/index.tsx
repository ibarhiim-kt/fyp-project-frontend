import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function App() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Pick image from the gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
      setExtractedText('');
    } else {
      alert('No image selected');
    }
  };

  // Upload image to backend and extract text
  const uploadImage = async () => {
    if (!imageUri) {
      alert('Please select an image first!');
      return;
    }

    setLoading(true);
    
    try {
      // Convert image URI to Blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'image.jpg');  // Use blob and filename

      const backendUrl = 'http://127.0.0.1:5000/upload';  // Update if necessary

      const uploadResponse = await axios.post(backendUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setExtractedText(uploadResponse.data.extracted_text);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to extract text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pick an Image" onPress={pickImage} />
      {imageUri && (
        <>
          <Image source={{ uri: imageUri }} style={{ width: 300, height: 300, marginTop: 20 }} />
          {!loading && <Button title="Extract Text" onPress={uploadImage} />}
          {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
          <Text style={{ marginTop: 20, textAlign: 'center' }}>{extractedText}</Text>
        </>
      )}
    </View>
  );
}
