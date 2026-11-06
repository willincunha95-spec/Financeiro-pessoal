import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TransacoesService } from './transacoes.service.js';
import { Transacao } from './schemas/transacao.schema.js';

describe('TransacoesService', () => {
  let service: TransacoesService;
  let mockModel: any;

  beforeEach(async () => {
    mockModel = {
      create: vi.fn(),
      find: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransacoesService,
        {
          provide: getModelToken(Transacao.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<TransacoesService>(TransacoesService);
  });

  it('deve cadastrar uma transacao', async () => {
    const dto = {
      descricao: 'Salário',
      valor: 3000,
      tipo: 'receita' as const,
      categoria: 'Trabalho',
      consumoConsciente: true,
    };

    mockModel.create.mockResolvedValue(dto);

    const resultado = await service.criar(dto);
    expect(resultado).toEqual(dto);
    expect(mockModel.create).toHaveBeenCalledWith(dto);
  });

  it('deve listar transacoes e calcular as metricas corretamente', async () => {
    const dados = [
      {
        descricao: 'Salário',
        valor: 3000,
        tipo: 'receita',
        categoria: 'Trabalho',
        consumoConsciente: true,
      },
      {
        descricao: 'Conta de Luz',
        valor: 150,
        tipo: 'despesa',
        categoria: 'Moradia',
        consumoConsciente: true,
      },
      {
        descricao: 'Compra de Roupas',
        valor: 200,
        tipo: 'despesa',
        categoria: 'Lazer',
        consumoConsciente: false,
      },
    ];

    mockModel.find.mockReturnValue({
      exec: vi.fn().mockResolvedValue(dados),
    });

    const resultado = await service.listarComMetricas();

    expect(resultado.historico).toEqual(dados);
    expect(resultado.metricas).toEqual({
      saldoTotal: 2650,
      totalDespesas: 350,
      totalGastoImpulso: 200,
    });
  });
});
