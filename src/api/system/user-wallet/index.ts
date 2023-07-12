import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type {
  UserWalletBalanceAssetLog,
  UserWalletDollarAssetLog,
  UserWalletPointsAssetLog,
  UserWalletAssetLogParam
} from './model';
/**
 * 分页查询用户余额(RMB)资产记录
 */
export async function pageWalletBalance(params: UserWalletAssetLogParam) {
  const res = await request.get<
    ApiResult<PageResult<UserWalletBalanceAssetLog[]>>
  >('/system/user-wallet/balanceAssetLog', { params });
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
/**
 * 分页查询用户余额(美金)资产记录
 */
export async function pageWalletDollar(params: UserWalletAssetLogParam) {
  const res = await request.get<
    ApiResult<PageResult<UserWalletDollarAssetLog[]>>
  >('/system/user-wallet/dollarAssetLog', { params });
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
/**
 * 分页查询用户积分资产记录
 */
export async function pageWalletPoints(params: UserWalletAssetLogParam) {
  const res = await request.get<
    ApiResult<PageResult<UserWalletPointsAssetLog[]>>
  >('/system/user-wallet/pointsAssetLog', { params });
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
