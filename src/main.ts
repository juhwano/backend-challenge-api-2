import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyInstance, fastify } from 'fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const fastifyInstance: FastifyInstance = fastify();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance),
    {
      cors: true,
    },
  );
  const config = new DocumentBuilder()
    .setTitle('아이샵케어 API')
    .setDescription('아이샵케어 사전 과제 API 문서')
    .setVersion('1.0')
    .addTag('Public API', '구매 상담 정보 입력 페이지용 Public API')
    .addTag('Internal API', '내부 Admin 용 API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(8081, '0.0.0.0', (err: Error, address: string) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`[${process.pid}] ✨ Application is listening on ${address}`);
  });
  console.log(`[${process.pid}] Invoked bootstrap`);
}
bootstrap();
