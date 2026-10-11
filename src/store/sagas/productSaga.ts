import { call, put, takeLatest } from 'redux-saga/effects';
import { productApi } from '../../services/api/productApi';
import {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdRequest,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesFailure
} from '../slices/productSlice';

function* handleFetchProducts(action: ReturnType<typeof fetchProductsRequest>): any {
  try {
    const data = yield call(productApi.getProducts, action.payload?.categoryId);
    // Unpack generic backend response structure if any e.g., data.data
    const products = data.data || data; 
    yield put(fetchProductsSuccess(products));
  } catch (e: any) {
    const message = e.response?.data?.message || e.message;
    yield put(fetchProductsFailure(message));
  }
}

function* handleFetchProductById(action: ReturnType<typeof fetchProductByIdRequest>): any {
  try {
    const data = yield call(productApi.getProductById, action.payload);
    const product = data.data || data;
    yield put(fetchProductByIdSuccess(product));
  } catch (e: any) {
    const message = e.response?.data?.message || e.message;
    yield put(fetchProductByIdFailure(message));
  }
}

function* handleFetchCategories(): any {
  try {
    const data = yield call(productApi.getCategories);
    const categories = data.data || data;
    yield put(fetchCategoriesSuccess(categories));
  } catch (e: any) {
    const message = e.response?.data?.message || e.message;
    yield put(fetchCategoriesFailure(message));
  }
}

export function* watchProductSaga() {
  yield takeLatest(fetchProductsRequest.type, handleFetchProducts);
  yield takeLatest(fetchProductByIdRequest.type, handleFetchProductById);
  yield takeLatest(fetchCategoriesRequest.type, handleFetchCategories);
}
