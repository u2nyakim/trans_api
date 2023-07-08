import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { AiTokenGroup, AiTokenGroupParam } from './model';

/**
 * 分页查询AiToken组
 */
export async function pageAiTokenGroups(params: AiTokenGroupParam) {
  const res = await request.get<ApiResult<PageResult<AiTokenGroup>>>(
    '/openai/ai-token-group/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询AiToken组列表
 */
export async function listAiTokenGroups(params?: AiTokenGroupParam) {
  const res = await request.get<ApiResult<AiTokenGroup[]>>(
    '/openai/ai-token-group',
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
 * 根据id查询AiToken组
 */
export async function getAiTokenGroup(id: number) {
  const res = await request.get<ApiResult<AiTokenGroup>>(
    '/openai/ai-token-group/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加AiToken组
 */
export async function addAiTokenGroup(data: AiTokenGroup) {
  const res = await request.post<ApiResult<unknown>>(
    '/openai/ai-token-group/',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改AiToken组
 */
export async function updateAiTokenGroup(data: AiTokenGroup) {
  const res = await request.put<ApiResult<unknown>>(
    '/openai/ai-token-group/',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除AiToken组
 */
export async function removeAiTokenGroup(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    '/openai/ai-token-group/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除AiToken组
 */
export async function removeAiTokenGroups(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    '/openai/ai-token-group/batch',
    {
      data
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改AiToken组状态
 */
export async function updateAiTokenGroupStatus(
  userId?: number,
  status?: boolean
) {
  const res = await request.put<ApiResult<unknown>>(
    '/openai/ai-token-group/status',
    {
      userId,
      status
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 检查AiToken组是否存在
 */
export async function checkExistence(
  field: string,
  value: string,
  id?: number
) {
  const res = await request.get<ApiResult<unknown>>(
    '/openai/ai-token-group/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
