import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Metric, MetricSchema } from '../schemas/metric.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Metric.name, schema: MetricSchema }], 'tweets')],
  exports: [MongooseModule.forFeature([{ name: Metric.name, schema: MetricSchema }], 'tweets')],
  controllers: [],
  providers: [],
})
export class MetricModule {}