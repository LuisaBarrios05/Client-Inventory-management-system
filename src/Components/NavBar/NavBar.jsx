import { Link } from 'react-router-dom';
import logo from '../../assets/images/logoletrablanca.png';
import Perfil from '../Perfil/Perfil';
const NavBar = () => {
    return (
        <nav className="relative flex w-custom-nav max-w-screen-xl h-20 mt-6 mx-auto items-center justify-between bg-navBar py-2 shadow-dark-mild dark:bg-neutral-700 lg:py-4">
            <div className="flex w-full items-center justify-between px-3">
                <div className="flex items-center h-full">
                    <Link to="/home" className="flex items-center h-full" href="#">
                        <img
                            src={logo}
                            className="h-28 max-h-full max-w-full object-contain"
                            alt="TE Logo"
                            loading="lazy"
                            style={{ maxHeight: '100%' }}
                        />
                    </Link>
                </div>
                <div>
                    <Perfil />
                </div>
            </div>
        </nav>
    )
}
export default NavBar;