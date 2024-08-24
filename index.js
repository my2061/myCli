#! /usr/bin/env node
import gitClone from "./gitClone.js";
import { program } from "commander";
import { templateList } from "./template.js";
import chalk from "chalk";
import { readFile } from "fs/promises";
import initAction from "./initAction.js";

/* 拿到package.json中的数据 */
const pkg = JSON.parse(
  /* 异步的，new URl将后面的参数拼接到前面的参数前面，找到package.json文件 */
  await readFile(new URL("./package.json", import.meta.url))
);

/* 脚手架描述 */
program
  .name("mengyang-cli")
  .description("这是孟洋创造的一个简易的脚手架")
  /* 改怎么用 */
  .usage("<命令> [参数]")
  .version(pkg.version, "-v, --version")
  .on("--help", () => {
    /* -h或--help的时候干什么，跟直接打mengyang-cli一样 */
  });

/* 监听create命令 */
program
  .command("create <project-name>")
  .description("创建一个新的项目")
  .option("-f, --force", "是否覆盖当前已有的文件创造")
  .option("-t, --template [template]", "输入模版名称创建项目")
  .option("-i --ignore", "忽略项目相关描述，快速创建项目")
  .action(initAction);

/* 监听list命令 */
program
  .command("list")
  .description("查看所有可用的模版")
  .action(async () => {
    console.log(chalk.greenBright("所有可用模版"));
    templateList.forEach((it, index) => {
      console.log(index + 1 + ". " + it.name);
    });
  });

/* 解析参数命令行输入的参数 */
program.parse(process.argv);
