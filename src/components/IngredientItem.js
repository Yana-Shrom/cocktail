import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function IngredientItem({ name, measure }) {
  const imageUrl = `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(name)}-small.png`;
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {measure ? <Text style={styles.measure}>{measure}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  image: { width: 48, height: 48, marginRight: 12 },
  info: {},
  name: { fontWeight: '600' },
  measure: { color: '#555' },
});