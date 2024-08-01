import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { FileContext } from '@/app/FileContext';
import { useRouter } from 'expo-router';

const TabTwoScreen = () => {
  const { setFileUri, files, setFiles } = useContext(FileContext);
  const router = useRouter();

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        const name = getFileName(result.assets[0].name);
        const extension = result.assets[0].name.split('.').pop()?.toLowerCase() || '';

        setFileUri(uri);

        setFiles((prevFiles: any) => {
          // Проверка на уникальность файла по uri
          if (!prevFiles.some((file: any) => file.uri === uri)) {
            return [...prevFiles, { uri, name, extension }];
          }
          return prevFiles;
        });

        // Определяем, какое окно использовать для отображения
        switch (extension) {
          case 'txt':
            router.push({ pathname: '/TXTViewer', params: { name } });
            break;
          case 'fb2':
            router.push({ pathname: '/FB2Viewer', params: { name } });
            break;
          case 'other':
            // Обработка для других типов файлов
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.log('Ошибка при выборе файла', error);
    }
  };

  const handleOpenFile = (uri: string, extension: string, name: string) => {
    console.log(uri);

    switch (extension) {
      case 'txt':
        router.push({ pathname: '/TXTViewer', params: { name } });
        break;
      case 'fb2':
        router.push({ pathname: '/FB2Viewer', params: { name } });
        break;
      case 'other':
        // Обработка для других типов файлов
        break;
      default:
        break;
    }
  };

  const getFileName = (name: string) => {
    return name.split('.').slice(0, -1).join('.');
  };

  const handleClearFiles = () => {
    setFiles([]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleOpenFile(item.uri, item.extension, item.name)}
      style={styles.fileCard}
    >
      <View style={styles.box}>
        <Text style={styles.extensionText}>{item.extension?.toUpperCase()}</Text>
      </View>
      <Text style={styles.fileNameText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.buttonContainer}>
        <Button title="Добавить файл" onPress={handlePickDocument} />
        <Button title="Очистить файлы" onPress={handleClearFiles} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  flatListContent: {
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  fileCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    margin: 5,
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 5,
    minWidth: '48%', // To ensure that it takes at least 48% of the available width
    maxWidth: '48%', // To ensure that it doesn't exceed 48% of the available width
  },
  box: {
    width: 100,
    height: 150,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  extensionText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  fileNameText: {
    marginTop: 10,
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});

export default TabTwoScreen;
