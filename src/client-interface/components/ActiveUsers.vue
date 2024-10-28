<template>
    <div class="active-users">
        <h2>Active Users: {{ activeUsers }}</h2>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';

    const activeUsers = ref(0);

    // Fetch active users data (using composable or axios)
    onMounted(() => {
        fetchActiveUsers();
    });

    function fetchActiveUsers() {
        // Replace this with actual API call
        activeUsers.value = 10; // Mock data
    }
</script>

<style scoped>
    .active-users {
        /* Add styles */
    }
</style>
