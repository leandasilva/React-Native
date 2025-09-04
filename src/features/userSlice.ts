import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../lib/api';

export interface User { name: string; email: string; }
interface UserState extends User {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: UserState = { name: '', email: '', status: 'idle' };

export const createUser = createAsyncThunk('user/create', async (data: User) => {
  const res = await api.post('/users', data);
  // JSONPlaceholder devuelve el objeto enviado + id; acá nos quedamos con name/email
  return { name: res.data.name, email: res.data.email } as User;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => { state.status = 'loading'; state.error = undefined; })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.name = action.payload.name;
        state.email = action.payload.email;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
