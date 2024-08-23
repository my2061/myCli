import chalk from "chalk";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import shell from "shelljs";

/* 删除文件夹 */
export const deleteFile = async (path) => {
  /* 开始转圈 */
  const spinner = ora({
    text: "正在删除文件 " + path + "...",
    color: "yellow",
  }).start();

  try {
    await fs.remove(path);
    spinner.succeed(chalk.greenBright("删除文件 " + path + "成功"));
  } catch (error) {
    spinner.fail(chalk.redBright("删除文件 " + path + "失败"));
    console.log(error);
    return;
  }
};

/* 获取到整个绝对路径 */
export const getResolvePath = (name) => {
  const appDirectory = fs.realpathSync(process.cwd());
  return path.resolve(appDirectory, name);
};

/**
 * 修改package.json中的字段
 * @param {*} name 要修改package.json的项目名称
 * @param {*} info 字段对象
 */
export const modifyPackageJson = async (name, info) => {
  try {
    /* 找到要修改package的项目 */
    const pkg = await fs.readJson(getResolvePath(name + "/package.json"));

    Object.keys(info).forEach((item) => {
      if (item === "name") {
        /* 如果有name属性，name判断下name是否存在并且去掉左右空格后还有效，然后赋值 */
        pkg[item] = info[item] && info[item].trim() ? info[item].trim() : name;
      } else if (item === "keywords") {
        /* 关键字属性 */
        pkg[item] = info[item].split(",");
      } else if (info[item] && info[item].trim()) {
        /* 其他情况，直接赋值即可 */
        pkg[item] = info[item];
      }
    });

    /* 将修改后的pkg写入到json中，spaces为缩进几格 */
    await fs.writeJson(getResolvePath(name + "/package.json"), pkg, {
      spaces: 2,
    });
  } catch (err) {
    console.log(chalk.redBright("对不起，自定义package.json失败，请手动修改"));
    console.log(err);
    return;
  }
};

/* 安装依赖，dir为路径 */
export const installDependencies = async (dir) => {
  const spinner = ora("正在安装依赖...").start();

  /* 依赖安装失败 */
  if(shell.exec(`cd ${shell.pwd()}/${dir} && npm install --force -d}`).code !== 0){
    spinner.fail(chalk.redBright("安装依赖失败"));
    shell.exit(1);
  }

  /* 依赖安装成功 */
  spinner.succeed(chalk.greenBright("安装依赖成功"));
  spinner.succeed(chalk.greenBright("项目创建完成"));
  shell.exit(1);
};
