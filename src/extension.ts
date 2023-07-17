import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const testCodeLensProvider: vscode.CodeLensProvider = {
    provideCodeLenses(
      document: vscode.TextDocument
    ): vscode.ProviderResult<vscode.CodeLens[]> {
      const codeLenses: vscode.CodeLens[] = [];
      const classRegex = /class\s+(\w+)\(BaseTestCase\):/g;
      const testRegex = /def\s+(test_\w+)\(self\):/g;

      let classMatch;
      while ((classMatch = classRegex.exec(document.getText()))) {
        const className = classMatch[1];
        const classRange = document.lineAt(
          document.positionAt(classMatch.index).line
        ).range;

        const classCommand: vscode.Command = {
          title: "Run Tests",
          command: "extension.runTests",
          arguments: [className],
        };
        const classCodeLens = new vscode.CodeLens(classRange, classCommand);
        codeLenses.push(classCodeLens);

        let testMatch;
        while ((testMatch = testRegex.exec(document.getText()))) {
          const testName = testMatch[1];
          const testRange = document.lineAt(
            document.positionAt(testMatch.index).line
          ).range;

          const testCommand: vscode.Command = {
            title: "Run Test",
            command: "extension.runTest",
            arguments: [className, testName],
          };
          const testCodeLens = new vscode.CodeLens(testRange, testCommand);
          codeLenses.push(testCodeLens);
        }
      }

      return codeLenses;
    },
  };

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider("python", testCodeLensProvider),
    vscode.commands.registerCommand(
      "extension.runTests",
      (className: string) => {
        const conf = vscode.workspace.getConfiguration();
        const command = `${conf.get("docker-tests.command")} ${conf.get(
          "docker-tests.app"
        )}.tests.${className}`;
        vscode.window.terminals.forEach((terminal) => {
          terminal.sendText(command);
          terminal.show();
        });
      }
    ),
    vscode.commands.registerCommand(
      "extension.runTest",
      (className: string, testName: string) => {
        const conf = vscode.workspace.getConfiguration();
        const command = `${conf.get("docker-tests.command")} ${conf.get(
          "docker-tests.app"
        )}.tests.${className}.${testName}`;
        vscode.window.terminals.forEach((terminal) => {
          terminal.sendText(command);
          terminal.show();
        });
      }
    )
  );
}

export function deactivate() {}
