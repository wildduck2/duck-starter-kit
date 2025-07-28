import { Readable } from 'node:stream'
import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { throwError } from '~/common/libs'
import { MinioMessageType } from './minio.types'
import { LoggerService } from '~/logger'
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston'

@Injectable()
export class MinioService {
  private readonly s3: S3Client
  private readonly bucket: string

  constructor(
    private readonly config: ConfigService,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {
    this.bucket = this.config.get<string>('MINIO_BUCKET') || 'uploads'

    this.s3 = new S3Client({
      region: this.config.get<string>('MINIO_REGION') ?? 'us-east-1',
      endpoint: this.config.get<string>('MINIO_ENDPOINT') ?? 'http://localhost:9000',
      credentials: {
        accessKeyId: this.config.get<string>('MINIO_ACCESS_KEY') ?? 'root',
        secretAccessKey: this.config.get<string>('MINIO_SECRET_KEY') ?? 'root',
      },
      forcePathStyle: true,
    })
  }

  async ensureBucketExists() {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucket }))
    } catch (error) {
      this.logger.warn(`Bucket "${this.bucket}" not found. Creating...`)
      await this.s3.send(new CreateBucketCommand({ Bucket: this.bucket }))
    }
  }

  async uploadFile(key: string, body: Buffer, contentType: string) {
    try {
      await this.ensureBucketExists()
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      })

      await this.s3.send(command)
      return `${this.bucket}/${key}`
    } catch (error) {
      throwError<MinioMessageType>('MINIO_FILE_DOWNLOAD_FAILED')
      return
    }
  }

  async getFile(key: string) {
    try {
      const command = new GetObjectCommand({ Bucket: this.bucket, Key: key })
      const result = await this.s3.send(command)
      return result.Body as Readable
    } catch (error) {
      throwError<MinioMessageType>('MINIO_FILE_DOWNLOAD_FAILED')
      return
    }
  }
}
