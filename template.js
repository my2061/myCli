/* 项目模版列表 */
export const templateList = [
  {
    name: "my2061/H5-Template",
    gitName: "my2061/H5-Template",
    description: "H5营销活动模版"
  },
  {
    name: "my2061/Admin-Template",
    gitName: "my2061/Admin-Template",
    description: "后台管理系统模版"
  },
];

/* package.json里需要修改的字段 */
export const modifyPkgJson = [
  {
    message: "请输入项目名称啊",
    name: "name",
    validate(val) {
      if(val.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)){
        return "项目名称不能包含中文或特殊字符";
      }
      return true;
    }
  },
  {
    message: "请输入项目关键词(,分割):",
    name: "keywords",
  },
  {
    message: "请输入项目描述",
    name: "description",
  },
  {
    message: "请输入作者名",
    name: "author",
  },
  {
    message: "请输入项目版本号",
    name: "version",
  }
];