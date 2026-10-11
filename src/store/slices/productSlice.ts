import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
  products: any[];
  categories: any[];
  currentProduct: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    fetchProductsRequest: (state, action: PayloadAction<{ categoryId?: string } | undefined>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action: PayloadAction<any[]>) => {
      state.isLoading = false;
      state.products = action.payload;
    },
    fetchProductsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    fetchProductByIdRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductByIdSuccess: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.currentProduct = action.payload;
    },
    fetchProductByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    fetchCategoriesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<any[]>) => {
      state.isLoading = false;
      state.categories = action.payload;
    },
    fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdRequest,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesFailure
} = productSlice.actions;

export default productSlice.reducer;
