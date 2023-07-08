import type { PageParam } from '@/api';

export interface AiModel {
  id?: number;
  groupId?: number;
  groupName?: string;
  groupCode?: string;
  name: string;
  status: boolean;
  statusMsg: string;
  fee: number;
  feeType: number;
  // 创建时间
  createTime?: string;
}

export interface AiModelParam extends PageParam {
  sk?: string;
  status?: number;
  disable?: number;
}
