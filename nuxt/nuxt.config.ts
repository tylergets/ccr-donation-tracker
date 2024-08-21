// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: false},

    modules: [
        "@formkit/nuxt",
        "@nuxtjs/tailwindcss",
        "@nuxthub/core",
        '@vueuse/nuxt',
        'nuxt-cron',
        "@nuxt/icon",
    ],


    telemetry: false,

    nitro: {
        preset: 'node-server',
        // experimental: {
        //     tasks: true
        // }
    },

    cron: {
        timeZone: 'America/New_York',
        jobsDir: 'cron'
    },

    runtimeConfig: {
        public: {
            reportsPassword: '',
        }
    },

    formkit: {
        // Experimental support for auto loading (see note):
        autoImport: true
    }
})