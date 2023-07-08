import type { PageParam } from '@/api';

export interface AiToken {
  id?: number;
  groupId?: number;
  groupName?: string;
  host: string;
  sk: string;
  models: string;
  ulimit: string;
  usage: string;
  priority: string;
  disable: boolean;
  status: number;
  statusMsg: string;
  comments: string;
  // 创建时间
  createTime?: string;
}

export interface AiTokenParam extends PageParam {
  keyword?: string;
  status?: boolean;
  disable?: boolean;
}
