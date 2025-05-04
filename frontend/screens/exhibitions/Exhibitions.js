import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Dashboard from "../../components/header/Dashboard";
import FrameComponent from "../../components/FrameComponent";
import { ActivityIndicator } from "react-native";
import axios from "axios";
import { baseUrl } from "../../services/api";
import MyFlatList from "../../components/MyFlatList";

const Exhibitions = () => {
  const navigation = useNavigation();

  const [ isLoading, setLoading ] = useState(false);
  const [ exhibitions, setExhibitions ] = useState([]);
  //pagination
  const [ page, setPage ] = useState(1);
  const [ totalPages, setTotalpages ] = useState(0);

  const getExhibitions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/exhibitions?page=${page}`);
      setExhibitions(response.data.data);
      setTotalpages(response.data.pagination.total_pages);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const loadMore = (p) => setPage(p);

  const renderPaginationButtons = () => {
    if (totalPages === 0) return null;

    const maxButtonsToShow = 5;
    let startPage = 1;
    const half = Math.floor(maxButtonsToShow / 2);

    if (totalPages > maxButtonsToShow) {
      if (page <= half + 1) {
        startPage = 1;
      } else if (page >= totalPages - half) {
        startPage = totalPages - maxButtonsToShow + 1;
      } else {
        startPage = page - half;
      }
    }

    const endPage = Math.min(startPage + maxButtonsToShow - 1, totalPages);

    const buttons = [];

    // ← nút trái
    buttons.push(
      <TouchableOpacity
        key="prev"
        onPress={() => loadMore(page - 1)}
        style={styles.arrowButton}
        disabled={page === 1}
      >
        <Text style={styles.arrowText}>{'←'}</Text>
      </TouchableOpacity>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          onPress={() => loadMore(i)}
          style={[
            styles.pageButton,
            i === page && styles.activePageButton,
          ]}
        >
          <Text
            style={[
              styles.pageButtonText,
              i === page && styles.activePageButtonText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    // → nút phải
    buttons.push(
      <TouchableOpacity
        key="next"
        onPress={() => loadMore(page + 1)}
        style={styles.arrowButton}
        disabled={page === totalPages}
      >
        <Text style={styles.arrowText}>{'→'}</Text>
      </TouchableOpacity>
    );

    return (
      <View style={styles.paginationContainer}>
        {buttons}
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <FrameComponent key={item.id}
        onFramePressablePress={() => {
          navigation.navigate('ExhibitionDetail', { ID: item.id })
        }}
        frameImage={item.image_url ? item.image_url : "https://artic-web.imgix.net/7346bacd-9c74-471c-9a33-a45e963d9828/exh_Global-View_main_1_480.jpg?auto=compress%2Cformat&fit=min&fm=jpg&q=80&rect=%2C%2C%2C"}
        title={item.title}
      />
    )
  }

  useEffect(() => {
    getExhibitions();
  }, [ page ]);

  return (
    <View className={'flex-1'}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Dashboard namePage={"Exhibitions"}>
          <MyFlatList data={exhibitions} renderItem={renderItem}
            isLoading={isLoading} handleLoading={handleLoading}
            renderPaginationButtons={renderPaginationButtons} 
            paddingBottom={420}
            />
        </Dashboard>
      )}
    </View>
  );
};

export default Exhibitions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingBottom: 25,
    marginBottom: 50,
  },
  pageButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#808080',
    marginHorizontal: 5,
  },
  activePageButton: {
    backgroundColor: '#22c55d',
  },
  pageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  activePageButtonText: {
    fontWeight: 'bold',
  },
  arrowButton: {
    paddingHorizontal: 5,
    paddingBottom: 5,
    backgroundColor: '#d1d5db',
    borderRadius: 20,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
