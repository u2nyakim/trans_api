import { PageParam } from '@/api';

/**
 * 账单
 */
export interface AiBill {
  // 账单id
  id?: number;
  // 账单uuid
  uuid?: string;
  // 扩展属性
  external: string;
  // 账单标签
  tags: string;
  // 账单费用
  useFee: number;
  // 账单模型
  useModel: string;
  // 状态, 0失败, 1成功
  status: number;
  //更新时间
  update_time:string;
  //创建时间
  create_time:string;
}

/**
 * 账单搜索条件
 */
export interface AiBillParam extends PageParam {
  uuid?: string;
  createTimeStart?: string;
  createTimeEnd?: string;
  status?: number;
}
