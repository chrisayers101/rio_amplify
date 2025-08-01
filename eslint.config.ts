/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/.amplify/**', // Amplify generated artifacts
      '**/amplify/**',
      '**/.cdk.out/**',
      '**/upgrade_docs/**',
      '**/node_modules/**',
      '**/ibkr-production-service/**', // Exclude IBKR service directory with webpack bundles
      '**/clientportal.gw/**', // Exclude client portal gateway files
      '**/local_testing/**', // Exclude local testing files
      '**/*.bundle.js', // Exclude webpack bundle files
      '**/*.min.js', // Exclude minified files
      '**/gateway.demo.js', // Exclude specific demo gateway file
      '**/test-*.js', // Exclude test files that may use require() imports
    ],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  skipFormatting,
)
