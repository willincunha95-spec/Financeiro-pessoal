import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { TransacoesController } from './transacoes.controller.js';
import { TransacoesService } from './transacoes.service.js';

describe('TransacoesController', () => {
  let controller: TransacoesController;
  let service: TransacoesService;

  beforeEach(async () => {
    const mockService = {
      criar: vi.fn(),
      listarComMetricas: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransacoesController],
      providers: [
        {
          provide: TransacoesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TransacoesController>(TransacoesController);
    service = module.get<TransacoesService>(TransacoesService);
  });

  it('deve chamar o service.criar no POST', async () => {
    const dto = {
      descricao: 'Internet',
      valor: 100,
      tipo: 'despesa' as const,
      categoria: 'Moradia',
      consumoConsciente: true,
    };

    vi.spyOn(service, 'criar').mockResolvedValue(dto as any);

    const resultado = await controller.criar(dto);
    expect(resultado).toEqual(dto);
    expect(service.criar).toHaveBeenCalledWith(dto);
  });

  it('deve chamar o service.listarComMetricas no GET', async () => {
    const retorno = {
      historico: [],
      metricas: { saldoTotal: 0, totalDespesas: 0, totalGastoImpulso: 0 },
    };

    vi.spyOn(service, 'listarComMetricas').mockResolvedValue(retorno as any);

    const resultado = await controller.listarComMetricas();
    expect(resultado).toEqual(retorno);
    expect(service.listarComMetricas).toHaveBeenCalled();
  });
});
