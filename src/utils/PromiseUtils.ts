import bluebird from 'bluebird';

import { PROMISE_CONCURRENCY } from '../configs/AppConfig';

export const mapConcurrent = (iterable, fn, concurrency = PROMISE_CONCURRENCY) => bluebird.map(iterable, fn, { concurrency });
