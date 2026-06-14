import js from '@eslint/js';
import globals from 'globals';
import typescript from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import tailwind from 'eslint-plugin-better-tailwindcss';

import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([

    globalIgnores([ 'dist/', 'src-tauri/', 'node_modules/' ]),

    typescript.configs.all,
    js.configs.recommended,
    stylistic.configs.recommended,
    tailwind.configs['recommended-error'],

    stylistic.configs.customize({ indent: 4, semi: true, jsx: true, braceStyle: 'allman', commaDangle: 'never', quoteProps: 'as-needed' }),

    {
        languageOptions:
        {
            parserOptions:
            {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            },
            globals:
            {
                ...globals.node,
                ...globals.browser
            }
        },
        settings:
        {
            'better-tailwindcss':
            {
                entryPoint: 'src/style.css'
            }
        },
        rules:
        {
            'no-console': 'warn',

            'better-tailwindcss/enforce-consistent-line-wrapping': 'off',

            '@stylistic/arrow-parens': [ 'error', 'always' ],
            '@stylistic/padded-blocks': [ 'error', 'never' ],
            '@stylistic/linebreak-style': [ 'error', 'unix' ],
            '@stylistic/quote-props': [ 'error', 'as-needed' ],
            '@stylistic/operator-linebreak': [ 'error', 'after' ],
            '@stylistic/jsx-quotes': [ 'error', 'prefer-single' ],
            '@stylistic/object-curly-spacing': [ 'error', 'always' ],
            '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
            '@stylistic/template-curly-spacing': [ 'error', 'always' ],
            '@stylistic/array-element-newline': [ 'error', 'consistent' ],
            '@stylistic/array-bracket-newline': [ 'error', 'consistent' ],
            '@stylistic/multiline-ternary': [ 'error', 'always-multiline' ],
            '@stylistic/jsx-closing-bracket-location': [ 'error', 'after-props' ],
            '@stylistic/function-call-argument-newline': [ 'error', 'consistent' ],
            '@stylistic/object-property-newline': [ 'error', { allowAllPropertiesOnSameLine: true } ],
            '@stylistic/indent': [ 'error', 4, { SwitchCase: 1, ObjectExpression: 1, assignmentOperator: 0 } ],
            '@stylistic/space-before-function-paren': [ 'error', { anonymous: 'never', named: 'never', asyncArrow: 'never', catch: 'always' } ],

            '@typescript-eslint/no-magic-numbers': 'off',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/prefer-readonly-parameter-types': 'off',

            '@typescript-eslint/naming-convention':
            [
                'error',
                {
                    selector: 'variableLike',
                    format: [ 'camelCase' ]
                },
                {
                    selector: 'function',
                    format: [ 'PascalCase' ]
                },
                {
                    selector: 'typeLike',
                    format: [ 'PascalCase' ]
                }
            ]
        }
    }
]);
