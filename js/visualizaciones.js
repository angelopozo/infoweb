
const canvases = document.querySelectorAll('canvas[data-visualizacion]');

if (canvases.length) {
  const dataCache = {};
  const dataUrl = new URL('../data/datos.json', import.meta.url);

  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    const r = Math.max(0, Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2));
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, width, height, r);
    } else {
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
    }
  };

  const fetchData = async () => {
    if (dataCache.__loaded) return dataCache.__loaded;
    try {
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`Error al cargar datos: ${response.status}`);
      }
      const json = await response.json();
      dataCache.__loaded = json;
      return json;
    } catch (error) {
      console.error('No fue posible cargar los datos de visualización', error);
      return null;
    }
  };

  const drawChart = (canvas, dataset) => {
    if (!dataset) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { labels = [], datasets = [], meta = {} } = dataset;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const padding = 56;
    const axisColor = '#0f637d';
    const gridColor = 'rgba(15, 99, 125, 0.12)';
    const font = '16px "Inter", "Poppins", system-ui, sans-serif';

    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    const values = datasets.flatMap((series) => series.values ?? []);
    const maxValue = Math.max(1, ...values);

    const ySteps = 4;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;

    ctx.save();
    ctx.translate(padding, padding);

    // Grid lines and axis labels
    ctx.font = '12px "Inter", system-ui';
    ctx.fillStyle = axisColor;
    ctx.textAlign = 'right';

    for (let i = 0; i <= ySteps; i++) {
      const ratio = i / ySteps;
      const y = chartHeight - ratio * chartHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.globalAlpha = i === 0 ? 0.3 : 0.15;
      ctx.stroke();
      ctx.globalAlpha = 1;
      const labelValue = (ratio * maxValue).toFixed(2);
      ctx.fillText(labelValue, -10, y + 4);
    }

    // Bars
    const groupWidth = chartWidth / labels.length;
    const groupGap = Math.min(24, groupWidth * 0.2);
    const barWidth = (groupWidth - groupGap) / datasets.length;

    labels.forEach((label, labelIndex) => {
      const baseX = labelIndex * groupWidth + groupGap / 2;
      datasets.forEach((series, seriesIndex) => {
        const value = series.values?.[labelIndex] ?? 0;
        const barHeight = (value / maxValue) * chartHeight;
        const x = baseX + seriesIndex * barWidth;
        const y = chartHeight - barHeight;
        ctx.fillStyle = series.color ?? '#1a5f40';
        drawRoundedRect(ctx, x, y, barWidth - 4, barHeight, 6);
        ctx.fill();
      });
    });

    // Axis labels
    ctx.fillStyle = axisColor;
    ctx.textAlign = 'center';
    ctx.font = '13px "Inter", system-ui';
    labels.forEach((label, index) => {
      const x = index * groupWidth + groupWidth / 2;
      ctx.fillText(label, x, chartHeight + 24);
    });

    // Legend
    ctx.textAlign = 'left';
    ctx.font = '13px "Inter", system-ui';
    datasets.forEach((series, index) => {
      const legendX = 0;
      const legendY = chartHeight + 50 + index * 20;
      ctx.fillStyle = series.color ?? '#1a5f40';
      ctx.fillRect(legendX, legendY - 12, 14, 14);
      ctx.fillStyle = axisColor;
      ctx.fillText(series.label ?? `Serie ${index + 1}`, legendX + 22, legendY);
    });

    if (meta?.footnote) {
      ctx.fillStyle = 'rgba(16,42,67,0.55)';
      ctx.font = '11px "Inter", system-ui';
      ctx.fillText(meta.footnote, 0, chartHeight + 20);
    }

    ctx.restore();
  };

  const hydrate = async () => {
    const json = await fetchData();
    if (!json) return;
    canvases.forEach((canvas) => {
      const key = canvas.getAttribute('data-visualizacion');
      if (!key) return;
      const dataset = json[key];
      drawChart(canvas, dataset);
    });
  };

  hydrate();
}
