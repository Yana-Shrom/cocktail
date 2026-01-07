import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CocktailCard from '../components/CocktailCard';
import Loader from '../components/Loader';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    loadFavorites();
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    const raw = await AsyncStorage.getItem('favorites');
    setFavorites(raw ? JSON.parse(raw) : []);
  };

  const clearAll = async () => {
    await AsyncStorage.removeItem('favorites');
    setFavorites([]);
    Alert.alert('Succès', 'Favoris supprimés');
  };

  if (favorites === null) return <Loader />;

  if (favorites.length === 0)
    return (
      <View style={{ padding: 16 }}>
        <Text>Aucun favori pour le moment</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idDrink}
        renderItem={({ item }) => (
          <CocktailCard cocktail={item} onPress={() => navigation.navigate('Detail', { id: item.idDrink })} />
        )}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <Button title="Supprimer tous les favoris" color="#900" onPress={clearAll} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 8 },
  footer: { padding: 12 },
});