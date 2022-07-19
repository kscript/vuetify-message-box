module.exports = {
  settings: {
    'vetur.format.defaultFormatterOptions': {
      prettier: {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: true,
        quoteProps: 'as-needed',
        jsxSingleQuote: true,
        trailingComma: 'none',
        bracketSpacing: true,
        jsxBracketSameLine: true,
        arrowParens: 'always',
        requirePragma: false,
        insertPragma: false,
        proseWrap: 'preserve',
        htmlWhitespaceSensitivity: 'ignore',
        vueIndentScriptAndStyle: false,
        endOfLine: 'lf',
        embeddedLanguageFormatting: 'auto'
      }
    },
    'vetur.format.defaultFormatter.js': 'vscode-typescript',
    'javascript.format.insertSpaceBeforeFunctionParenthesis': true
  }
}
