import { useState, useEffect, useRef } from 'react';
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
    width: '320px',
    height: '280px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

Modal.setAppElement('#root');

const Filters = ({ setProducts }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('');
  const [percentage, setPercentage] = useState('');
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const inputRef = useRef(null);


  const loadProducts = () => {
    if (selectedFilters.length > 0) {
      const categoria = selectedFilters.join(',');
      axios.get(`${ApiUrl}/products/?category=${categoria}`)
        .then(response => {
          setProducts(response.data);
          console.log("Products reloaded after price update", response.data);
        })
        .catch(error => {
          console.error('Error reloading products:', error);
        });
    }
  };
  const applyPriceChange = async (action) => {
    if (percentage === '') {
      alert('Por favor ingresa un porcentaje válido');
      return;
    }

    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      await axios.put(`${ApiUrl}/update-cost-categories`, {
        percentage: parseFloat(percentage),
        category: currentFilter,
        action: action
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccessMessage(`Precios de la categoría ${currentFilter} ${action === 'aumentar' ? 'aumentados' : 'disminuidos'} en un ${percentage}%.`);
      setSuccessModalIsOpen(true);
      setTimeout(() => {
        setSuccessModalIsOpen(false);
        loadProducts()
      }, 2500);

      closeModal();
    } catch (error) {
      console.error('Error updating prices:', error);
      alert('Ocurrió un error al actualizar los precios');
    }
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (!event.target.closest('#dropdown') && !event.target.closest('#dropdownDefault')) {
        setDropdownVisible(false);
      }
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (selectedFilters.length > 0) {
      const categoria = selectedFilters.join(',');
      axios.get(`${ApiUrl}/products/?category=${categoria}`)
        .then(response => {
          setProducts(response.data);
          console.log("get realizado", response.data);
        })
        .catch(error => {
        });
    }
  }, [selectedFilters, setProducts]);

  const handleCheckboxChange = (event) => {
    const filter = event.target.id;
    setSelectedFilters((prev) =>
      event.target.checked ? [...prev, filter] : prev.filter((item) => item !== filter)
    );
  };

  const openModal = (filter) => {
    setCurrentFilter(filter);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handlePercentageChange = (event) => {
    const value = event.target.value.replace('%', '');
    if (/^\d*$/.test(value)) {
      setPercentage(value);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      const length = percentage.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [percentage]);

  return (
    <div className="relative border bg-white">
      <button
        id="dropdownDefault"
        onClick={() => setDropdownVisible(!dropdownVisible)}
        data-dropdown-toggle="dropdown"
        className="text-dark bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-xs px-2 py-2 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        type="button"
      >
        Filtrar
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {/* drop menu */}
      <div
        id="dropdown"
        className={`absolute top-full right-0 z-10 ${dropdownVisible ? 'block' : 'hidden'} w-56 p-3 bg-white shadow dark:bg-gray-700`}
      >
        <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Categorías</h6>
        <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
          <li className="flex items-center">
            <input
              id="Electrodomésticos"
              type="checkbox"
              value="Electrodomésticos"
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="Electrodomésticos" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Electrodomésticos
            </label>
            {selectedFilters.includes('Electrodomésticos') && (
              <span
                className="ml-2 text-sm font-medium text-blue-600 cursor-pointer"
                onClick={() => openModal('Electrodomésticos')}
              >
                Editar
              </span>
            )}
          </li>

          <li className="flex items-center">
            <input
              id="Muebles"
              type="checkbox"
              value="Muebles"
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="Muebles" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Muebles
            </label>
            {selectedFilters.includes('Muebles') && (
              <span
                className="ml-2 text-sm font-medium text-blue-600 cursor-pointer"
                onClick={() => openModal('Muebles')}
              >
                Editar
              </span>
            )}
          </li>

          <li className="flex items-center">
            <input
              id="Comedor"
              type="checkbox"
              value="Comedor"
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="Comedor" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Comedor
            </label>
            {selectedFilters.includes('Comedor') && (
              <span
                className="ml-2 text-sm font-medium text-blue-600 cursor-pointer"
                onClick={() => openModal('Comedor')}
              >
                Editar
              </span>
            )}
          </li>

          <li className="flex items-center">
            <input
              id="Living"
              type="checkbox"
              value="Living"
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="Living" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Living
            </label>
            {selectedFilters.includes('Living') && (
              <span
                className="ml-2 text-sm font-medium text-blue-600 cursor-pointer"
                onClick={() => openModal('Living')}
              >
                Editar
              </span>
            )}
          </li>

          <li className="flex items-center">
            <input
              id="Bases"
              type="checkbox"
              value="Bases"
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="Bases" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Bases
            </label>
            {selectedFilters.includes('Bases') && (
              <span
                className="ml-2 text-sm font-medium text-blue-600 cursor-pointer"
                onClick={() => openModal('Bases')}
              >
                Editar
              </span>
            )}
          </li>

          <li className="flex items-center">
            <input
              id="Colchones"
              type="checkbox"
              value="Colchones"
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="Colchones" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Colchones
            </label>
            {selectedFilters.includes('Colchones') && (
              <span
                className="ml-2 text-sm font-medium text-blue-600 cursor-pointer"
                onClick={() => openModal('Colchones')}
              >
                Editar
              </span>
            )}
          </li>

          <li className="flex items-center">
            <input
              id="Deco"
              type="checkbox"
              value="Deco"
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="Deco" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Deco
            </label>
            {selectedFilters.includes('Deco') && (
              <span
                className="ml-2 text-sm font-medium text-blue-600 cursor-pointer"
                onClick={() => openModal('Deco')}
              >
                Editar
              </span>
            )}
          </li>

          <li className="flex items-center">
            <input
              id="Combos"
              type="checkbox"
              value="Combos"
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="Combos" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Combos
            </label>
            {selectedFilters.includes('Combos') && (
              <span
                className="ml-2 text-sm font-medium text-blue-600 cursor-pointer"
                onClick={() => openModal('Combos')}
              >
                Editar
              </span>
            )}
          </li>
        </ul>
      </div>

      {/* Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Editar Filtro" style={customStyles}>
        <h2>Editar {currentFilter}</h2>
        <label htmlFor="percentage">Porcentaje:</label>
        <div className="relative">
          <input
            type="text"
            id="percentage"
            ref={inputRef}
            value={percentage}
            onChange={handlePercentageChange}
            placeholder="0"
            className="ml-2 border border-gray-400 rounded p-1 pr-10"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
        </div>
        <div className="flex justify-center mt-4">
          <button onClick={() => applyPriceChange('aumentar')} className="ml-2 bg-black text-white px-4 py-2 rounded">
            Aumentar
          </button>
          <button onClick={() => applyPriceChange('disminuir')} className="ml-2 bg-black text-white px-4 py-2 rounded">
            Disminuir
          </button>
          <button onClick={closeModal} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={successModalIsOpen}
        onRequestClose={() => setSuccessModalIsOpen(false)}
        style={customStyles}
        contentLabel="Éxito"
      >
        <h2>¡Éxito!</h2>
        <p>{successMessage}</p>
      </Modal>


    </div>
  );
};

export default Filters;
