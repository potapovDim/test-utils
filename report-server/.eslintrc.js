module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true,
    "mocha": true
  },
  "globals": {
    "describe:": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "plugins": [
    "mocha",
    "chai-expect"
  ],
  "rules": {
    "mocha/no-skipped-tests": "off",
    "mocha/no-setup-in-describe": "off",
    "require-atomic-updates": "off",
    "eol-last": [
      "error",
      "always"
    ],
    "max-len": [
      "error",
      {
        "ignoreComments": true,
        "code": 120,
        "tabWidth": 2
      }
    ]
  },
  "extends": [
    "eslint:recommended",
    "plugin:mocha/recommended"
  ],
};