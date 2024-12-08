export const path = "http://localhost:8080";

export const config = {
  baseURL: path,
  headers: {
    "Access-Control-Allow-Origin": `${path}`,
  },
  withCredentials: true,
};
console.log(config);
