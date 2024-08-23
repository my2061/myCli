/* 初始化action，检查是否存在git等软件 */
import shelljs from "shelljs";
import chalk from "chalk";
import gitClone from "./gitClone.js";
import fs from "fs-extra";
import { deleteFile, getResolvePath, modifyPackageJson, installDependencies } from "./utils.js";
import { userConfirm, userChooseList, userInputs } from "./userHandler.js";
import { templateList, modifyPkgJson } from "./template.js";

const initAction = async (name, option) => {
  /* 验证是否有git */
  if (!shelljs.which("git")) {
    console.log(chalk.red("对不起，运行脚手架之前请先安装git"));
    shelljs.exit(1);
  }

  /* 校验项目名称，不能为中文或特殊字符 */
  if (name.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)) {
    console.log(chalk.red("项目名称不能包含中文或特殊字符"));
    shelljs.exit(1);
  }

  /* 拉取的gitname */
  let gitCloneName = "";

  /* 判断用户是否选择了模版处理 */
  if (option.template) {
    const template = templateList.find((item) => item.name === option.template);
    if (!template) {
      /* 未找到目标模版 */
      console.log(chalk.red("未找到目标模版，可以使用list查看所有模版"));
      return;
    } else {
      /* 获得拉取git的地址 */
      gitCloneName = template.gitName;
    }
  }

  /* 当前是否已经存在相同name名称文件夹 */
  /* 1. 如果没有-f --force选项，提示用户是否删除同名文件夹 */
  if (fs.existsSync(name) && !option.force) {
    console.log(chalk.red("当前文件夹已存在，是否删除同名文件夹？"));
    const answer = await userConfirm(
      "当前文件夹已存在，是否删除" + name + "文件夹？"
    );
    if (answer) {
      /* 选择了是 */
      await deleteFile(getResolvePath(name));
    } else {
      /* 选择了否 */
      console.log(chalk.red("已取消，项目创建失败！"));
      return;
    }
  } else if (fs.existsSync(name) && option.force) {
    /* 2. 如果有-f --force选项，直接删除同名文件夹 */
    console.log("项目文件夹已存在，正在删除同名文件夹...");
    await deleteFile(getResolvePath(name));
  }

  /* 选择模版拉取项目 */
  const chooseTemplate = await userChooseList("请选择模版：", templateList);
  gitCloneName = chooseTemplate.choose;

  try {
    /* 拉取项目 */
    await gitClone(gitCloneName, name);
  } catch (err) {
    console.log(chalk.red("拉取项目失败!"));
    console.log(err);
    return;
  }

  /* 判断是否输入了-i --ignore选项，快速创建项目选项 */
  if (!option.ignore) {
    /* 非快速创建，输入提问 */
    const answerList = await userInputs(modifyPkgJson);
    /* 获取到了之后修改下载下来的package.json中的相关字段 */
    modifyPackageJson(name, answerList);
  }

  /* 安装依赖 */
  installDependencies(name);
};

export default initAction;
