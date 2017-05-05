// @flow

import {takeLatest, takeEvery} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';

import {receiveApplications, notFound, receiveSingleApplication} from './actions';
import {fetchApplications, fetchSingleApplication} from './requests';
import {receiveError} from '../api/actions';

function* fetchApplicationsSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchApplications);

    switch (statusCode) {
      case 200:
        yield put(receiveApplications(bodyAsJson));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch applications with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSingleApplicationSaga({payload: id}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleApplication, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleApplication(bodyAsJson));
        break;
      case 404:
        yield put(notFound());
        yield put(receiveError(new Error(`404: ${bodyAsJson.detail}`)));
        break;
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch applications with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/applications/FETCH_ALL', fetchApplicationsSaga);
      yield takeEvery('mvj/applications/FETCH_SINGLE', fetchSingleApplicationSaga);
    }),
  ];
}