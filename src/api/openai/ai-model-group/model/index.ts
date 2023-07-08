import type { PageParam } from '@/api';

export interface AiModelGroup {
  id?: number;
  name: string;
  code: string;
  // 创建时间
  createTime?: string;
}

export interface AiModelGroupParam extends PageParam {
  name?: string;
}
