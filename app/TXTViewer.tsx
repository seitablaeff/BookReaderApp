import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Импортируем useNavigation для доступа к навигационным параметрам
import { useLocalSearchParams } from 'expo-router';

import * as FileSystem from 'expo-file-system';
import { FileContext } from '@/app/FileContext';

export default function TXTViewer() {
  const { fileUri } = useContext(FileContext);
  const [fileContent, setFileContent] = useState('');
  const navigation = useNavigation(); // Используем hook useNavigation для доступа к навигационным параметрам
  const { name } = useLocalSearchParams();

  useEffect(() => {
    const readFile = async () => {
      if (fileUri) {
        try {
          let content = '';
          if (Platform.OS === 'android') {
            content = await FileSystem.readAsStringAsync(fileUri);
          } else if (Platform.OS === 'web') {
            const response = await fetch(fileUri);
            content = await response.text();
          }
          setFileContent(content);
        } catch (error) {
          console.error('Ошибка при чтении файла', error);
        }
      }
    };

    readFile();
  }, [fileUri]);

  // Устанавливаем заголовок окна в зависимости от параметра `name`
  useEffect(() => {
    if (name) {
      navigation.setOptions({ title: name });
    }
  }, [name]);

  return (
    <View style={styles.container}>
      {fileUri ? (
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.contentText}>{fileContent}</Text>
        </ScrollView>
      ) : (
        <Text>Файл не выбран</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  contentText: {
    fontSize: 16,
  },
});
