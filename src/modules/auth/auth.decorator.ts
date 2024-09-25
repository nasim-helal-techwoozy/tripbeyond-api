import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Authenticated = () => SetMetadata(IS_PUBLIC_KEY, false);
