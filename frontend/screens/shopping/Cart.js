import React, { useState, useEffect } from "react";
import { useNavigation, useTheme } from "@react-navigation/native"
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import { baseUrl } from "../../services/api";
import Dashboard from "../../components/header/Dashboard";
import ProductCart from "../../components/product/ProductCart";
import MyFlatList from "../../components/MyFlatList";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import { Color, FontFamily, FontSize, Padding, Border } from "../../GlobalStyles";

const Cart = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [ isLoading, setLoading ] = useState(false);
    const [ products, setProducts ] = useState([]);
    //pagination
    const [ page, setPage ] = useState(1);
    const [ numberOfProduct, setNumberOfProduct ] = useState(0);
    const [ totalPrice, setTotalPrice ] = useState(0);

    const getProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/products?page=${page}`);
            const firstFiveProducts = response.data.data.slice(0, 10);
            const productsWithAmount = firstFiveProducts.map(item => ({ ...item, amount: 1 }));
            setProducts(productsWithAmount);
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
        const maxButtonsToShow = 5;
        let startPage = Math.max(1, page - Math.floor(maxButtonsToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

        if (endPage - startPage + 1 < maxButtonsToShow) {
            startPage = Math.max(1, endPage - maxButtonsToShow + 1);
        }

        const buttons = [];

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => loadMore(i)}
                    style={[
                        styles.paginationButton,
                        i === page ? styles.activeButton : null,
                    ]}>
                    <Text style={{ color: 'white' }}>{i}</Text>
                </TouchableOpacity>,
            );
        }

        return buttons;
    };

    const updateCart = () => {
        const count = products.reduce((count, item) => count += parseInt(item.amount), 0);
        const total = Math.round(100 * products.reduce((sum, item) => sum + item.max_current_price * item.amount, 0)) / 100;

        setNumberOfProduct(count);
        setTotalPrice(total);
    }

    useEffect(() => {
        getProducts();
    }, [ page ]);

    useEffect(() => {
        updateCart();
    }, [ products ]);

    const handleAmountChange = (id, newAmount) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id ? { ...product, amount: newAmount } : product
            )
        );
        updateCart();

    }

    const renderItem = ({ item }) => {
        return (
            <ProductCart key={item.id}
                id={item.id}
                title={item.title}
                text={"Product"}
                price={item.max_current_price}
                image={item.image_url}
                amount={item.amount}
                onAmoutChange={handleAmountChange}
            >
            </ProductCart>
        )
    }

    // Add to the styles object
    return (
        <View style={{ flex: 1, position: 'relative' }}>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <>
                    <Dashboard namePage={"Carts"}>
                        <View style={{ height: "100%", }}>
                            <MyFlatList
                                data={products}
                                renderItem={renderItem}
                                isLoading={isLoading}
                                handleLoading={handleLoading}
                                renderPaginationButtons={() => <View style={{ paddingBottom: 400 }}></View>}
                            />
                        </View>
                    </Dashboard>

                    <View style={styles.bottomWrapper}>
                        <View style={[ styles.totalContainer, { backgroundColor: colors.surfaceContainerHigh, shadowColor: colors.primaryShadow } ]}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={styles.text1}>Number of products</Text>
                                <Text style={[ styles.text1, { color: colors.onSurface } ]}>{numberOfProduct}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                                <Text style={styles.text2}>Total</Text>
                                <Text style={[ styles.text2, { color: colors.onSurface } ]}>${totalPrice}</Text>
                            </View>
                            <ButtonPrimary
                                text={"Pay now"}
                                buttonPrimaryMarginTop={30}
                                onPressButton={() => navigation.navigate("Payment", { Amount: numberOfProduct, Price: totalPrice })}
                            />
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    text1: {
        fontFamily: FontFamily.typographyLabelLarge,
        fontSize: FontSize.labelLargeBold_size,
        color: Color.primaryPrimaryFixed
    },
    text2: {
        fontFamily: FontFamily.labelMediumBold,
        fontSize: FontSize.labelLargeBold_size,
        color: Color.primaryPrimaryFixed
    },
    bottomWrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        zIndex: 999,
        backgroundColor: 'transparent',
    },
    totalContainer: {
        width: "100%",
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowRadius: 20,
        elevation: 5,
        shadowOpacity: 0.5,
        borderRadius: Border.br_3xs,
        padding: Padding.p_3xs,
    },
});

export default Cart;