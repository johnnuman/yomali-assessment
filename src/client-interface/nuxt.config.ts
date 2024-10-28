// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiURL: process.env.NUXT_PUBLIC_API_URL
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  pages: true,
})
