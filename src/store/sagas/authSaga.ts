import { call, put, takeLatest } from 'redux-saga/effects';
import { authApi } from '../../services/api/authApi';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
} from '../slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Worker Saga: will be fired on loginRequest actions
function* handleLogin(action: ReturnType<typeof loginRequest>): any {
  try {
    const response = yield call(authApi.login, action.payload);
    
    const token = response.token || response.session?.token || 'dummy-token';
    const user = response.user || response;
    
    yield call(AsyncStorage.setItem, 'userToken', token);
    yield put(loginSuccess({ user, token }));
  } catch (e: any) {
    const message = e.response?.data?.message || e.message;
    yield put(loginFailure(message));
  }
}

// Worker Saga: will be fired on registerRequest actions
function* handleRegister(action: ReturnType<typeof registerRequest>): any {
  try {
    const response = yield call(authApi.register, action.payload);
    
    const token = response.token || response.session?.token || 'dummy-token';
    const user = response.user || response;
    
    yield call(AsyncStorage.setItem, 'userToken', token);
    yield put(registerSuccess({ user, token }));
  } catch (e: any) {
    const message = e.response?.data?.message || e.message;
    yield put(registerFailure(message));
  }
}

// Watcher Saga
export function* watchAuthSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
}
