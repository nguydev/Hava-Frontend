import { all } from 'redux-saga/effects';
import { watchAuthSaga } from './authSaga';
import { watchProductSaga } from './productSaga';

export default function* rootSaga() {
  yield all([
    watchAuthSaga(),
    watchProductSaga(),
  ]);
}
