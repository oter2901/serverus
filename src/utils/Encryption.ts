import * as bcrypt from 'bcrypt';

import { SALT_ROUNDS } from '../configs/AppConfig';
import BaseException from '../exceptions/BaseException';
import { EncryptionError } from '../exceptions/Errors';

import LoggerFactory from './Logger';

const { logger } = new LoggerFactory('Encryption');

function buildBaseError(code: string, message: string, data = {}): BaseException {
  return new BaseException({ status: 400, code, message, data });
}

function validateResult<T>(result: T): void {
  if (!result) {
    throw buildBaseError(EncryptionError.code, EncryptionError.message);
  }
}

async function encryptionHandler<T>(promise: Promise<T>): Promise<T> {
  let result: T;
  try {
    result = await promise;
  } catch (err) {
    logger.error(err);
    throw buildBaseError(EncryptionError.code, EncryptionError.message);
  }

  validateResult(result);

  return result;
}

export async function generateSalt(saltRounds: number = SALT_ROUNDS) {
  return await encryptionHandler(bcrypt.genSalt(saltRounds));
}

export async function generateHash(plainTextData: string, salt = null) {
  let generatedSalt = salt;
  if (!generatedSalt) {
    generatedSalt = await generateSalt();
  }
  const generatedHash = await encryptionHandler(bcrypt.hash(plainTextData, generatedSalt));

  return { generatedHash, generatedSalt };
}

export async function compareWithHash(plainTextData: string, hashedData: string) {
  return await encryptionHandler(bcrypt.compare(plainTextData, hashedData));
}
