import chalk from "chalk";
import download from "download-git-repo";
import ora from "ora";
import figlet from "figlet";

/* 拉取目标git地址 */
const gitClone = (remote, customName, options = false) => {
  const spinner = ora("拉取项目中...").start();

  return new Promise((resolve, reject) => {
    download(remote, customName, options, (err) => {
      if (err) {
        /* 拉取失败 */
        console.error(err);
        reject(err);
        return;
      }

      /* 拉取成功 */
      spinner.succeed(
        chalk.greenBright(
          figlet.textSync("Meng CLI", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 80,
            whitespaceBreak: true,
          })
        )
      );

      console.log(`项目拉取成功了孩子，使用${chalk.greenBright("Meng -h")}来获得帮助吧`);

      resolve();
    });
  });
};

export default gitClone;
