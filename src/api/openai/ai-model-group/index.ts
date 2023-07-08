import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { AiModelGroup, AiModelGroupParam } from './model';

/**
 * 分页查询模型组
 */
export async function pageAiModelGroups(params: AiModelGroupParam) {
  const res = await request.get<ApiResult<PageResult<AiModelGroup>>>(
    '/openai/ai-model-group/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询模型组列表
 */
export async function listAiModelGroups(params?: AiModelGroupParam) {
  const res = await request.get<ApiResult<AiModelGroup[]>>(
    '/openai/ai-model-group',
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
 * 根据id查询模型组
 */
export async function getAiModelGroup(id: number) {
  const res = await request.get<ApiResult<AiModelGroup>>(
    '/openai/ai-model-group/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加模型组
 */
export async function addAiModelGroup(data: AiModelGroup) {
  const res = await request.post<ApiResult<unknown>>(
    '/openai/ai-model-group/',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改模型组
 */
export async function updateAiModelGroup(data: AiModelGroup) {
  const res = await request.put<ApiResult<unknown>>(
    '/openai/ai-model-group/',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除模型组
 */
export async function removeAiModelGroup(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    '/openai/ai-model-group/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除模型组
 */
export async function removeAiModelGroups(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    '/openai/ai-model-group/batch',
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
 * 修改模型组状态
 */
export async function updateAiModelGroupStatus(
  userId?: number,
  status?: boolean
) {
  const res = await request.put<ApiResult<unknown>>(
    '/openai/ai-model-group/status',
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
 * 检查模型组是否存在
 */
export async function checkExistence(
  field: string,
  value: string,
  id?: number
) {
  const res = await request.get<ApiResult<unknown>>(
    '/openai/ai-model-group/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
