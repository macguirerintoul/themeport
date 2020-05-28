module.exports = {
	env: {
		commonjs: true,
		node: true,
		es6: true,
	},
	parserOptions: {
		ecmaVersion: 2017, // allows async functions
	},
	extends: ["plugin:prettier/recommended"],
};
