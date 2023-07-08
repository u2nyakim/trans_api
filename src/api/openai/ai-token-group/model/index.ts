import type { PageParam } from '@/api';

export interface AiTokenGroup {
  id?: number;
  name: string;
  // 创建时间
  createTime?: string;
}

export interface AiTokenGroupParam extends PageParam {
  name?: string;
}
