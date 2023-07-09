import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { UserFundChange, UserFundChangeParam } from './model';

/**
 * 分页查询用户资产记录
 */
export async function pageUserFundChanges(params: UserFundChangeParam) {
  const res = await request.get<ApiResult<PageResult<UserFundChange>>>(
    '/system/user-fund-change/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询用户资产记录列表
 */
export async function listUserFundChanges(params?: UserFundChangeParam) {
  const res = await request.get<ApiResult<UserFundChange[]>>(
    '/system/user-fund-change',
    {
      params
    }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据id查询资产记录
 */
export async function getUserFundChange(id: number) {
  const res = await request.get<ApiResult<UserFundChange>>(
    '/system/user-fund-change/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
