import * as ts from "typescript";
import { list } from "recursive-readdir-async";
import { chain, Rule, Tree } from "@angular-devkit/schematics";

export function updateFiles(sourceRoot): Rule {
  return async (host: Tree) => {
    getUpdateFiles(sourceRoot).then((files) => {
      console.log(files);
    });

    return chain([]);
  };
}

function getUpdateFiles(sourceRoot) {
  return list(sourceRoot).then((files) => {
    return files.filter((file) => {
      return file.fullname.includes(".update");
    });
  });
}
