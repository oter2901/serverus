import bluebird from 'bluebird';

import { PROMISE_CONCURRENCY } from '../configs/AppConfig';

export const mapConcurrent = (
  iterable: unknown[],
  fn: (...args: unknown[]) => Promise<unknown>,
  concurrency: number = PROMISE_CONCURRENCY,
) => bluebird.map(iterable, fn, { concurrency });
