import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { createPost } from '../features/userSlice';
import { useAppDispatch } from '../hooks'; // dispatch tipado

const screenWidth = Dimensions.get('window').width;

export default function UserForm({ navigation }: any) {
  const [text, setText] = useState('');
  const [image, setImage] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null); // para web preview
  const dispatch = useAppDispatch();

  // Limpiar URL antigua en web para no filtrar memoria
  useEffect(() => {
    return () => {
      if (Platform.OS === 'web' && imageUri) URL.revokeObjectURL(imageUri);
    };
  }, [imageUri]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      if (Platform.OS === 'web') {
        const asset = result.assets[0];
        // @ts-ignore: File property is available on web
        const file = asset.file ?? asset; // Prefer asset.file if available, fallback to asset
        setImage(file);
        if (file instanceof File) {
          setImageUri(URL.createObjectURL(file));
        } else {
          setImageUri(asset.uri);
        }
      } else {
        setImage(result.assets[0].uri); // móvil: URI
        setImageUri(result.assets[0].uri);
      }
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !image) return;

    const formData = new FormData();
    formData.append('text', text);

    if (image) {
      if (Platform.OS === 'web') {
        formData.append('image', image as File);
      } else {
        formData.append('image', {
          uri: image,
          type: 'image/jpeg', // o 'image/png' según corresponda
          name: 'photo.jpg',
        } as any);
      }
    }

    try {
      await dispatch(createPost(formData));
      setText('');
      setImage(null);
      setImageUri(null);
      navigation.navigate('Posts');
    } catch (err) {
      console.error('Error al subir post:', err);
    }
  };

  return (
    <View
      style={{
        padding: 10,
        margin: 10,
        borderRadius: 8,
        alignSelf: 'center',
        width: screenWidth * 0.85,
        backgroundColor: '#fff',
      }}
    >
      <TextInput
        label="Escribe algo..."
        value={text}
        onChangeText={setText}
        style={{ marginBottom: 8, height: 40, fontSize: 14 }}
      />

      <Button
        mode="outlined"
        onPress={pickImage}
        style={{ marginBottom: 8, paddingVertical: 2 }}
        labelStyle={{ fontSize: 12 }}
      >
        Seleccionar Foto
      </Button>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: screenWidth * 0.4,
            height: screenWidth * 0.3,
            aspectRatio: 1,
            alignSelf: 'center',
            marginBottom: 2,
            borderRadius: 2,
          }}
          resizeMode="contain"
        />
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={{ paddingVertical: 4 }}
        labelStyle={{ fontSize: 13 }}
        disabled={!text.trim() && !image}
      >
        Publicar
      </Button>
    </View>
  );
}
