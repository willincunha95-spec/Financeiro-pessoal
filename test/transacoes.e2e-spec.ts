import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { TransacoesService } from '../src/transacoes/transacoes.service.js';

describe('TransacoesController (e2e)', () => {
  let app: INestApplication<App>;
  const mockHistorico: any[] = [];

  const mockTransacoesService = {
    criar: (dto: any) => {
      const nova = { _id: 'mock-id-123', ...dto };
      mockHistorico.push(nova);
      return Promise.resolve(nova);
    },
    listarComMetricas: () => {
      let totalReceitas = 0;
      let totalDespesas = 0;
      let totalGastoImpulso = 0;

      for (const item of mockHistorico) {
        if (item.tipo === 'receita') {
          totalReceitas += item.valor;
        } else if (item.tipo === 'despesa') {
          totalDespesas += item.valor;
          if (item.consumoConsciente === false) {
            totalGastoImpulso += item.valor;
          }
        }
      }

      return Promise.resolve({
        historico: mockHistorico,
        metricas: {
          saldoTotal: totalReceitas - totalDespesas,
          totalDespesas,
          totalGastoImpulso,
        },
      });
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TransacoesService)
      .useValue(mockTransacoesService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transacoes (POST) - deve cadastrar uma receita', async () => {
    const payload = {
      descricao: 'Salário Mensal',
      valor: 3500,
      tipo: 'receita',
      categoria: 'Salário',
      consumoConsciente: true,
    };

    const res = await request(app.getHttpServer())
      .post('/transacoes')
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.descricao).toBe('Salário Mensal');
    expect(res.body.valor).toBe(3500);
  });

  it('/transacoes (POST) - deve rejeitar transacao invalida', async () => {
    const payloadInvalido = {
      descricao: '',
      valor: -50,
      tipo: 'outro',
    };

    await request(app.getHttpServer())
      .post('/transacoes')
      .send(payloadInvalido)
      .expect(400);
  });

  it('/transacoes (GET) - deve retornar historico e metricas consolidadas', async () => {
    const despesaImpulso = {
      descricao: 'Compra por impulso',
      valor: 200,
      tipo: 'despesa',
      categoria: 'Lazer',
      consumoConsciente: false,
    };

    await request(app.getHttpServer())
      .post('/transacoes')
      .send(despesaImpulso)
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/transacoes')
      .expect(200);

    expect(res.body).toHaveProperty('historico');
    expect(res.body).toHaveProperty('metricas');
    expect(Array.isArray(res.body.historico)).toBe(true);
    expect(res.body.metricas.totalDespesas).toBe(200);
    expect(res.body.metricas.totalGastoImpulso).toBe(200);
    expect(res.body.metricas.saldoTotal).toBe(3300);
  });
});
