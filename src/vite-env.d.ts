/// <reference types="vite/client" />

/**
 * Variables injectées au build (voir vite.config.js : loadEnv + define).
 * Les préfixes VITE_* restent pris en charge nativement par Vite.
 */
interface ImportMetaEnv {
  readonly GAS_URL_CONTACT: string
  readonly GAS_URL_MATERIAL: string
  readonly VITE_DONATION_URL?: string
  readonly VITE_GAS_CONTACT_URL?: string
  readonly VITE_GAS_MATERIAL_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
