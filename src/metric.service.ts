import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Metric, MetricDocument } from './schemas/metric.schema';

@Injectable()
export class MetricService {
    constructor(@InjectModel(Metric.name) private metricModel: Model<MetricDocument>) {}
    
    async create(metric:any): Promise<void> {
        const createdMetric = new this.metricModel(metric);
        createdMetric.save();
    }

    async getLatest(): Promise<Metric> {
      return this.metricModel.findOne({}, {}, { sort: { 'createdAt' : -1 } });
    }
}
