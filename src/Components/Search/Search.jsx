import React, { useState } from 'react';
import axios from 'axios';
import { ApiUrl } from '../../config/config';
import { getAuth } from 'firebase/auth';

const Search = ({ onSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [noResults, setNoResults] = useState(false);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value.trim()) {
            setErrorMessage('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!searchTerm.trim()) {
            setErrorMessage('Ingrese un término de búsqueda.');
            setNoResults(false);
        } else {
            setErrorMessage('');
            setNoResults(false);

            try {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();
                const response = await axios.get(`${ApiUrl}/products/?name=${searchTerm}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    }
                  });
                const products = response.data;
                if (products.length === 0) {
                    setNoResults(true);
                } else {
                    setNoResults(false);
                }
                onSearchResults(products);
                console.log('Resultados de la búsqueda:', products);
            } catch (error) {
                console.error('Error al buscar productos:', error);
                setErrorMessage('Ocurrió un error al realizar la búsqueda.');
                setNoResults(false);
            }
        }
    };

    return (
        <div>
            <form className="max-w-md mx-auto mt-2" onSubmit={handleSubmit}>
                <label htmlFor="default-search" className="mb-2 text-xs font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <input
                        type="search"
                        id="default-search"
                        className="block w-full pl-3 pr-10 py-2 text-xs text-gray-900 border focus:outline-none focus:border-gray-300 focus:ring-gray-300 focus:ring-1 rounded-lg bg-white dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Buscar por ej. mesa..."
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                    <button
                        type="submit"
                        className="text-white absolute right-2 top-1 bg-white-700 focus:outline-none font-medium rounded-lg text-sm py-1 dark:bg-gray-600 dark:hover:bg-gray-700"
                    >
                        <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </button>
                    {errorMessage && (
                        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                    )}
                </div>
                <style jsx>{`
                    input[type="search"]::-webkit-search-cancel-button {
                        -webkit-appearance: none;
                        appearance: none;
                    }
                `}</style>
            </form>
            {noResults && (
                <p className="text-gray-700 text-center mt-4">No se encontraron resultados para la búsqueda.</p>
            )}
        </div>
    );
};

export default Search;
