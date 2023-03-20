import _ from 'lodash';

import { REQUESTER } from '../configs/AppConfig';

import { Producer } from './Kafka';

const validateRequiredParams = (topic: string, suffix: string) => {
  if (typeof topic !== 'string' || typeof suffix !== 'string') {
    throw new Error('topic and eventName arguments must be string');
  }
};

const buildEvent = (topic: string, suffix: string, message: any, requester: typeof REQUESTER) => ({
  name: `${topic}${suffix}`,
  timestamp: Date.now(),
  payload: message,
  requester,
});

const send = async (
  topic: string,
  suffix: string,
  message: any,
  requester: typeof REQUESTER,
  notifyStrategy: (topic: string, message: any) => Promise<boolean>,
  callBack?: (message: any, requester: typeof REQUESTER) => void,
) => {
  validateRequiredParams(topic, suffix);

  if (!_.isEmpty(message)) {
    await notifyStrategy(topic, buildEvent(topic, suffix, message, requester));

    if (callBack && typeof callBack === 'function') callBack(message, requester);

    return true;
  }

  return false;
};

export const notify = async (
  topic: string,
  suffix: string,
  message: any,
  requester: typeof REQUESTER = REQUESTER,
  callBack?: (message: any, requester: typeof REQUESTER) => void,
) => {
  const sent = await send(topic, suffix, message, requester, Producer.sendMessage, callBack);

  if (sent) {
    // Todo add some logging here or metrics
  }
};

// implement notification sync for HTTP REQUEST notifications
