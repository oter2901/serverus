/* eslint-disable no-param-reassign, max-lines */
import _ from 'lodash';

import {
  CONSUMER_TOPIC_PREFIX,
  PRODUCE_TOPIC_PREFIX,
  PRODUCE_EVENTS,
  CONSUME_EVENTS,
  commitIntervalSeconds,
  clientConfig,
} from '../configs/KafkaConfig';

import KafkaConsumer, { KafkaConsumerConfig } from './kafkaClient/KafkaConsumer';
import KafkaProducer from './kafkaClient/KafkaProducer';
import LoggerFactory from './Logger';

const { logger } = new LoggerFactory('Kafka');

const producersPerTopic = {};

const internalTopicPrefix = (topicName: string) => `${CONSUMER_TOPIC_PREFIX}_${topicName}`;
const producerKey = (topicName: string) => `${PRODUCE_TOPIC_PREFIX}_${topicName}`;
const getProducer = (topicName: string) => (PRODUCE_EVENTS ? _.get(producersPerTopic, topicName, null) : null);

const startProducer = (topic: string, config = clientConfig) => {
  if (!PRODUCE_EVENTS) return null;
  const producer = new KafkaProducer({ ...config, topic });
  const asyncProducerReference = new Promise(resolve => {
    producer.producer.on('producer.connect', () => {
      logger.info(`Producer connected successfully. Topic: ${topic}`);
      resolve(producer);
    });
  });

  producersPerTopic[topic] = asyncProducerReference;

  return asyncProducerReference;
};

const startClusterConsumerGroup = async (consumerGroupId, config: KafkaConsumerConfig) => {
  if (!CONSUME_EVENTS) {
    logger.warn('Kafka is disabled.');

    return null;
  }

  const topics = _.filter(config.topics, t => t.active);
  const topicNames = _.map(topics, 'name');
  logger.info(`Starting consumer group ${consumerGroupId}. topics: ${topicNames}`);

  const consumer = await KafkaConsumer.create({
    ...config,
    commitIntervalSeconds,
    groupId: consumerGroupId,
    handleError: e => logger.error(`Error Processing Message: ${e.message}`),
  });

  logger.info(`Consumer group: ${consumerGroupId} connected. topics: ${topicNames}`);

  return consumer;
};

const sendMessage = async (topic: string, message: any) => {
  if (!PRODUCE_EVENTS) return null;

  const prefixedTopic = producerKey(topic);

  const producer = (await getProducer(prefixedTopic)) || (await startProducer(prefixedTopic));

  logger.info(`New outgoing message for topic: ${prefixedTopic}. Message: ${JSON.stringify(message)}`);
  await producer.send(message);

  return true;
};

export const Producer = {
  startProducer,
  sendMessage,
};

export const Consumer = {
  startClusterConsumerGroup,
  internalTopicPrefix,
};
