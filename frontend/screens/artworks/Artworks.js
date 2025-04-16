import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Dashboard from "../../components/header/Dashboard";
import FrameComponent from "../../components/FrameComponent";
import axios from "axios";
import { baseUrl } from "../../services/api";
import { ActivityIndicator } from "react-native";
import MyFlatList from "../../components/MyFlatList";

const Artworks = () => {
    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(false);
    const [artworks, setArtworks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const getArtworks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/artworks?page=${page}`);
            setArtworks(response.data.data);
            setTotalPages(response.data.pagination.total_pages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <FrameComponent key={item.id}
                onFramePressablePress={() => {
                    navigation.navigate('ArtworkDetail', { ID: item.id })
                }}
                frameImage={`https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`}
                title={item.title}
                text={item.thumbnail?.alt_text}
            />
        );
    };

    const handleLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };

    const loadMore = (p) => {
        if (p >= 1 && p <= totalPages) {
            setPage(p);
        }
    };

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

    useEffect(() => {
        getArtworks();
    }, [page]);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#22c55d" />
                </View>
            ) : (
                <Dashboard namePage={"Artworks"}>
                    <MyFlatList 
                        data={artworks} 
                        renderItem={renderItem}
                        isLoading={isLoading} 
                        handleLoading={handleLoading}
                        renderPaginationButtons={renderPaginationButtons} 
                        paddingBottom={257}
                    />
                </Dashboard>
            )}
        </View>
    );
};

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

export default Artworks;
