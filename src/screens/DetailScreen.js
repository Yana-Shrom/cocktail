import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Loader from '../components/Loader';
import IngredientItem from '../components/IngredientItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailScreen({ route }) {
  const { id } = route.params;
  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoris, setFavoris] = useState([]);

  useEffect(() => {
    loadDetails();
    loadFavorites();
  }, []);

  const loadDetails = async () => {
    try {
      const res = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
      setDrink(res.data.drinks[0]);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de charger les détails.');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    const raw = await AsyncStorage.getItem('favorites');
    setFavoris(raw ? JSON.parse(raw) : []);
  };

  const toggleFavorite = async () => {
    const exists = favoris.find((f) => f.idDrink === id);
    let next;
    if (exists) {
      next = favoris.filter((f) => f.idDrink !== id);
    } else {
      next = [...favoris, { idDrink: drink.idDrink, strDrink: drink.strDrink, strDrinkThumb: drink.strDrinkThumb }];
    }
    await AsyncStorage.setItem('favorites', JSON.stringify(next));
    setFavoris(next);
    Alert.alert('Succès', exists ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  if (loading) return <Loader />;
  if (!drink) return <Text style={{ padding: 16 }}>Détails indisponibles</Text>;

  // collect ingredients
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const name = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (name) ingredients.push({ name, measure });
  }

  return (
    <ScrollView style={{ flex: 1, padding: 12 }}>
      <Image source={{ uri: drink.strDrinkThumb + '/large' }} style={styles.image} />
      <Text style={styles.title}>{drink.strDrink}</Text>
      <Text style={styles.sub}>Instructions</Text>
      <Text style={{ marginBottom: 12 }}>{drink.strInstructions}</Text>

      <Text style={styles.sub}>Ingrédients</Text>
      {ingredients.map((ing, idx) => (
        <IngredientItem key={idx} name={ing.name} measure={ing.measure} />
      ))}

      <View style={{ marginTop: 16 }}>
        <Button title={favoris.find((f) => f.idDrink === id) ? 'Retirer des favoris' : 'Ajouter aux favoris'} onPress={toggleFavorite} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 260, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  sub: { fontSize: 16, fontWeight: '600', marginTop: 8, marginBottom: 6 },
});