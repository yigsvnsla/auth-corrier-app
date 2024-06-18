import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// export const META_UNPROTECTED = 'unprotected';
// export const META_SKIP_AUTH = 'skip-auth';

// export const Public = (skipAuth = true) =>
// 	applyDecorators(
// 		SetMetadata(META_UNPROTECTED, true),
// 		SetMetadata(META_SKIP_AUTH, skipAuth),
// 	);
