import { CompressionTypes, Kafka, Producer, Logger } from 'kafkajs';

import { getClient, KafkaClientConfig } from './KafkaClient';

const DEFAULT_REQUIRE_ACKS = 1;

const toKafkaMessage = (payload: any) => {
  const messagesRaw = payload instanceof Array ? payload : [payload];

  const messages = messagesRaw.map(messageRaw => ({
    value: typeof messageRaw === 'object' ? JSON.stringify(messageRaw) : messageRaw.toString(),
  }));

  return messages;
};

export default class KafkaProducer {
  kafkaClient: Kafka;
  producer: Producer;
  topic: string;
  logger: Logger;
  requireAcks: number;
  disabled: boolean;

  constructor(config: KafkaClientConfig) {
    const { requireAcks = DEFAULT_REQUIRE_ACKS, disabled = false, topic } = config;
    this.disabled = disabled;
    this.kafkaClient = getClient(config);
    this.producer = this.kafkaClient.producer();
    this.producer.connect();

    this.topic = topic;
    this.logger = this.producer.logger();
    this.requireAcks = requireAcks;
  }

  send(messages: any) {
    if (this.disabled) return null;
    return this.producer.send({
      compression: CompressionTypes.GZIP,
      topic: this.topic,
      messages: toKafkaMessage(messages),
      acks: this.requireAcks,
    });
  }
}
