import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { AiRequests, AiRequestsParam } from './model';

/**
 * 分页查询模型
 */
export async function pageAiRequests(params: AiRequestsParam) {
  const res = await request.get<ApiResult<PageResult<AiRequests>>>(
    '/openai/ai-requests/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询模型列表
 */
export async function listAiRequests(params?: AiRequestsParam) {
  const res = await request.get<ApiResult<AiRequests[]>>('/openai/ai-requests', {
    params
  });
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据id查询模型
 */
// export async function getAiModel(id: number) {
//   const res = await request.get<ApiResult<AiModel>>('/openai/ai-model/' + id);
//   if (res.data.code === 0 && res.data.data) {
//     return res.data.data;
//   }
//   return Promise.reject(new Error(res.data.message));
// }


/**
 * 删除模型
 */
export async function removeAiRequest(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    '/openai/ai-requests/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}


/**
 * 检查模型是否存在
 */
export async function checkExistence(
  field: string,
  value: string,
  id?: number
) {
  const res = await request.get<ApiResult<unknown>>(
    '/openai/ai-requests/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
