import * as React from "react";
import { useState } from "react";
import { StyleSheet, View, Image, TextInput, Pressable, FlatList, Text, Touchable, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { FontSize, FontFamily, Border } from "../../GlobalStyles";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import axios from "axios";
import { baseUrl } from "../../services/api";
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const DashboardSearchEngine = () => {
  const API_URL = 'http://192.168.39.105:8000'
  const [ isLoading, setLoading ] = useState(false);
  const [ data, setData ] = useState([]);
  const [ page, setPage ] = useState(1);
  const [ totalPages, setTotalpages ] = useState(0);
  const [ isUploading, setIsUploading ] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const [ filter, setFilter ] = useState(null);
  const { colors } = useTheme();

  let model;
  switch (route.name) {
    case "ArtworkScreen": model = "artworks"; break;
    case "ExhibitionScreen": model = "exhibitions"; break;
    case "ArticleScreen": model = "articles"; break;
    case "ShoppingScreen": model = "products"; break;
  }

  const searchData = async (q) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/${model}/search?q="${q}"&page=${page}`);
      setData(response.data.data);
      console.log(data);
      setTotalpages(response.data.pagination.total_pages);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const loadMore = () => { if (page < totalPages) setPage(page + 1) };

  const handleEmpty = () => {
    return <Text> No Institution!</Text>;
  };

  const handlePress = (id) => {
    let detail;
    switch (route.name) {
      case "ArtworkScreen": detail = navigation.navigate('ArtworkDetail', { ID: id }); break;
      case "ExhibitionScreen": detail = navigation.navigate('ExhibitionDetail', { ID: id }); break;
      case "ArticleScreen": detail = navigation.navigate('ArticleDetail', { ID: id }); break;
      case "ShoppingScreen": detail = navigation.navigate('ProductDetail', { ID: id }); break;
    }
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => { handlePress(item.id) }}>
        <Text numberOfLines={1} style={{ color: colors.onSurface, fontFamily: "Inter-Regular" }}>{item.title}</Text>
      </TouchableOpacity>
    );
  };


  const onFrame41Press = async () => {
    try {
      // Request permission to access the camera roll
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setIsUploading(true);
        // Create form data
        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'image.jpg'
        });

        // Send POST request to backend
        const response = await axios.post(`${API_URL}/image_search`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.data) {
          // Navigate to Artwork screen with the search results
          navigation.navigate('ArtworkScreen', {
            searchResults: response.data.answer,
            isImageSearch: true
          });
        } else {
          throw new Error(response.data?.error || 'Unknown error occurred');
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const onFrame40Press = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert("Microphone permission denied");
        return;
      }
  
      // Bắt đầu ghi âm
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
  
      console.log("Recording for 3 seconds...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      await recording.stopAndUnloadAsync();
  
      const uri = recording.getURI();
      const fileInfo = await FileSystem.getInfoAsync(uri);
  
      const formData = new FormData();
      formData.append('audio', {
        uri,
        name: 'recording.wav',
        type: 'audio/wav'
      });
  
      const response = await axios.post('http://192.168.1.11:8000/speech-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      const { text } = response.data;
      console.log("Recognized text:", text);
      setFilter(text);
      searchData(text);
    } catch (error) {
      console.error('Recording error:', error);
      alert("Recording or upload failed.");
    }
  };

  React.useEffect(() => { searchData(filter); console.log(page) }, [ page ])
  return (
    <View style={{
      alignSelf: "stretch",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}>
      <View style={[ styles.dashboardsearchengine, { backgroundColor: colors.surfaceContainerHighest } ]}>
        <Image
          style={styles.vectorIcon}
          contentFit="cover"
          source={require("../../assets/vector1.png")}
        />
        <TextInput placeholder="Search picture, product, . . ."
          placeholderTextColor={colors.onSurfaceVarient}
          style={[ styles.searchPictureProduct, { color: colors.onSurface } ]}
          value={filter}
          onChangeText={(text) => {
            setFilter(text);
            if (text != '') searchData(text);
            else setPage(1);
          }}
        />
        <Pressable onPress={onFrame41Press} disabled={isUploading}>
          {isUploading ? (
            <ActivityIndicator size="small" color={colors.onSurface} />
          ) : (
            <Image
              style={styles.dashboardsearchengineChild}
              contentFit="cover"
              source={require("../../assets/frame-41.png")}
            />
          )}
        </Pressable>
        <Pressable onPress={onFrame40Press}>
          <Image
            style={styles.dashboardsearchengineChild}
            contentFit="cover"
            source={require("../../assets/frame-40.png")}
          />
        </Pressable>
      </View>
      {data.length > 0 && filter !== '' ? (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 5 }} />
            )}
            ListFooterComponent={
              <TouchableOpacity
                onPress={loadMore}
                style={{
                  padding: 12,
                  marginTop: 10,
                  backgroundColor: colors.surfaceContainer,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}>
                <Text style={{ color: colors.onSurfaceVarient, fontFamily: "Inter-Bold" }}>
                  Load more {'>'}
                </Text>
              </TouchableOpacity>
            }
            ListEmptyComponent={handleEmpty}
            contentContainerStyle={{ paddingVertical: 10 }}
            style={{
              position: 'absolute',
              top: 60,
              backgroundColor: colors.surfaceContainerHighest,
              zIndex: 10,
              elevation: 10,
              borderRadius: 20,
              alignSelf: 'center',
              width: Dimensions.get("screen").width - 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
            padding: 10,
          }}
        />
      ) : null}

    </View>
  );
};

const styles = StyleSheet.create({
  vectorIcon: {
    width: 20,
    height: 20,
  },
  searchPictureProduct: {
    flex: 1,
    fontSize: FontSize.labelMediumBold_size,
    fontFamily: FontFamily.typographyLabelLarge,
    textAlign: "left",
    marginLeft: 10,
  },
  dashboardsearchengineChild: {
    width: 25,
    height: 25,
  },
  dashboardsearchengine: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Border.br_81xl,
    flexDirection: "row",
    padding: 10,
    margin: 10,
  },
});

export default DashboardSearchEngine;
