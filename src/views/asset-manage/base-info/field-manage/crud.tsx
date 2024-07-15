import * as api from './api';
import { request } from '@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, CreateCrudOptionsProps, CreateCrudOptionsRet, dict } from '@fast-crud/fast-crud';
import { commonCrudConfig } from "@/utils/commonCrud";

export const createCrudOptions = function ({ crudExpose }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery) => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }: EditReq) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }: DelReq) => {
    return await api.DelObj(row.id);
  };
  const addRequest = async ({ form }: AddReq) => {
    return await api.AddObj(form);
  };
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      actionbar: {
        buttons: {
          add: {
            show: true,
          },
        },
      },
      rowHandle: {
        fixed: 'right',
        width: 200,
        buttons: {
          view: {
            show: false,
            type: 'primary',
          },
          edit: {
            type: 'primary',
          },
          remove: {
            type: 'primary',
          },
        },
      },
      columns: {
        _index: {
          title: '序号',
          form: { show: false },
          column: {
            type: 'index',
            align: 'center',
            width: '70px',
            columnSetDisabled: true, //禁止在列设置中选择
            formatter: (context) => {
              //计算序号,你可以自定义计算规则，此处为翻页累加
              let index = context.index ?? 1;
              let pagination = crudExpose!.crudBinding.value.pagination;
              return ((pagination!.currentPage ?? 1) - 1) * pagination!.pageSize + index + 1;
            },
          },
        },
        field_name: {
          title: '数据名称',
          search: {
            show: true,
            component: {
              props: {
                clearable: true,
              },
              placeholder: '请输入数据名称',
            },
            labelWidth: "100px"
          },
          type: 'input',
          column: {
            minWidth: 120,
          },
          form: {
            disabled: false,
            component: {
              placeholder: '',
            },
            labelWidth: "100px"
          },
        },
        field_type: {
          title: '类型名称',
          search: {
            show: true,
            component: {
              props: {
                clearable: true,
              },
              placeholder: '请输入类型名称',
            },
          },
          type: 'input',
          column: {
            minWidth: 120,
          },
          form: {
            disabled: true,
            component: {
              placeholder: '',
            },
            labelWidth: "100px"
          },
        },
        models_manage_name: {
          title: '模型名称',
          search: {
            show: false,
            component: {
              props: {
                clearable: true,
              },
              placeholder: '请输入模型名称',
            },
            labelWidth: "100px"
          },
          disabled: true,
          type: 'input',
          column: {
            minWidth: 120,
          },
          form: { show: false, labelWidth: "100px" },
        },

        models_manage: {
          title: '关联ID',
          search: {
            disabled: true,
          },
          type: 'dict-select',
          dict: dict({
            url: '/api/datamodelmanagement/model_managerlist/',
            value: 'id',
            label: 'models_name',
          }),
          column: {
            minWidth: 90,
          },
          form: {
            component: {
              placeholder: '',
            },
            labelWidth: "100px"

          },
          component: { props: { color: 'auto' } }, // 自动染色
        },

        data_source_model_name: {
          title: '来源模型名称',
          type: 'input',
          column: {
            minWidth: 90,
          },
          form: {
            component: {
              placeholder: '',
            },
            labelWidth: "100px"
          },
          component: { props: { color: 'auto' } }, // 自动染色
        },

        data_source_field_name: {
          title: "来源数据名称",
          type: 'input',
          column: {
            minWidth: 90,
          },
          form: {
            component: {
              placeholder: '',
            },
            labelWidth: "100px"
          },
          // component: { props: { color: 'auto' } }, // 自动染色
        },









        ...commonCrudConfig()
      },
    },
  };
};
