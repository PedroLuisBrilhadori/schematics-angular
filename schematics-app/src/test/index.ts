import { normalize, strings } from "@angular-devkit/core";
import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { updateFiles } from "../utils";
import { ComponentSchema } from "./schema";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function test(options: ComponentSchema): Rule {
  return async (host: Tree, context) => {
    /**
     * Workspace validation.
     */
    const workspaceConfig = host.read("/angular.json");
    if (!workspaceConfig) {
      throw new SchematicsException(
        "Could not find Angular workspace configuration"
      );
    }
    // convert workspace to string
    const workspaceContent = workspaceConfig.toString();
    // parse workspace string into JSON object
    const workspace = JSON.parse(workspaceContent);
    if (!options.project) {
      options.project = workspace.defaultProject;
    }

    /**
     * Project definition.
     */
    const projectName = options.project as string;
    const project = workspace.projects[projectName];
    if (!project) {
      throw new SchematicsException(
        `Could not find Angular Project "${projectName}"`
      );
    }

    const template = templateGenerator("./files", options, project.sourceRoot);

    return chain([mergeWith(template), updateFiles(project.sourceRoot, host)]);
  };
}

function templateGenerator(
  pathFiles: string,
  options: ComponentSchema,
  pathMove: string
) {
  return apply(url(pathFiles), [
    applyTemplates({
      ...strings,
      ...options,
      pluralize: pluralize,
    }),
    move(normalize(pathMove) as string),
  ]);
}

function pluralize(str: string): string {
  return strings.dasherize(
    [/([^aeiou])y$/, /()fe?$/, /([^aeiou]o|[sxz]|[cs]h)$/].map(
      (c, i) => (str = str.replace(c, `$1${"iv"[i] || ""}e`))
    ) && str + "s"
  );
}
