/// <reference types="@cloudflare/workers-types" />

interface CloudflareEnv {
  // Add your Cloudflare bindings here
  // ASSETS: Fetcher;
  // MY_KV: KVNamespace;
  // DB: D1Database;
}

declare namespace NodeJS {
  interface ProcessEnv extends CloudflareEnv {}
}
