import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CasesCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext) {
    const baseKey = super.trackBy(context);
    if (!baseKey) return baseKey;
    return `cases:${baseKey}`;
  }
}
