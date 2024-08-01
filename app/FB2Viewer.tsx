import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { FileContext } from '@/app/FileContext';
import { parseString } from 'react-native-xml2js';
import { Menu, Provider, Appbar } from 'react-native-paper';

export default function FB2Viewer() {
  const { fileUri } = useContext(FileContext);
  const [fileContent, setFileContent] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();
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

          //console.log('File Content Start:', content.slice(0, 100));

          content = content.trim();
          const firstTagIndex = content.indexOf('<');
          if (firstTagIndex > 0) {
            content = content.slice(firstTagIndex);
          }

          parseString(content, (err: any, result: any) => {
            if (err) {
              console.error('Ошибка при парсинге XML', err);
              return;
            }

            //console.log('Parsed XML Result:', JSON.stringify(result, null, 2));

            try {
              const bookTitle = result.FictionBook?.description?.[0]?.['title-info']?.[0]?.['book-title']?.[0];
              
              const extractText = (section: any): string => {
                const title = section.title?.[0]?.p?.[0] || '';
                const paragraphs = section.p?.map((paragraph: any) => {
                  if (typeof paragraph === 'string') {
                    return paragraph;
                  } else if (typeof paragraph === 'object' && '_' in paragraph) {
                    return paragraph._;
                  }
                  return JSON.stringify(paragraph);
                }).join('\n\n') || '';
                const subsections = section.section?.map(extractText).join('\n\n') || '';
                return `${title}\n\n${paragraphs}\n\n${subsections}`;
              };

              const bodySections = result.FictionBook?.body?.[0]?.section?.map(extractText).join('\n\n');
              setFileContent(`${bookTitle}\n\n${bodySections}`);
            } catch (parseError) {
              console.error('Error processing parsed XML:', parseError);
            }
          });

        } catch (error) {
          console.error('Ошибка при чтении файла', error);
        }
      }
    };

    readFile();
  }, [fileUri]);

  useEffect(() => {
    if (name) {
      navigation.setOptions({
        title: name,
        headerRight: () => (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Appbar.Action
                icon="dots-vertical"
                color="white"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item onPress={() => alert('Вы нажали на кнопку Содержание')} title="Содержание" />
            <Menu.Item onPress={() => alert('Вы нажали на кнопку Масштаб')} title="Масштаб" />
            <Menu.Item onPress={() => alert('Вы нажали на кнопку Настройки')} title="Настройки" />
          </Menu>
        ),
      });
    }
  }, [name, menuVisible]);

  return (
    <Provider>
      <View style={styles.container}>
        {fileUri ? (
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.contentText}>{fileContent}</Text>
          </ScrollView>
        ) : (
          <Text>Файл не выбран</Text>
        )}
      </View>
    </Provider>
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
