import React from 'react';
import Card from '../Cards/Card';
import { useNavigate } from 'react-router-dom';

function CardsContainer({ products }) {
    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/detail/${id}`);
    };

    // Función para convertir float a string en formato 3.000.000,00
    function floatToString(num) {
        // Separar la parte entera y decimal
        const numStr = num.toFixed(2).toString();
        let parts = numStr.split('.');
        let integerPart = parts[0];
        let decimalPart = parts[1];

        // Agregar comas cada tres dígitos a la parte entera
        let integerPartWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combinar la parte entera con comas y la parte decimal con una coma
        return `${integerPartWithCommas},${decimalPart}`;
    }

    return (
        <div className="container mx-auto p-4">
            {products.length === 0 ? (
                <div className="text-center text-xl">No hay productos para mostrar.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4">
                    {products.map(product => (
                        <Card
                            key={product.id}
                            id={product.id}
                            imagen={product.imagen_url || 'https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'}
                            nombre={product.nombre}
                            precio={`$${floatToString(parseFloat(product.precio))}`}
                            onClick={() => handleCardClick(product.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CardsContainer;
