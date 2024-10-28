<template>
    <NuxtLayout>
        <div class="min-h-screen flex flex-col">
            <!-- Header -->
            <header class="bg-gray-800 text-white p-4">
                <div class="container mx-auto flex justify-between items-center">
                    <h1 class="text-xl font-semibold">Dashboard</h1>
                    <nav class="space-x-4">
                        <a href="#" class="hover:text-gray-300">Profile</a>
                        <a href="#" class="hover:text-gray-300">Settings</a>
                        <a href="#" class="hover:text-gray-300">Logout</a>
                    </nav>
                </div>
            </header>

            <!-- Body -->
            <div class="flex flex-1">
                <!-- Sidebar -->
                <aside class="bg-gray-900 text-gray-400 w-64 p-6 hidden lg:block">
                    <nav>
                        <ul class="space-y-4">
                            <li>
                                <NuxtLink to="/" class="block py-2 px-3 rounded hover:bg-gray-700">
                                    Home
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/reports/session-duration" class="block py-2 px-3 rounded hover:bg-gray-700">
                                    Session Duration
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/reports/page-views" class="block py-2 px-3 rounded hover:bg-gray-700">
                                    Page Views
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/reports/traffic" class="block py-2 px-3 rounded hover:bg-gray-700">
                                    Traffic Reports
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/reports/retention" class="block py-2 px-3 rounded hover:bg-gray-700">
                                    Retention
                                </NuxtLink>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <!-- Main Content -->
                <main class="flex-1 p-6 bg-gray-100">
                    <NuxtPage />
                </main>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
    import { useHead } from 'nuxt/app'

    // You can set page titles and meta using useHead composable from Nuxt 3
    useHead({
        title: 'Dashboard'
    })
</script>

<style scoped>
    /* Add any custom scoped styles for the layout */
</style>
