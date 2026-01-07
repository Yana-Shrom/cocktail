import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ErrorBanner({ message = 'Une erreur est survenue' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#ffcccc', padding: 12, borderRadius: 6, margin: 8 },
  text: { color: '#900' },
});