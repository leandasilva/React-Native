import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { addPost } from '../store'; // Ensure addPost is exported from ../store.ts

import type { NavigationProp } from '@react-navigation/native';

type UserFormProps = {
  navigation: NavigationProp<any>;
};

export default function UserForm({ navigation }: UserFormProps) {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const dispatch = useDispatch();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (text.trim() || image) {
      dispatch(addPost({ text, image }));
      setText('');
      setImage(null);
      navigation.navigate('Posts'); // ir a la pantalla de publicaciones
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        label="Escribe algo..."
        value={text}
        onChangeText={setText}
        style={{ marginBottom: 10 }}
      />
      <Button mode="outlined" onPress={pickImage} style={{ marginBottom: 10 }}>
        Seleccionar Foto
      </Button>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 10 }} />
      )}
      <Button mode="contained" onPress={handleSubmit}>
        Publicar
      </Button>
    </View>
  );
}
