/* eslint-disable no-param-reassign,prefer-object-spread */
import net from 'net';
import tls from 'tls';

import { Kafka, logLevel as loggingLevel } from 'kafkajs';

const MAX_RECONNECTION_ATTEMPTS = 10;
const MAX_TIMEOUT = 30000;
const KEEP_ALIVE_DELAY = 10000;

const socketFactory = ({ host, port, ssl, onConnect }) => {
  const socket = ssl ? tls.connect(Object.assign({ host, port, servername: host }, ssl), onConnect) : net.connect({ host, port }, onConnect);
  socket.setKeepAlive(true, KEEP_ALIVE_DELAY);
  socket.setTimeout(30000);

  return socket;
};

const KafkaClientsPerHost = {};

export interface KafkaClientConfig {
  host: string;
  topic: string;
  timeout?: number;
  maxAttempts?: number;
  enableLogs?: boolean;
  logLevel?: loggingLevel;
  ssl?: boolean;
  clientId?: string;
  requireAcks?: number;
  disabled?: boolean;
}

export const getClient = (config: KafkaClientConfig): Kafka => {
  const {
    host,
    timeout = MAX_TIMEOUT,
    maxAttempts = MAX_RECONNECTION_ATTEMPTS,
    enableLogs = false,
    logLevel = enableLogs ? loggingLevel.INFO : loggingLevel.ERROR,
    ssl = false,
    clientId = '',
  } = config;

  let kafkaClient: Kafka = KafkaClientsPerHost[host];

  if (kafkaClient) {
    return kafkaClient;
  }

  const kafkaConfig = {
    brokers: host ? host.split(',') : [],
    connectionTimeout: timeout,
    ssl,
    retry: {
      maxRetryTime: 35 * 60 * 1000,
      initialRetryTime: 300,
      factor: 0.2,
      multiplier: 3,
      retries: maxAttempts,
    },
    logLevel,
    socketFactory,
  };

  if (clientId) {
    config.clientId = clientId;
  }

  kafkaClient = new Kafka(kafkaConfig);
  KafkaClientsPerHost[host] = kafkaClient;

  return kafkaClient;
};
