import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransacaoDocument = HydratedDocument<Transacao>;

@Schema({ timestamps: true })
export class Transacao {
  @Prop({ required: true, trim: true })
  descricao: string;

  @Prop({ required: true, min: 0 })
  valor: number;

  @Prop({ required: true, enum: ['receita', 'despesa'] })
  tipo: string;

  @Prop({ required: true, trim: true })
  categoria: string;

  @Prop({ required: true })
  consumoConsciente: boolean;
}

export const TransacaoSchema = SchemaFactory.createForClass(Transacao);
