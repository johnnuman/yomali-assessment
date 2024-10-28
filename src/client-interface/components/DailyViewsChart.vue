<template>
    <div>
        <!-- Chart for Daily Views -->
        <canvas ref="chart" class="mt-8"></canvas>

        <!-- Drill-down Section -->
        <div v-if="drillDownPages.length > 0" class="mt-8">
            <h2 class="text-2xl font-semibold text-dark-blue mb-4">Page Views for {{ selectedDate }}</h2>

            <!-- Show total views for the domain -->
            <div class="text-lg mb-4">
                <strong>Total Views for Domain: </strong> {{ totalViewsForDomain }}
            </div>

            <!-- Table showing views for individual pages -->
            <table class="min-w-full bg-white border border-gray-200 rounded-lg mt-4">
                <thead>
                <tr class="bg-blue-100 text-blue-900">
                    <th class="py-2 px-4 border-b text-left">Page URL</th>
                    <th class="py-2 px-4 border-b text-right">Total Views</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(page, index) in drillDownPages" :key="page.page_url" :class="{'bg-gray-100': index % 2 === 0}">
                    <td class="py-2 px-4 border-b text-left">{{ page.page_url }}</td>
                    <td class="py-2 px-4 border-b text-right">{{ page.totalViews }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Title,
        Tooltip,
        Legend,
    } from 'chart.js';

    // Register the required components
    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

    // Reactive state for the chart and drill-down data
    const visits = ref([]);  // Store raw visit data
    const consolidatedData = ref([]);  // Store consolidated data (views by date)
    const drillDownPages = ref([]);  // Store page-level data for drill-down
    const selectedDate = ref('');  // Store the selected date for drill-down
    const totalViewsForDomain = ref(0);  // Store the total views for the selected domain for that date
    const chart = ref(null);  // Chart.js reference
    const chartInstance = ref(null);  // Store the chart instance for updates

    // Load data into the chart
    const loadChartData = (data) => {
        visits.value = data;
        drillDownPages.value = [];

        // Consolidate data by date
        const consolidated = {};
        data.forEach((visit) => {
            if (!consolidated[visit.date]) {
                consolidated[visit.date] = { views: 0, pages: {} };
            }
            consolidated[visit.date].views += visit.views;
            if (!consolidated[visit.date].pages[visit.page_url]) {
                consolidated[visit.date].pages[visit.page_url] = 0;
            }
            consolidated[visit.date].pages[visit.page_url] += visit.views;  // Aggregate views by page for that date
        });

        consolidatedData.value = Object.keys(consolidated).map(date => ({
            date,
            views: consolidated[date].views,
            pages: consolidated[date].pages,
        }));

        // Update the chart with the new consolidated data
        updateChart();
    };

    // Function to create/update the chart
    const updateChart = () => {
        const labels = consolidatedData.value.map(item => item.date);
        const data = consolidatedData.value.map(item => item.views);

        // If chart already exists, destroy it before creating a new one
        if (chartInstance.value) {
            chartInstance.value.destroy();
        }

        // Create the chart
        chartInstance.value = new Chart(chart.value, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Daily Views',
                    data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Daily Views (Click a point to see page details)',  // Adding a hint to users
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw} views (click for details)`;  // Adding tooltip hint
                            }
                        }
                    }
                },
                onClick: (e, activeElements) => {
                    if (activeElements.length) {
                        const index = activeElements[0].index;
                        const date = labels[index];
                        showDrillDownData(date);  // Handle drill-down on click
                    }
                },
            },
        });
    };

    // Function to show drill-down data for a specific date
    const showDrillDownData = (date) => {
        selectedDate.value = date;
        const foundData = consolidatedData.value.find(item => item.date === date);
        if (foundData) {
            // Set total views for the domain on the selected date
            totalViewsForDomain.value = foundData.views;

            // Aggregate total views per page for the selected date
            const pages = Object.keys(foundData.pages).map(pageUrl => ({
                page_url: pageUrl,
                totalViews: foundData.pages[pageUrl],
            }));
            drillDownPages.value = pages;
        }
    };

    // Expose loadChartData method so the parent component can call it
    defineExpose({
        loadChartData
    });
</script>

<style scoped>
    .text-dark-blue {
        color: #005A9E;
    }
    .bg-gray-100 {
        background-color: #f7fafc;
    }
    /* Styles for the table */
    table {
        width: 100%;
        border-collapse: collapse; /* Ensure that borders are not duplicated */
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow to the table */
        margin: 20px 0;
    }

    /* Table cells (both td and th) have borders */
    table td, table th {
        border: 1px solid #dddddd; /* Light gray border around cells */
        padding: 8px; /* Add some padding for better readability */
        text-align: left; /* Align text to the left */
    }

    /* Optional: Add a background color to the table header */
    table th {
        background-color: #f4f4f4; /* Light background for header cells */
        font-weight: bold; /* Bold text in header */
    }

    /* Optional: Add alternating row colors */
    table tr:nth-child(even) {
        background-color: #f9f9f9;
    }

</style>
