import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret: 'g4CijKVq08',
};

//Public APIs will bypass JWTGuard checks
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
