import { 
  Picker, 
  InputItem, 
  TextareaItem,
  DatePicker,
} from 'antd-mobile';

export default [
  {
    title: '基本信息',
    form: [
      {
        type: Picker,
        fieldName: 'originId',
        lable: '出发地',
        props: {
          data: [],
          cols: 1,
          title: '出发地',
          extra: ''
        },
        required: true,
        rules: [
          { required: true, message: '请选择出发地' }
        ]
      }
    ]
  }
]