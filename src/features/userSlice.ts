// src/features/postsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deletePostAPI, fetchPostsAPI } from "../lib/api";

export interface Post {
  _id: string;
  text: string;
  image?: string | null;
}

interface PostsState {
  items: Post[];
  loading: boolean;
  error?: string | null;
}


export type UpdatePostPayload = {
  id: string;
  text: string;
  image?: string | File | Blob | null;
};



const initialState: PostsState = { items: [], loading: false, error: null };

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, text, image }: UpdatePostPayload) => {
    const formData = new FormData();
    formData.append('text', text);

    if (image) {
      formData.append('image', {
        uri: image,
        type: 'image/jpeg', // o el mime real
        name: 'photo.jpg',
      } as any);
    }

    const response = await fetch(`https://api-posts-9i6e.onrender.com/updateposts/${id}`, {
      method: 'PUT',
      body: formData,
      // 👇 fetch detecta FormData y no hace falta 'Content-Type'
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar: ${response.status}`);
    }

    return await response.json();
  }
);



export const fetchPosts = createAsyncThunk<Post[]>(
  "posts/fetchAll",
  async () => {
    const res = await fetchPostsAPI();
    return res.data.map((post: any) => ({
      _id: post._id,
      text: post.text,
      image: post.image ? `https://api-posts-9i6e.onrender.com${post.image}` : null, // ⚡ aquí
    }));
  }
);


export const createPost = createAsyncThunk<Post, FormData>(
  'posts/create',
  async (formData, thunkAPI) => {
    const response = await fetch('https://api-posts-9i6e.onrender.com/addposts', {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }
);


export const deletePost = createAsyncThunk<string, string, { rejectValue: string }>(
  "posts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deletePostAPI(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Error al eliminar");
    }
  }
);

// Slice
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message;
      })

      .addCase(createPost.pending, (state) => { state.loading = true; })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.items.unshift(action.payload); // agregar nuevo post al inicio
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message;
      })

      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload as string || action.error.message;
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default postsSlice.reducer;

