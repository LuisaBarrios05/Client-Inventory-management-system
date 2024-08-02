import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
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

const CostPercentages = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${ApiUrl}/cost-percentages`);
        const responseData = response.data;
        setFormData({
          ...responseData
        });
      } catch (error) {
        console.error('Error fetching the costs', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numbersOnly = /^\d*$/;

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
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) newErrors[key] = 'El porcentaje es requerido.';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setHasError(false);
      try {
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken();
        await axios.put(`${ApiUrl}/update-cost-percentage/`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } catch (error) {
        console.error('Error aplicando los porcentajes.');
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white rounded-lg shadow-lg p-7 max-w-[620px] h-auto">
        <div className="text-center mb-4">
          <p className="text-2xl font-bold">Aplicar Porcentajes de Costo</p>
        </div>
        <hr className="border-gray my-1 pb-1" />
        {isLoading && <div className="text-center text-xl">Cargando...</div>}
        {hasError && <div className="text-center text-xl text-red-500">Ocurrió un error al aplicar los porcentajes.</div>}
        <Modal
          isOpen={showSuccessMessage}
          onRequestClose={() => setShowSuccessMessage(false)}
          style={customStyles}
          contentLabel="Mensaje de éxito"
        >
          <p>Porcentajes aplicados exitosamente.</p>
        </Modal>
        <div className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div className="flex items-center" key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 w-48">{key.replace(/_/g, ' ')}</label>
              <div className="relative w-full">
                <input
                  type="text"
                  id={key}
                  name={key}
                  className="border px-3 py-0.8 w-full pr-10"
                  value={formData[key]}
                  onChange={handleChange}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
              </div>
              {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
            </div>
          ))}
        </div>
        <div className="text-center mt-5 flex justify-center space-x-4">
          <button type="submit" className="bg-black hover:bg-blue-600 text-white font-semibold py-2 px-16 rounded-lg" onClick={handleSubmit}>
            Aplicar
          </button>
          <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-16 rounded-lg" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostPercentages;
