const chart = document.getElementById('{plot_id}');
const resetButton = document.getElementById('reset-layout');
const initialData = JSON.parse(JSON.stringify(chart.data));
const initialLayout = JSON.parse(JSON.stringify(chart.layout));

resetButton.addEventListener('click', async () => {
    resetButton.disabled = true;
    try {
        await Plotly.react(chart,
            JSON.parse(JSON.stringify(initialData)),
            JSON.parse(JSON.stringify(initialLayout)),
            {responsive: true, displaylogo: false});
        chart.closest('.plot-scroll').scrollLeft = 0;
    } finally {
        resetButton.disabled = false;
    }
});
