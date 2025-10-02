const {default:axios}=require ("axios")

// const BASE_URL="http://localhost:8989";
// export const clientServer=axios.create({
    

export const BASE_URL="http://localhost:8989"
export const clientServer=axios.create({
    baseURL:BASE_URL
})