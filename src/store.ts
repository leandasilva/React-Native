import { configureStore, createSlice } from '@reduxjs/toolkit';

// Slice de posts
const postsSlice = createSlice({
  name: 'posts',
  initialState: [] as { text: string; image: string | null }[],
  reducers: {
    addPost: (state, action) => {
      state.push(action.payload);
    },
  },
});

// Exportar acción
export const { addPost } = postsSlice.actions;

// Exportar store
export const store = configureStore({
  reducer: {
    posts: postsSlice.reducer,
  },
});

// Tipos para TypeScript (opcional pero recomendado)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
