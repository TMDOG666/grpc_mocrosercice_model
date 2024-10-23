import { Module } from '@nestjs/common';
import { SnowflakeService } from './snowflake.utils';

@Module({
  providers: [SnowflakeService],
  exports: [SnowflakeService], // 如果需要在其他模块中使用，记得导出服务
})
export class UtilsModule {}
