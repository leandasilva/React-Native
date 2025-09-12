import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import { deletePost, fetchPosts } from '../features/userSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import type { RootStackParamList } from './Appnavigator';

const { width: screenWidth } = Dimensions.get('window');
const isSmallDevice = screenWidth < 400;
const cardWidth = Math.max((screenWidth - 40) / 2, 160); // asegura un mínimo

type PostsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Posts'
>;

export default function PostsScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<PostsScreenNavigationProp>();

  const { items: posts, loading } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) return <Text style={{ padding: 20 }}>Cargando posts...</Text>;

  if (!posts || posts.length === 0) {
    return <Text style={{ padding: 20 }}>No hay posts disponibles</Text>;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <Card style={[styles.card, { width: cardWidth }]}>
          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              style={styles.deleteButton}
              labelStyle={styles.deleteLabel}
              onPress={() => dispatch(deletePost(item._id))}
            >
              Eliminar
            </Button>
          </View>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 10,
    paddingBottom: 40,
  },
  column: {
    justifyContent: 'space-between',
  },
  card: {
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    minHeight: 200, // asegura que siempre tenga alto visible
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9, // relación estándar (ajustá según tus fotos)
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    padding: 10,
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  deleteButton: {
    borderColor: '#ff4d4f',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
    paddingVertical: isSmallDevice ? 6 : 8,
    paddingHorizontal: isSmallDevice ? 12 : 16,
    minWidth: isSmallDevice ? '45%' : 80,
  },
  deleteLabel: {
    color: '#ff4d4f',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: '600',
  },
});


/*
 <Button
                mode="outlined"
                style={styles.editButton}
                labelStyle={styles.editLabel}
                onPress={() => navigation.navigate("EditPost", { id: post._id })}
              >
                Editar
              </Button>
*/