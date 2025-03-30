interface ImportMetaEnv {
  readonly EMAIL_PASSWORD: string;
  readonly EMAIL_USERNAME: string;
  readonly EMAIL_HOST: string;
  readonly EMAIL_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}