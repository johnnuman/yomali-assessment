import { defineNuxtPlugin } from 'nuxt/app'
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
    const api = axios.create({
        baseURL: 'http://localhost:8080', // Replace this with your backend base URL
    });

    // Optional: Add interceptors here if you want

    // Inject Axios instance into Nuxt app, so you can use it anywhere with `useNuxtApp()`
    nuxtApp.provide('axios', api)
})
