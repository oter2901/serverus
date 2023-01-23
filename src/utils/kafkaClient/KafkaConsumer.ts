import { ConsumerConfig, Kafka } from 'kafkajs';
import _ from 'lodash';

import { topicsByEntity } from '../../configs/KafkaConfig';
import LoggerFactory from '../Logger';
import { mapConcurrent } from '../PromiseUtils';

const { logger } = new LoggerFactory('KafkaConsumer');

import { getClient, KafkaClientConfig } from './KafkaClient';

const ConsumerPerHostAndGroupId = {};

const getConsumer = async (kafka: Kafka, host: string, { groupId, maxBytesPerPartition }: ConsumerConfig) => {
  const ConsumerPerGroupId = ConsumerPerHostAndGroupId[host] || {};
  let consumer = ConsumerPerGroupId[groupId];

  if (consumer) {
    return consumer;
  }

  consumer = kafka.consumer({ groupId, maxBytesPerPartition });
  await consumer.connect();

  ConsumerPerGroupId[groupId] = consumer;
  ConsumerPerHostAndGroupId[host] = ConsumerPerGroupId;

  return consumer;
};

export type Topic = {
  active: boolean;
  concurrency: number;
  name: string;
  handler: (metadata: any, msgs: any) => Promise<any>;
};

export type KafkaConsumerConfig = {
  topics: Topic[];
  commitIntervalSeconds: number;
  handleError: (e: Error) => void;
} & ConsumerConfig &
  KafkaClientConfig;

export default class KafkaConsumer {
  topics: _.Dictionary<any>;
  static async create(config: KafkaConsumerConfig & ConsumerConfig) {
    const consumerInstance = new KafkaConsumer();

    await consumerInstance.initialize(config);

    return consumerInstance;
  }

  async initialize(config: KafkaConsumerConfig & ConsumerConfig) {
    const { topics, host, groupId, commitIntervalSeconds, maxBytesPerPartition } = config;

    this.topics = _.keyBy(topics, 'name');

    const kafka = getClient(config);
    const consumer = await getConsumer(kafka, host, { groupId, maxBytesPerPartition });

    await mapConcurrent(topics, (topic: Topic) => consumer.subscribe({ topic: topic.name }), 1);

    await consumer.run({
      autoCommitThreshold: 100,
      autoCommit: true,
      eachBatchAutoResolve: true,
      partitionsConsumedConcurrently: topics.length,
      eachBatch: this.onMessageBatch.bind(this),
      autoCommitInterval: commitIntervalSeconds * 1000,
    });
  }

  async onMessageBatch({ batch, commitOffsetsIfNecessary }) {
    const { topic: topicName, partition, messages } = batch;

    const f = batch.firstOffset();
    const l = batch.lastOffset();
    const m = messages.length;
    const startTime = Date.now();
    const batchKey = `${partition}-${f}-${l}`;

    logger.info(`Processing ${topicName} - ${batchKey} (part-offset.first-offset.last). ${m} msgs`);
    const topicConfig = this.topics[topicName];

    //Processing messages on batch
    try {
      const parsedMessages = messages.map(message => {
        const { offset, value } = message;

        try {
          return JSON.parse(value);
        } catch (error) {
          logger.error(`Malformed event(topic: ${topicName}, part: ${partition}, offset: ${offset}): ${value}`);
        }
      });

      await topicConfig.handler(topicsByEntity[topicName], parsedMessages);
    } catch (error) {
      const t = topicName;
      const p = partition;
      const e = error.toString();
      logger.error(`Failed to process (topic: ${t}, part: ${p}). Err: ${e}`);
      throw error;
    }
    logger.info(`Done Processing batch: ${batchKey}. (Took: ${(Date.now() - startTime) / 1000}s)`);

    await commitOffsetsIfNecessary();
  }
}
