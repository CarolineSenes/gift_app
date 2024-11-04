declare const window: Window & {
  env: {
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
  }
};

export const environment = {
  production: false,
  supabaseUrl: window.env?.SUPABASE_URL ?? '',
  supabaseKey: window.env?.SUPABASE_KEY ?? ''
};