import { PageParam } from '@/api';

/**
 * 请求记录
 */
export interface AiRequests {
  // 请求id
  id?: number;
  // 账单id
  bill_id?: number;
  // 账单uuid
  bill_uuid: string;
  // 返回状态码
  status_code: number;
  //请求接口
  action: string;
  //请求内容
  data: string;
  //请求结果
  result: string;
  //租户id
  tenant_id: number;
  //用户id
  user_id: number;
  //更新时间
  update_time:string;
  //创建时间
  create_time:string;
}

/**
 * 请求记录搜索条件
 */
export interface AiRequestsParam extends PageParam {
  bill_uuid?: string;
  status_code: number;
  createTimeStart?: string;
  createTimeEnd?: string;
}
