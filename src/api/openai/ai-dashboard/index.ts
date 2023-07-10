import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import {getPayNumList} from "@/api/dashboard/analysis";

export async function totalUseToken24hour(params = {}) {
  const res = await request.get<ApiResult<PageResult<any>>>(
    '/openai/ai-dashboard/totalUseToken24hour',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function totalUseFee24hour(params = {}) {
  const res = await request.get<ApiResult<PageResult<any>>>(
    '/openai/ai-dashboard/totalUseFee24hour',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function statApi(params = {}) {
  const res = await request.get<ApiResult<PageResult<any>>>(
    '/openai/ai-dashboard/stat',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function statPayNumList(params = {}) {
  const res = await request.get<ApiResult<PageResult<any>>>(
    '/openai/ai-dashboard/statPayNumList',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
export async function countRequestsPerMinute(params = {}) {
  const res = await request.get<ApiResult<PageResult<any>>>(
    '/openai/ai-dashboard/countRequestsPerMinute',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

