<template>
    <div class="bg-light-blue py-4 px-8 shadow-md">
        <div class="flex justify-between items-center space-x-4">
            <div class="flex flex-col">
                <label class="text-blue-800 font-semibold mb-1">Select Domain:</label>
                <select v-model="selectedDomain" @change="onFilterChange"
                        class="border border-blue-300 bg-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-300 ease-in-out">
                    <option v-for="domain in domains" :key="domain" :value="domain">
                        {{ domain }}
                    </option>
                </select>
            </div>

            <div class="flex flex-col">
                <label class="text-blue-800 font-semibold mb-1">Select Date Range:</label>
                <div class="flex space-x-2">
                    <input type="date" v-model="startDate" @change="onFilterChange"
                           class="border border-blue-300 text-blue-900 bg-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-300 ease-in-out" style="margin-right:20px" />
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

    const formatDate = (date) => {
        const d = new Date(date);
        const month = '' + (d.getMonth() + 1);
        const day = '' + d.getDate();
        const year = d.getFullYear();
        return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    };

    onMounted(async () => {
        const today = new Date();
        const last30Days = new Date();
        last30Days.setDate(today.getDate() - 30);

        startDate.value = formatDate(last30Days);
        endDate.value = formatDate(today);

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

    const onFilterChange = () => {
        const filterData = {
            domain: selectedDomain.value,
            startDate: startDate.value + ' 00:00:00',
            endDate: endDate.value + ' 23:59:59'
        };
        emit('filterChange', filterData)
    }
</script>

<style scoped>
    .bg-light-blue {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin: 20px;
    }
    .text-blue-800 {
        font-weight: bold;
        display: block;
        margin: 5px;
    }
</style>
