import '@/web.css';
import React from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';


const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 40) / 2;
const windowHeight = Dimensions.get('window').height;

export default function PostsScreen() {
  const posts = useSelector((state: any) => state.posts);

  return (
    <ScrollView
      style={styles.scroll}
      className="scroll-container"
      contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]} // 👈 importante
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.grid}>
        {posts.map((item: any, index: number) => (
          <Card
            key={index}
            style={[
              styles.card,
              { width: cardWidth },
              Platform.OS === 'web' ? { cursor: 'pointer' } : null,
            ]}
            elevation={3}
          >
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
            {item.text && (
              <View style={styles.textContainer}>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            )}
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scroll: {
    height: windowHeight, // 🔑 deja que el navegador maneje el scroll
  },
  scrollContent: {
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    marginBottom: 70,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
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
});
