import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logoletranegra.png';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const FormLogin = () => {
    const [values, setValues] = useState({
        usuario: '',
        contraseña: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setHasError(false);
        try {

            await signInWithEmailAndPassword(auth, values.usuario, values.contraseña);
            navigate('/home');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-center px-6 py-8 mx-auto h-screen">
                {/* logo */}
                <div className="md:w-1/2">
                    <img src={logo} alt="Logo D'vano Kassandra" className="w-4/6 h-full object-cover rounded-l-lg" />
                </div>
                {/* form */}
                <div className="md:w-1/3 h-5/6 flex items-center justify-center w-full max-w-4xl bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
                    <div className='w-full h-full p-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg'>
                        <h1 className="text-xl md:text-xl lg:text-3xl font-bold text-center leading-tight tracking-tight text-gray-900 dark:text-white p-1 my-1 mb-5">
                            Inicie Sesión
                        </h1>
                        <form className="" onSubmit={handleSubmit}>
                            <div className='space-y-3'>
                                <div>
                                    <label htmlFor="usuario" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuario</label>
                                    <input
                                        type="text"
                                        name="usuario"
                                        id="usuario"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Juan01"
                                        required
                                        value={values.usuario}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contraseña" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                                    <input
                                        type="contraseña"
                                        name="contraseña"
                                        id="contraseña"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                        value={values.contraseña}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className='flex justify-center mt-8'>
                                <button type="submit" className="w-10/12 text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-2xl text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    {isLoading ? 'Cargando...' : 'Ingresar'}
                                </button>
                            </div>
                        </form>
                        {hasError && <p className="text-red-500 text-center mt-4">Ocurrió un error al iniciar sesión.</p>}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FormLogin;
