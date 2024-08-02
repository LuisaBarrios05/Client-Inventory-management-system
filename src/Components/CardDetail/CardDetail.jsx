import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../../Hooks/useAuth';
import { ApiUrl } from '../../config/config';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    textAlign: 'center',
    borderRadius: '10px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

Modal.setAppElement('#root'); // Set the root element for the modal

const CardDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [discount, setDiscount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showModalAdmin, setShowModalAdmin] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const formatNumber = (number) => {
    // Asegurarse de que el número tenga dos decimales
    let formattedNumber = number.toFixed(2);
  
    // Dividir la parte entera de la parte decimal
    let [integerPart, decimalPart] = formattedNumber.split('.');
  
    // Agregar puntos como separadores de miles
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
    // Combinar la parte entera y la parte decimal
    formattedNumber = `${integerPart},${decimalPart}`;
  
    return formattedNumber;
  };
  // GET PRODUCTS DETAIL
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/detail/${id}`);
        console.log(response);
        const productData = response.data;

        const medidas = productData.product.medidas
          ? `${productData.product.medidas.ancho} x ${productData.product.medidas.altura} x ${productData.product.medidas.profundidad}`
          : 'Sin información';

        const updatedProduct = {
          ...productData,
          product: {
            ...productData.product,
            imagen_url: productData.product.imagen_url || 'https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
            material: productData.product.material || 'Sin información',
            color: productData.product.color || 'Sin información',
            medidas: medidas,
          },
        };

        setProduct(updatedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Cargando...</div>;
  }

  const handleEditClick = () => {
    if (!isAdmin) {
      setShowModalAdmin(true);
      setTimeout(() => {
        setShowModalAdmin(false);
      }, 2000);
    } else {
      navigate(`/edit/${id}`);
    }
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  // DELETE
  const confirmDelete = async () => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      const response = await axios.delete(`${ApiUrl}/delete-product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Product deleted successfully!');
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate('/products');
      }, 2000);
      console.log(response.status);
    } catch (error) {
      console.error('Error deleting product:', error);
      setShowModalAdmin(true);
    }
    setShowModal(false);
    setTimeout(() => {
      setShowModalAdmin(false);
    }, 2000);
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setDiscount(value);
    }
  };

  const calculateDiscountedPrice = () => {
    if (!discount) return product.product.precio;
    const discountValue = (product.product.precio * (discount / 100));
    const discountedPrice = (product.product.precio - discountValue);
    return discountedPrice;
  };

  return (
    <div className="relative flex max-w-screen-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden w-full h-full mt-5 p-5">
      {/* Botón de eliminar */}
      <div className="absolute top-2 right-2 flex space-x-3.5">
        <button
          className="bg-white text-black rounded-md border border-gray-400 shadow-md p-1 hover:bg-gray-100 transition duration-200"
          onClick={handleDeleteClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
        {/* Botón de edición */}
        <button
          className="bg-white text-black rounded-md border border-gray-400 shadow-md p-1 hover:bg-gray-100 transition duration-200"
          onClick={handleEditClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
      </div>
      {/* Modal de eliminación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="bg-white p-6 rounded-lg z-10">
            <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar este producto?</p>
            <div className="flex justify-end mt-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={confirmDelete}>
                Confirmar
              </button>
              <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={cancelDelete}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de eliminación */}
      {showModalAdmin && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="bg-white p-6 rounded-lg z-10">
            <h2 className="text-lg font-bold mb-4">Acceso no permitido</h2>
            <p>No tienes los permisos para hacer esta acción.</p>
          </div>
        </div>
      )}
      {/* Modal de éxito */}
      <Modal
        isOpen={showSuccessMessage}
        onRequestClose={() => setShowSuccessMessage(false)}
        style={customStyles}
        contentLabel="Mensaje de éxito"
      >
        <p>Producto eliminado exitosamente.</p>
      </Modal>
      {/* Imagen del producto */}
      <div className="w-1/3">
        <img src={product.product.imagen_url} alt="Product" className="w-full h-full object-cover p-2" />
      </div>
      {/* Detalles del producto */}
      <div className="w-1/3 p-4 border-r border-gray-300">
        <h2 className="text-xl font-bold text-gray-900 mt-1">{product.product.nombre}</h2>
        <hr className="border-gray my-1 pb-1" />
        <div className="flex items-center mt-2">
          <p className="text-sm font-medium text-gray-900">Categoría</p>
          <p className="ml-2 text-sm text-gray-500">{product.product.categoria}</p>
        </div>
        <div className="flex items-center mt-2">
          <p className="text-sm font-medium text-gray-900">Material</p>
          <p className="ml-2 text-sm text-gray-500">{product.product.material}</p>
        </div>
        <div className="flex items-center mt-2">
          <p className="text-sm font-medium text-gray-900">Cantidad</p>
          <p className="ml-2 text-sm text-gray-500">{product.product.cantidad}</p>
        </div>
        <div className="flex items-center mt-2">
          <p className="text-sm font-medium text-gray-900">Color</p>
          <p className="ml-2 text-sm text-gray-500">{product.product.color}</p>
        </div>
        <div className="flex items-center mt-2">
          <p className="text-sm font-medium text-gray-900">Medidas</p>
          <p className="ml-2 text-sm text-gray-500">{product.product.medidas}</p>
        </div>
      </div>
      {/* Costos producto */}
      <div className="w-1/3 p-4 flex flex-col justify-between">
        <div className="border mt-3.5 p-2 mb-8 flex flex-col items-center">
          <div className="flex items-center mt-2">
            <p className="text-base text-base font-bold text-gray-900">Precio Total </p>
            <p className="ml-2 text-lg font-bold text-gray-900">${formatNumber(product.product.precio)}</p>
          </div>
        </div>
        <div className="mt-auto space-y-5">
          {Object.entries(product).map(([key, value]) => {
            if (key !== 'product') {
              return (
                <div className="flex items-center" key={key}>
                  <p className="text-sm text-gray-900">{key}</p>
                  <p className="ml-2 text-sm text-gray-500">${formatNumber(value)}</p>
                </div>
              );
            }
            return null;
          })}
          <hr className="border-gray my-1 pb-1" />
          <div className="flex items-center">
            <label htmlFor="discount" className="text-sm font-medium text-gray-900">Descuento de la casa</label>
            <div className="relative w-32  ml-7">
              <input
                type="text"
                id="discount"
                name="discount"
                className="border px-3 py-0.8 w-full pr-10"
                value={discount}
                onChange={handleDiscountChange}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-900 mt-2">Precio con descuento: ${formatNumber(calculateDiscountedPrice())}</p>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
