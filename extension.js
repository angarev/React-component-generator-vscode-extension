const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const {
	capitalize,
	isString,
	trim,
	words,
	startsWith,
	endsWith,
	escape,
} = require('lodash');

const createFile = (dir, text) => {
	const htmlContent = `const ${capitalize(trim(text))} = () => {
	return (
		<div>
			<h1>${capitalize(trim(text))}</h1>
		</div>
	)
}
export default ${capitalize(trim(text))}
`;

	if (fs.existsSync(`${dir}/${capitalize(trim(text))}.js`)) {
		return vscode.window.showErrorMessage('The file alredy exist');
	} else {
		fs.writeFile(
			path.join(dir, `${capitalize(trim(text))}.js`),
			htmlContent.trim(),
			(err) => {
				if (err) {
					console.error(err);
					return vscode.window.showErrorMessage(
						'Failed to create react component'
					);
				}

				vscode.window.showInformationMessage(
					'The react component was generated!'
				);
			}
		);
	}
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand(
		'react-component-generator.createBoilerplate',
		function () {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}
			const selection = editor.selection;
			const text = editor.document.getText(selection);

			if (!isString(text)) {
				return vscode.window.showErrorMessage(
					'The selected text must be a string'
				);
			}

			if (words(text).length > 1) {
				return vscode.window.showErrorMessage(
					'The selected text must contains only one word'
				);
			}

			if (startsWith(text, '<') || endsWith(text, '>')) {
				return vscode.window.showErrorMessage(
					'The selected text cannot contain HTML tags'
				);
			}

			const folderPath = vscode.workspace.workspaceFolders[0].uri
				.toString()
				.split(':')[1];

			let dir;
			if (fs.existsSync(`${folderPath}/src`)) {
				dir = `${folderPath}/src/components`;
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
					createFile(dir, escape(text));
				} else {
					createFile(dir, escape(text));
				}
			} else {
				dir = `${folderPath}/components`;
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
					createFile(dir, escape(text));
				} else {
					createFile(dir, escape(text));
				}
			}
		}
	);

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
