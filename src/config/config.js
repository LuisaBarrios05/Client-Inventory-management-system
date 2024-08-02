// config.js
const environment = import.meta.env.VITE_ENVIRONMENT;
console.log(environment)

const ApiUrl = environment === "prod" ? "" : environment === "dev" ? "http://localhost:3000" : null;

export { ApiUrl };
