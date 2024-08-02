
const Card = ({id, imagen, nombre, precio, onClick}) => {
    return (
        <div class="w-40 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" onClick={onClick}>
            <a href="#">
                <div className='p-2.5'>
                <img class="object-cover w-full max-h-32 rounded " src={imagen} alt={nombre}  />
                </div>
            
            <div class="px-2">
                <a href="#">
                    <h5 class="mb-2 text-sm font-medium tracking-tight text-gray-900 dark:text-white">{nombre}</h5>
                </a>
                <hr className="border-black my-1 pb-1" />
                <p class="mb-2 font-bold  text-lg text-gray-700 dark:text-gray-400 text-right">{precio}</p>
            </div>
            </a>
        </div>

    )
}
export default Card