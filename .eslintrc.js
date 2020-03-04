module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'plugin:vue/recommended',
		'eslint:recommended',
		'prettier/vue',
		'plugin:prettier/recommended'
	],
	rules: {
		// Rules for prettier
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				printWidth: 100,
				useTabs: true,
				tabWidth: 4,
				semi: true,
				bracketSpacing: true,
				arrowParens: "avoid",
				trailingComma: "es5",
			}
		],
		// Insert the property you want to deactivate here
		'vue/require-default-prop': 'off',
		'no-console': 'off'
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
};
