import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from "react-native"
import Dashboard from "../../components/header/Dashboard"
import ProductShopping from "../../components/product/ProductShopping"
import { useEffect, useState } from "react";
import { baseUrl } from "../../services/api";
import axios from "axios";
import MyFlatList from "../../components/MyFlatList";

const Shopping = () => {

    const [ isLoading, setLoading ] = useState(false);
    const [ products, setProducts ] = useState([]);
    //pagination
    const [ page, setPage ] = useState(1);
    const [ totalPages, setTotalpages ] = useState(0);

    const getProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/products?page=${page}`);
            setProducts(response.data.data);
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

    useEffect(() => {
        getProducts();
    }, [ page ]);

    const renderItem = ({ item }) => {
        return (
            <ProductShopping key={item.id}
                id={item.id}
                title={item.title}
                text={"Product"}
                price={item.max_current_price}
                image={item.image_url}>
            </ProductShopping>
        )
    }

    return (
        <View className={'flex-1'}>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <Dashboard namePage={"Shopping"}>
                    <MyFlatList data={products} renderItem={renderItem}
                        isLoading={isLoading} handleLoading={handleLoading}
                        renderPaginationButtons={renderPaginationButtons} 
                        paddingBottom={440}    
                        />
                </Dashboard>
            )
            }
        </View>
    );
};

export default Shopping;

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
