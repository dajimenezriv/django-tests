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

        let testMatch;
        while ((testMatch = testRegex.exec(document.getText()))) {
          const testName = testMatch[1];
          const range = document.lineAt(
            document.positionAt(testMatch.index).line
          ).range;
          const command: vscode.Command = {
            title: "Run Test",
            command: "extension.runTest",
            arguments: [className, testName],
          };
          const codeLens = new vscode.CodeLens(range, command);
          codeLenses.push(codeLens);
        }
      }

      return codeLenses;
    },
  };

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider("python", testCodeLensProvider),
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
