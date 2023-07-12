import type { PageParam } from '@/api';

export interface UserWalletAssetLog {
  userId: number;
  reason: string;
  remark: string;
  createTime: string;
}
/**
 * 余额(美金)账户资金变动日志表
 */
export interface UserWalletDollarAssetLog extends UserWalletAssetLog {
  beforeDollar: number;
  dollar: number;
}
/**
 * 积分账户资金变动日志表
 */
export interface UserWalletPointsAssetLog extends UserWalletAssetLog {
  beforePoints: number;
  points: number;
}

/**
 * 余额(RMB)账户资金变动日志表
 */
export interface UserWalletBalanceAssetLog extends UserWalletAssetLog {
  beforeBalance: number;
  amount: number;
}

export interface UserWalletAssetLogParam extends PageParam {
  type?: string;
  action?: number;
  userId?: number;
  createTimeStart?: string;
  createTimeEnd?: string;
  reason?: string;
  remark?: string;
}
