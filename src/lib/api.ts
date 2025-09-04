import axios from 'axios';

export const api = axios.create({
  // Cambiá por tu API. JSONPlaceholder para pruebas:
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});
