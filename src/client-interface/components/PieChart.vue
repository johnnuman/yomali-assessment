<template>
    <div>
        <!-- Chart for Pie -->
        <canvas ref="chart"></canvas>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';
    import {
        Chart,
        PieController,
        ArcElement,
        Tooltip,
        Legend,
    } from 'chart.js';

    // Register necessary components for Pie chart
    Chart.register(PieController, ArcElement, Tooltip, Legend);

    const chart = ref(null);
    const chartInstance = ref(null);
    const props = defineProps({
        chartData: Object,
        chartLabel: String,
    });

    onMounted(() => {
        createChart();
    });

    watch(() => props.chartData, () => {
        if (chartInstance.value) {
            chartInstance.value.destroy();  // Destroy existing chart before re-rendering
        }
        createChart();
    });

    // Function to create the pie chart
    const createChart = () => {
        const data = props.chartData;
        chartInstance.value = new Chart(chart.value, {
            type: 'pie',
            data: {
                labels: Object.keys(data),  // Labels from keys
                datasets: [{
                    data: Object.values(data),  // Values for the pie chart
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                    ],
                }],
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: props.chartLabel,
                    },
                },
            },
        });
    };
</script>

<style scoped>
    /* Add any necessary styles here */
</style>
