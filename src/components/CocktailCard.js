import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function CocktailCard({ cocktail, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: cocktail.strDrinkThumb + '/small' }} style={styles.image} />
      <Text style={styles.title}>{cocktail.strDrink}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    width: 160,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 8,
  },
  title: {
    marginTop: 8,
    textAlign: 'center',
  },
});