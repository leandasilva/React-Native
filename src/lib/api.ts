// src/api/postsApi.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://api-posts-9i6e.onrender.com", // cambia si tu backend corre en otra URL/puerto
  // timeout, headers, etc si necesitás
});

export const fetchPostsAPI = () => api.get("/posts");
export const createPostAPI = (formData: FormData) => api.post("/addposts", formData);
export const updatePostAPI = (id: string, data: any) => api.put(`/updateposts/${id}`, data);
export const deletePostAPI = (id: string) => api.delete(`/removeposts/${id}`);
