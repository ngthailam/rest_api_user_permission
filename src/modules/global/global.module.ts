// ApiModule
import { Module, Global } from '@nestjs/common';
import { RoleService } from '../role/role.service';

@Global()
@Module({
  providers: [RoleService],
  exports: [RoleService],
})
export class GlobalModule {}
