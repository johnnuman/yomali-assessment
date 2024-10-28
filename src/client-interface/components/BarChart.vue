<template>
    <div>
        <canvas ref="barChart"></canvas>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { Chart, registerables } from 'chart.js';

    Chart.register(...registerables);

    const props = defineProps({
        chartData: {
            type: Object,
            required: true
        },
        chartLabel: {
            type: String,
            required: true
        }
    });

    const barChart = ref(null);
    let chartInstance = null;

    // Function to create the bar chart
    const createBarChart = () => {
        if (chartInstance) {
            chartInstance.destroy(); // Destroy the previous chart instance before creating a new one
        }

        const data = {
            labels: Object.keys(props.chartData),
            datasets: [{
                label: props.chartLabel,
                data: Object.values(props.chartData),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        chartInstance = new Chart(barChart.value, config);
    };

    // Watch for changes in the chart data and update the chart accordingly
    watch(() => props.chartData, () => {
        createBarChart();
    });

    // Create the chart when the component is mounted
    onMounted(() => {
        createBarChart();
    });
</script>

<style scoped>
    canvas {
        max-width: 100%;
        max-height: 400px;
    }
</style>
