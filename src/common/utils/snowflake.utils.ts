import { Injectable } from '@nestjs/common';
import { SnowflakeIdv1 } from 'simple-flakeid';


@Injectable()
export class SnowflakeService {
  private gen : SnowflakeIdv1;

  constructor() {
    this.gen = new SnowflakeIdv1({workerId:1});
  }

  async generateId(): Promise<bigint> {
    try {
      const id = this.gen.NextBigId();
      return id;
    } catch (error) {
      this.gen = new SnowflakeIdv1({workerId:1});
      const id = this.gen.NextBigId();
      return id;
    }
  }
}
