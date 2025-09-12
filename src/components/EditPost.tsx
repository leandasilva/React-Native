import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { updatePost, UpdatePostPayload } from '../features/userSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { RootState } from '../store';
import { RootStackParamList } from './Appnavigator';

const screenWidth = Dimensions.get('window').width;

type Props = NativeStackScreenProps<RootStackParamList, 'EditPost'>;

export default function EditPostScreen({ navigation, route }: Props) {
  const { id } = route.params;

  const post = useAppSelector((state: RootState) =>
    state.posts.items.find(p => p._id === id)
  );

  const [text, setText] = useState(post?.text ?? '');
  const [image, setImage] = useState<any>(post?.image ?? null);

  const dispatch = useAppDispatch();

  // Función para obtener URI para vista previa
  const getImageUri = (img: any): string | null => {
    if (!img) return null;
    if (typeof img === 'string') return img; // URI móvil o URL
    if (Platform.OS === 'web' && img instanceof File) return URL.createObjectURL(img);
    if (img.uri) return img.uri; // objeto ImagePicker
    return null;
  };

  // Función para seleccionar imagen
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      if (Platform.OS === 'web') {
        setImage(result.assets[0]); // File en web
      } else {
        setImage(result.assets[0].uri); // URI en móvil
      }
    }
  };

  // Función para convertir URI móvil a Blob
  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  // Guardar cambios usando thunk
  const handleSave = async () => {
    if (!post) return;

    try {
      const payload: UpdatePostPayload = { id: post._id, text, image };

      // Si es móvil y es URI, convertir a Blob para enviar
      if (Platform.OS !== 'web' && typeof image === 'string') {
        payload.image = await uriToBlob(image);
      }

      await dispatch(updatePost(payload)).unwrap();

      navigation.goBack();
    } catch (err) {
      console.error('Error al actualizar post:', err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Editar texto"
        value={text}
        onChangeText={setText}
        style={styles.textInput}
      />

      <Button mode="outlined" onPress={pickImage} style={styles.button}>
        Cambiar Foto
      </Button>

      {image && (
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: getImageUri(image) ?? '' }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}

      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        Guardar Cambios
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    width: '90%',
    alignSelf: 'center',
  },
  textInput: {
    marginBottom: 12,
    height: 40,
    fontSize: 14,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 4,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 5,
  },
  image: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.2,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    paddingVertical: 6,
  },
});
