<template>
    <div class="dashboard-container">
        <h1 class="chart-title">Yomali Assessment - Web Analytics</h1>
        <FilterBar @filterChange="onFilterChange" />

        <div class="chart-grid">
            <div class="chart-column">
                <h1 class="chart-title">Daily Views</h1>
                <DailyViewsChart ref="dailyViewsChart" />
            </div>

            <div class="chart-column">
                <h1 class="chart-title">Browser Types</h1>
                <BarChart :chartData="browserData" chartLabel="Browser Types" />
            </div>

            <div class="chart-column">
                <h1 class="chart-title">Device Types</h1>
                <BarChart :chartData="deviceData" chartLabel="Device Types" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, nextTick } from 'vue';
    import { useRuntimeConfig, useHead } from '#app';

    const visits = ref([]);
    const browserData = ref({});
    const deviceData = ref({});
    const dailyViewsChart = ref(null);
    const loading = ref(false);
    const config = useRuntimeConfig();

    useHead({
        title: 'Yomali Assessment'
    });

    const fetchAnalytics = async (filterData) => {
        loading.value = true;
        const { domain, startDate, endDate } = filterData;

        try {
            const response = await fetch(`${config.public.apiURL}/visits?domain=${domain}&startDate=${startDate}&endDate=${endDate}`);
            const data = await response.json();
            visits.value = data;

            await nextTick();
            if (dailyViewsChart.value) {
                dailyViewsChart.value.loadChartData(data);
            }

            const browserResponse = await fetch(`${config.public.apiURL}/browsers?domain=${domain}&startDate=${startDate}&endDate=${endDate}`);
            const browserStats = await browserResponse.json();
            browserData.value = browserStats;

            const deviceResponse = await fetch(`${config.public.apiURL}/devices?domain=${domain}&startDate=${startDate}&endDate=${endDate}`);
            const deviceStats = await deviceResponse.json();
            deviceData.value = deviceStats;

        } catch (error) {
            console.error('Error fetching data:', error);
            visits.value = [];
            browserData.value = {};
            deviceData.value = {};
        } finally {
            loading.value = false;
        }
    };

    const onFilterChange = (filterData) => {
        fetchAnalytics(filterData);
    };
</script>

<style scoped>
    .dashboard-container {
        min-height: 100vh;
        background-color: #e2e8f0;
        padding: 20px;
    }

    .chart-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 20px;
        padding: 20px;
    }

    .chart-column {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
    }

    .chart-title {
        font-size: 24px;
        font-weight: bold;
        color: #005A9E;
        margin-bottom: 15px;
        text-align: center;
    }

    @media (max-width: 768px) {
        .chart-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
