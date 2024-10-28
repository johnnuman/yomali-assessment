<template>
    <div class="bg-light-blue py-4 px-8 shadow-md">
        <div class="flex justify-between items-center space-x-4">
            <!-- Domain Selection -->
            <div class="flex flex-col">
                <label class="text-blue-800 font-semibold mb-1">Select Domain:</label>
                <select v-model="selectedDomain" @change="onFilterChange"
                        class="border border-blue-300 text-blue-900 bg-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-300 ease-in-out">
                    <option v-for="domain in domains" :key="domain" :value="domain">
                        {{ domain }}
                    </option>
                </select>
            </div>

            <!-- Date Range Picker -->
            <div class="flex flex-col">
                <label class="text-blue-800 font-semibold mb-1">Select Date Range:</label>
                <div class="flex space-x-2">
                    <input type="date" v-model="startDate" @change="onFilterChange"
                           class="border border-blue-300 text-blue-900 bg-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-300 ease-in-out" />
                    <input type="date" v-model="endDate" @change="onFilterChange"
                           class="border border-blue-300 text-blue-900 bg-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-300 ease-in-out" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, defineEmits } from 'vue';
    import { useRuntimeConfig } from '#app';

    const domains = ref([]);
    const selectedDomain = ref('');
    const startDate = ref('');
    const endDate = ref('');
    const config = useRuntimeConfig();

    const emit = defineEmits(['filterChange']);

    // Helper function to get the date in 'YYYY-MM-DD' format
    const formatDate = (date) => {
        const d = new Date(date);
        const month = '' + (d.getMonth() + 1);
        const day = '' + d.getDate();
        const year = d.getFullYear();
        return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    };


    // Fetch domains on mount
    onMounted(async () => {
        const today = new Date();
        const last30Days = new Date();
        last30Days.setDate(today.getDate() - 30);

        startDate.value = formatDate(last30Days);  // 30 days ago
        endDate.value = formatDate(today);         // Today

        const response = await fetch(`${config.public.apiURL}/domains`);
        const data = await response.json();
        domains.value = data;
        selectedDomain.value = domains.value[0] || '';

        emit('filterChange', {
            domain: selectedDomain.value,
            startDate: startDate.value,
            endDate: endDate.value
        });
    });

    // Emit filter change to parent component (dashboard)
    const onFilterChange = () => {
        const filterData = {
            domain: selectedDomain.value,
            startDate: startDate.value,
            endDate: endDate.value
        };
        // Emit the filter change event
        emit('filterChange', filterData)
    }
</script>

<style scoped>
    .bg-light-blue {
        background-color: #f0f4f8;
    }
</style>
