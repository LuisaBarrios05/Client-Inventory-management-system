import React, { useState, useEffect } from 'react';
import CardsContainer from "../../Components/Cards/CardsContainer"
import Filters from "../../Components/Filters/Filters"
import Search from "../../Components/Search/Search"
import axios from 'axios';
import { ApiUrl } from "../../config/config"

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setHasError(false);
            try {
                const response = await axios.get(`${ApiUrl}/products/`);
                console.log(response)
                setProducts(response.data);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleSearchResults = (results) => {
        setProducts(results);
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex justify-between items-center p-2">
                <div className="flex-1 ">
                    <Search onSearchResults={handleSearchResults} />
                </div>
                <div className="ml-4">
                    <Filters setProducts={setProducts} />
                </div>
            </div>
            {isLoading ? (
                <div className="text-center text-xl">Cargando...</div>
            ) : hasError ? (
                <div className="text-center text-xl text-red-500">Ocurrió un error al cargar los productos.</div>
            ) : (
                <CardsContainer products={products} />
            )}
        </div>
    );
}

export default Products;
