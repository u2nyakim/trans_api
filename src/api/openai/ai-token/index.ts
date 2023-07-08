import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { AiToken, AiTokenParam } from './model';

/**
 * 分页查询AiToken
 */
export async function pageAiTokens(params: AiTokenParam) {
  const res = await request.get<ApiResult<PageResult<AiToken>>>(
    '/openai/ai-token/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询AiToken列表
 */
export async function listAiTokens(params?: AiTokenParam) {
  const res = await request.get<ApiResult<AiToken[]>>('/openai/ai-model', {
    params
  });
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据id查询AiToken
 */
export async function getAiToken(id: number) {
  const res = await request.get<ApiResult<AiToken>>('/openai/ai-token/' + id);
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加AiToken
 */
export async function addAiToken(data: AiToken) {
  const res = await request.post<ApiResult<unknown>>('/openai/ai-token/', data);
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改AiToken
 */
export async function updateAiToken(data: AiToken) {
  const res = await request.put<ApiResult<unknown>>('/openai/ai-token/', data);
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除AiToken
 */
export async function removeAiToken(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    '/openai/ai-token/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除AiToken
 */
export async function removeAiTokens(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    '/openai/ai-token/batch',
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
 * 修改AiToken状态
 */
export async function updateAiTokenStatus(id?: number, status?: number) {
  const res = await request.put<ApiResult<unknown>>('/openai/ai-token/status', {
    id,
    status
  });
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
/**
 * 修改AiToken disable
 */
export async function updateAiTokenDisable(id?: number, disable?: boolean) {
  const res = await request.put<ApiResult<unknown>>(
    '/openai/ai-token/disable',
    {
      id,
      disable
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 检查AiToken是否存在
 */
export async function checkExistence(
  field: string,
  value: string,
  id?: number
) {
  const res = await request.get<ApiResult<unknown>>(
    '/openai/ai-token/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
export async function queryUsageAiTokens(ids?: [], all?: boolean) {
  const res = await request.put<ApiResult<unknown>>(
    '/openai/ai-token/queryUsage',
    {
      ids,
      all
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
