import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import CocktailCard from '../components/CocktailCard';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default function HomeScreen({ navigation }) {
  const [cocktails, setCocktails] = useState([]);
  const [letterIndex, setLetterIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNextLetter(true);
  }, []);

  const fetchByLetter = async (letter) => {
    try {
      const res = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);
      return res.data.drinks || [];
    } catch (e) {
      throw new Error('Impossible de récupérer les cocktails');
    }
  };

  const loadNextLetter = async (initial = false) => {
    if (letterIndex >= letters.length) return;
    setLoading(true);
    setError(null);
    try {
      const newDrinks = await fetchByLetter(letters[letterIndex]);
      // deduplicate
      const merged = [...cocktails];
      newDrinks.forEach((d) => {
        if (!merged.find((m) => m.idDrink === d.idDrink)) merged.push(d);
      });
      setCocktails(merged);
      setLetterIndex((i) => i + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      if (initial) setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setCocktails([]);
    setLetterIndex(0);
    await loadNextLetter(true);
  };

  const renderItem = ({ item }) => (
    <CocktailCard
      cocktail={item}
      onPress={() => navigation.navigate('Detail', { id: item.idDrink })}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      {error ? <ErrorBanner message={error} /> : null}
      {cocktails.length === 0 && loading ? (
        <Loader />
      ) : (
        <FlatList
          data={cocktails}
          keyExtractor={(item) => item.idDrink}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
          onEndReached={() => loadNextLetter(false)}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
      {loading && cocktails.length > 0 ? <Loader message="Chargement de plus de cocktails..." /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 8 },
});