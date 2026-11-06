import 'dotenv/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TransacoesModule } from './transacoes/transacoes.module.js';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/controle-financeiro',
    ),
    TransacoesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
