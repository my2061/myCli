import inquirer from "inquirer";

/* 获得用户输入结果 */
export const userConfirm = async (message) => {
  const answer = await inquirer.prompt({
    type: "confirm",
    name: "confirm",
    message,
  });
  return answer.confirm;
};

/* 获取用户列表选择结果 */
export const userChooseList = async (message, list) => {
  const answer = await inquirer.prompt({
    type: "list",
    name: "choose",
    message,
    choices: list,
  });
  return answer;
};

/* 获取用户输入的版本号作者名称等等 */
export const userInputs = async (messages) => {
  const answers = await inquirer.prompt(messages.map(msg => {
    return {
      name: msg.name,
      type: "input",
      message: msg.message,
      validate: msg.validate,
    }
  }));

  return answers;
}