import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
//import { auth } from '../../firebase';
import { getAuth } from 'firebase/auth';
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

Modal.setAppElement('#root'); 

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    image: '',
    name: '',
    categoria: '',
    material: '',
    cantidad: '',
    medidas: { alto: '', ancho: '', profundidad: '' },
    color: '',
    price: '',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    // Normalizar el uso de punto para separador decimal y eliminar separadores de miles
    price = price.replace(/,/g, '.').replace(/\s/g, '');
  
    // Encontrar el índice del último punto decimal
    const lastDotIndex = price.lastIndexOf('.');
  
    if (lastDotIndex !== -1 && price.length - lastDotIndex - 1 > 2) {
      // Si hay más de dos dígitos después del último punto decimal, eliminar el punto
      price = price.replace('.', '');
    } else {
      // Si no, eliminar todos los puntos excepto el de la posición lastDotIndex
      price = price.slice(0, lastDotIndex).replace(/\./g, '') + price.slice(lastDotIndex);
    }
  
    // Convertir a número y luego a cadena para eliminar ceros no significativos
    let formattedPrice = parseFloat(price).toString();
  
    // Si es un número entero, no añadir decimales
    if (!formattedPrice.includes('.')) {
      return formattedPrice;
    }
  
    // Asegurarse de que tiene dos decimales si tiene parte decimal
    return parseFloat(formattedPrice).toFixed(2);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jfif'];
      if (!validTypes.includes(file.type)) {
        setImageError('Solo se permiten archivos JPEG, PNG, GIF o WEBP.');
        setImage(null);
        setImagePreview(null);
      } else if (file.size > 20 * 1024 * 1024) {
        setImageError('El archivo no debe superar los 20MB.');
        setImage(null);
        setImagePreview(null);
      } else {
        setImageError('');
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    const extendedNamePattern = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\-_\. ]*$/;
    const lettersWithAccents = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/;
    const numbersOnly = /^\d*$/;
    const pricePattern = /^[\d,.]*$/;
  
    if (name.includes('medidas')) {
      const [_, key] = name.split('.');
      if (numbersOnly.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          medidas: {
            ...prevData.medidas,
            [key]: value,
          },
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Solo se permiten números.',
        }));
      }
    } else if (name === 'material' || name === 'color') {
      if (lettersWithAccents.test(value)) {
        setFormData({ ...formData, [name]: value });
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Solo se permiten letras y espacios.',
        }));
      }
    } else if (name === 'name' || name === 'categoria') {
      if (extendedNamePattern.test(value)) {
        setFormData({ ...formData, [name]: value });
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'No se permiten caracteres especiales.',
        }));
      }
    } else if (name === 'cantidad') {
      if (numbersOnly.test(value)) {
        setFormData({ ...formData, [name]: value });
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Solo se permiten números.',
        }));
      }
    } else if (name === 'price') {
      if (pricePattern.test(value)) {
        setFormData({ ...formData, [name]: value });
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Solo se permiten números, comas y puntos.',
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'El nombre es requerido.';
    if (!formData.categoria) newErrors.categoria = 'La categoría es requerida.';
    if (!formData.cantidad) newErrors.cantidad = 'La cantidad es requerida.';
    if (!formData.price) newErrors.price = 'El precio es requerido.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('imagen', image);
      formDataToSubmit.append('nombre', formData.name);
      formDataToSubmit.append('categoria', formData.categoria);
      formDataToSubmit.append('material', formData.material);
      formDataToSubmit.append('cantidad', formData.cantidad);
      formDataToSubmit.append('medidas_alto', formData.medidas.alto);
      formDataToSubmit.append('medidas_ancho', formData.medidas.ancho);
      formDataToSubmit.append('medidas_profundidad', formData.medidas.profundidad);
      formDataToSubmit.append('color', formData.color);
      formDataToSubmit.append('precio', formatPrice(formData.price));

      setIsLoading(true);
      setHasError(false);
      try {
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken();
        await axios.post(`${ApiUrl}/create/`, formDataToSubmit, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center mt-5">
      <div className="bg-white rounded-lg shadow-lg p-7 max-w-[620px] h-auto">
        <div className="text-center mb-4">
          <p className="text-2xl font-bold">Crear Producto</p>
        </div>
        <hr className="border-gray my-1 pb-1" />
        {isLoading && <div className="text-center text-xl">Cargando...</div>}
        {hasError && <div className="text-center text-xl text-red-500">Ocurrió un error al guardar el producto.</div>}
        <Modal
          isOpen={showSuccessMessage}
          onRequestClose={() => setShowSuccessMessage(false)}
          style={customStyles}
          contentLabel="Mensaje de éxito"
        >
          <p>Producto creado exitosamente.</p>
        </Modal>
        <div className="grid grid-cols-2">
          <div className="col-span-1 flex justify-center items-center">
            <label htmlFor="image" className="relative cursor-pointer">
              <div className="w-48 h-64 bg-gray-200 flex justify-center items-center rounded-md">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-11">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                )}
              </div>
              <input type="file" id="image" name="image" className="hidden" onChange={handleImageChange} />
            </label>
            {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
          </div>
          <div className="col-span-1 space-y-2">
            <div className="flex items-center">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 w-32">Nombre</label>
              <input type="text" id="name" name="name" className="border px-3 py-0.8 w-full" value={formData.name} onChange={handleChange} />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            <div className="flex items-center">
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 w-32">Categoría</label>
              <select id="categoria" name="categoria" className="border px-3 py-0.8 w-full" value={formData.categoria} onChange={handleChange}>
                <option value="">Seleccione una categoría</option>
                <option value="Electrodomésticos">Electrodomésticos</option>
                <option value="Muebles">Muebles</option>
                <option value="Comedor">Comedor</option>
                <option value="Living">Living</option>
                <option value="Bases">Bases</option>
                <option value="Colchones">Colchones</option>
                <option value="Deco">Deco</option>
                <option value="Combos">Combos</option>
              </select>
            </div>
            {errors.categoria && <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>}
            <div className="flex items-center">
              <label htmlFor="material" className="block text-sm font-medium text-gray-700 w-32">Material</label>
              <input type="text" id="material" name="material" className="border px-3 py-0.8 w-full" value={formData.material} onChange={handleChange} />
            </div>
            {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material}</p>}
            <div className="flex items-center">
              <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 w-32">Cantidad</label>
              <input type="text" id="cantidad" name="cantidad" className="border px-3 py-0.8 w-full" value={formData.cantidad} onChange={handleChange} />
            </div>
            {errors.cantidad && <p className="text-red-500 text-sm mt-1">{errors.cantidad}</p>}
            <div className="flex items-start">
              <label htmlFor="medidas.alto" className="block text-sm font-medium text-gray-700 w-32">Medidas</label>
              <div className="flex flex-col space-y-1 w-full">
                <div className="relative">
                  <input type="text" id="medidas.alto" name="medidas.alto" placeholder="Alto" className="border text-xs px-3 py-1 w-full pr-10" value={formData.medidas.alto} onChange={handleChange} />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">cm</span>
                </div>
                {errors['medidas.alto'] && <p className="text-red-500 text-sm mt-1">{errors['medidas.alto']}</p>}
                <div className="relative">
                  <input type="text" id="medidas.ancho" name="medidas.ancho" placeholder="Ancho" className="border text-xs px-3 py-1 w-full pr-10" value={formData.medidas.ancho} onChange={handleChange} />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">cm</span>
                </div>
                {errors['medidas.ancho'] && <p className="text-red-500 text-sm mt-1">{errors['medidas.ancho']}</p>}
                <div className="relative">
                  <input type="text" id="medidas.profundidad" name="medidas.profundidad" placeholder="Profundidad" className="border text-xs px-3 py-1 w-full pr-10" value={formData.medidas.profundidad} onChange={handleChange} />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">cm</span>
                </div>
                {errors['medidas.profundidad'] && <p className="text-red-500 text-sm mt-1">{errors['medidas.profundidad']}</p>}
              </div>
            </div>
            {errors.medidas && <p className="text-red-500 text-sm mt-1">{errors.medidas}</p>}
            <div className="flex items-center">
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 w-32">Color</label>
              <input type="text" id="color" name="color" className="border px-3 py-0.8 w-full" value={formData.color} onChange={handleChange} />
            </div>
            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
            <hr className="border-gray my-1 pb-1" />
            <div className="flex flex-col">
              <label htmlFor="price" className="block text-lg font-semibold text-gray-800 m-2">Precio Total</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                <input type="text" id="price" name="price" className="border px-3 py-0.8 pl-8 w-full" value={formData.price} onChange={handleChange} />
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>
        </div>
        <div className="text-center mt-5 flex justify-center space-x-4">
          <button type="submit" className="bg-black hover:bg-black-600 text-white font-semibold py-2 px-16 rounded-lg" disabled={isLoading} onClick={handleSubmit}>
            Guardar
          </button>
          <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-16 rounded-lg" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
