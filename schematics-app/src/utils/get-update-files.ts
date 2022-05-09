import * as ts from "typescript";
import { list } from "recursive-readdir-async";
import { noop, Rule, Tree } from "@angular-devkit/schematics";

export async function updateFiles(sourceRoot, host: Tree): Promise<Rule> {
  const updateFiles = await getUpdateFiles(sourceRoot);

  console.log(updateFiles);

  return noop();
}

function getUpdateFiles(sourceRoot) {
  return list(sourceRoot).then((files) => {
    return files.filter((file) => {
      return file.fullname.includes(".update");
    });
  });
}
