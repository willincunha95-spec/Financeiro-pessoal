import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateTransacaoDto {
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsNumber()
  @IsPositive()
  valor: number;

  @IsIn(['receita', 'despesa'])
  tipo: 'receita' | 'despesa';

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsBoolean()
  consumoConsciente: boolean;
}
