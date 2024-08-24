#! /usr/bin/env sh

# 告诉脚本在任何命令出错的时候立即退出
set -e

# 输出提示信息
echo "请输入新发布的版本号："

# 等到用户在终端输入，输入的内容赋值给变量next_version
read next_version

# 输出信息并且让用户输入信息
# -p 选项用户在输出前显示提示信息，-n1 选项表示只接受一个字符的输入
read -p "确认发布 $next_version 版本？(y/n): " -n1

# 输出一个空格
echo

# 如果用户输入的是 y，则执行发布操作
if [[ $REPLY =~ ^[Yy]$ ]];
then  
  if [[ `git status --porcelain` ]] #如果有未提交的文件
  then
    echo "有未提交的文件，请先提交"
    git add .
    git commit -am "[commit]: $next_version" # 提交版本信息tawg
  else
    echo "未存在修改的文件，不建议提交新版本"
  fi

  # 修改package.json中的版本号
  npm version $next_version --message "[release]: $next_version"

  # 提交修改
  git push origin master

  # 提交tag到仓库
  git push origin v$next_version

  # 执行发布操作
  npm publish
  else  
    echo "取消发布"
fi