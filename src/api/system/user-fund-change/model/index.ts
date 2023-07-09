import type { PageParam } from '@/api';

/**
 * 用户
 */
export interface UserFundChange {
  userId: number;
  fundType: number;
  money: number;
  beforeMoney: number;
  afterMoney: number;
  reason: string;
  changeType: string;
  source: string;
  // 创建时间
  createTime?: string;
}

export interface UserFundChangeParam extends PageParam {
  userId?: number;
  fundType?: number;
  changeType?: string;
  createTimeStart?: string;
  createTimeEnd?: string;
  source?: string;
}
