const environment = import.meta.env.VITE_ENVIRONMENT;
const productionUrl= import.meta.env.VITE_PRODUCTION_URL;
console.log(environment)

const ApiUrl = environment === "prod" ? productionUrl : environment === "dev" ? "http://localhost:3000" : null;

export { ApiUrl };
