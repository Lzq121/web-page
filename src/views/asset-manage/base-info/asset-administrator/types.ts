export interface ResponseData {
  code?: number;
  data: [];
  msg?: string;
}

export interface TreeItemType {
  id?: number | string;
  modifier_name?: string;
  creator_name?: string;
  create_datetime?: string;
  update_datetime?: string;
  parent_name?: string;
  status_label?: string;
  has_children?: number;
  hasChild?: false,
  description?: string;
  modifier?: string;
  dept_belong_id?: string;
  name?: string;
  key?: string;
  sort?: number;
  owner?: string;
  phone?: string;
  email?: string;
  status?: boolean;
  creator?: number;
  parent?: number;
}