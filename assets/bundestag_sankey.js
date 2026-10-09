const chart = document.getElementById('{plot_id}');
const desktopAnnotations = JSON.parse(JSON.stringify(chart.layout.annotations));
const guidance = document.querySelector('.guidance-toggle');
let compactLayout;
let pendingFrame;
const originalTraces = chart.data.map(trace => ({
    x: [...trace.x], y: [...trace.y], meta: trace.meta, text: trace.text
}));
const originalShapes = JSON.parse(JSON.stringify(chart.layout.shapes));
const nodes = new Map();
originalTraces.forEach((trace, index) => {
    if (trace.meta?.kind !== 'node') return;
    nodes.set(trace.meta.node_id, {
        index, dx: 0, dy: 0,
        x0: Math.min(...trace.x), x1: Math.max(...trace.x),
        y0: Math.min(...trace.y), y1: Math.max(...trace.y)
    });
});

function offsetAnnotation(item) {
    const node = nodes.get((item.name || '').replace(/^node-/, ''));
    if (node) { item.x += node.dx; item.y += node.dy; }
    return item;
}

function positionedAnnotations() {
    return desktopAnnotations.map(original => {
        const item = JSON.parse(JSON.stringify(original));
        if (!compactLayout) return offsetAnnotation(item);
        const name = item.name || '';
        if (name.startsWith('node-')) {
            const left = name.endsWith('_2021');
            item.x = left ? 0.042 : 0.958;
            item.xanchor = left ? 'left' : 'right';
            item.font = {...item.font, size: 11};
            item.bgcolor = 'rgba(13,17,23,0.88)';
            item.borderpad = 2;
            item.text = item.text.replace('Other parties', 'Others');
        } else if (name.startsWith('year-')) {
            item.xanchor = 'center';
            item.text = name.endsWith('2021') ? '<b>2021</b>' : '<b>2025</b>';
            item.y = 1.053;
        } else if (name.startsWith('basis-')) {
            item.xanchor = 'center';
            item.text = 'Second votes · 100%';
            item.font = {...item.font, size: 10};
            item.y = 1.027;
        } else if (name === 'non-voters-basis') {
            item.text = 'Non-voters · % of eligible voters';
            item.font = {...item.font, size: 10};
            item.bgcolor = '#0d1117';
        }
        return offsetAnnotation(item);
    });
}

function adaptChart() {
    const compact = chart.parentElement.clientWidth < 640;
    if (compact === compactLayout) return;
    compactLayout = compact;
    // Only change the disclosure when crossing the breakpoint; preserve a user's
    // choice while scrolling or resizing within the same layout.
    if (guidance) guidance.open = !compact;
    Plotly.relayout(chart, {
        annotations: positionedAnnotations(),
        height: compact ? 900 : 1040,
        margin: compact ? {l: 4, r: 4, t: 54, b: 16} : {l: 8, r: 8, t: 65, b: 26},
        'xaxis.range': compact ? [-0.025, 1.025] : [-0.29, 1.29],
        'hoverlabel.font.size': compact ? 11 : 13
    });
}

// Transparent, focusable handles keep dragging independent of Plotly's hover
// layer. Only the handles capture touch; the ribbons remain scrollable on phones.
const overlay = document.createElement('div');
overlay.className = 'node-handles';
chart.append(overlay);
const resetButton = document.getElementById('reset-layout');
const selection = document.getElementById('node-selection');
let activeDrag;
let drawing = false;
let redrawRequested = false;

function clampOffset(node, dx, dy) {
    // Keep each year on its own half; bar heights and ribbon widths never change.
    const left = node.x0 < 0.5;
    node.dx = Math.max(left ? 0 : -0.3, Math.min(left ? 0.3 : 0, dx));
    node.dy = Math.max(-node.y0, Math.min(154 - node.y1, dy));
}

function renderPositions() {
    const positions = originalTraces.map(trace => {
        if (trace.meta?.kind === 'node') {
            const node = nodes.get(trace.meta.node_id);
            return {x: trace.x.map(x => x + node.dx), y: trace.y.map(y => y + node.dy)};
        }
        const source = nodes.get(trace.meta.source);
        const target = nodes.get(trace.meta.target);
        const samples = (trace.x.length - 1) / 2;
        const shift = (i, axis) => {
            const j = i === samples * 2 ? 0 : (i < samples ? i : samples * 2 - 1 - i);
            const t = j / (samples - 1);
            const blend = 3*t*t - 2*t*t*t;
            return (1-blend) * source[axis] + blend * target[axis];
        };
        return {
            x: trace.x.map((x, i) => x + shift(i, 'dx')),
            y: trace.y.map((y, i) => y + shift(i, 'dy'))
        };
    });
    const shapes = originalShapes.map(original => {
        const shape = {...original};
        const node = nodes.get((shape.name || '').replace(/^used-/, ''));
        if (node) {
            shape.x0 += node.dx; shape.x1 += node.dx;
            shape.y0 += node.dy; shape.y1 += node.dy;
        }
        return shape;
    });
    return Plotly.update(chart, {
        x: positions.map(position => position.x),
        y: positions.map(position => position.y)
    }, {annotations: positionedAnnotations(), shapes});
}

function scheduleDraw() {
    redrawRequested = true;
    if (drawing) return;
    drawing = true;
    requestAnimationFrame(async () => {
        redrawRequested = false;
        try { await renderPositions(); }
        finally {
            drawing = false;
            if (redrawRequested) scheduleDraw();
        }
    });
}

function selectNode(node) {
    const text = document.createElement('div');
    text.innerHTML = originalTraces[node.index].text.replaceAll('<br>', ' · ');
    selection.textContent = text.textContent;
    selection.hidden = false;
}

function createHandle(id, node, part) {
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'node-handle';
    handle.dataset.nodeId = id;
    handle.dataset.part = part;
    handle.setAttribute('aria-label', `Move ${chart.data[node.index].name}. Use arrow keys; Shift for larger steps.`);
    handle.title = `Drag ${chart.data[node.index].name} to move; tap for details`;
    handle.addEventListener('pointerdown', event => {
        if (!event.isPrimary || event.button !== 0) return;
        const axes = chart._fullLayout;
        activeDrag = {
            id: event.pointerId, node, startX: event.clientX, startY: event.clientY,
            dx: node.dx, dy: node.dy,
            scaleX: (axes.xaxis.range[1] - axes.xaxis.range[0]) / axes.xaxis._length,
            scaleY: (axes.yaxis.range[1] - axes.yaxis.range[0]) / axes.yaxis._length
        };
        handle.setPointerCapture(event.pointerId);
        handle.classList.add('is-dragging');
        event.stopPropagation();
    });
    handle.addEventListener('pointermove', event => {
        if (activeDrag?.id !== event.pointerId) return;
        const drag = activeDrag;
        clampOffset(node,
            drag.dx + (event.clientX - drag.startX) * drag.scaleX,
            drag.dy - (event.clientY - drag.startY) * drag.scaleY);
        scheduleDraw();
    });
    const finish = event => {
        if (activeDrag?.id !== event.pointerId) return;
        activeDrag = undefined;
        handle.classList.remove('is-dragging');
        if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    };
    handle.addEventListener('pointerup', finish);
    handle.addEventListener('pointercancel', finish);
    handle.addEventListener('lostpointercapture', finish);
    handle.addEventListener('click', () => selectNode(node));
    handle.addEventListener('keydown', event => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const step = event.shiftKey ? 5 : 1;
        clampOffset(node,
            node.dx + (event.key === 'ArrowLeft' ? -0.01*step : event.key === 'ArrowRight' ? 0.01*step : 0),
            node.dy + (event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0));
        scheduleDraw();
    });
    overlay.append(handle);
    return handle;
}

for (const [id, node] of nodes) {
    node.barHandle = createHandle(id, node, 'bar');
    node.labelHandle = createHandle(id, node, 'label');
}

function syncHandles() {
    const {xaxis, yaxis} = chart._fullLayout;
    const chartRect = chart.getBoundingClientRect();
    const place = (handle, left, top, width, height) => Object.assign(handle.style, {
        left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px`
    });
    for (const [id, node] of nodes) {
        const x0 = xaxis._offset + xaxis.l2p(node.x0 + node.dx);
        const x1 = xaxis._offset + xaxis.l2p(node.x1 + node.dx);
        const y0 = yaxis._offset + yaxis.l2p(node.y0 + node.dy);
        const y1 = yaxis._offset + yaxis.l2p(node.y1 + node.dy);
        const width = Math.max(24, x1 - x0);
        place(node.barHandle, (x0+x1-width)/2, y0, width, Math.max(20, y1-y0));
        const index = chart.layout.annotations.findIndex(a => a.name === `node-${id}`);
        const annotation = chart.querySelector(`.annotation[data-index="${index}"]`);
        if (annotation) {
            const rect = annotation.getBoundingClientRect();
            place(node.labelHandle, rect.left-chartRect.left, rect.top-chartRect.top-3, rect.width, rect.height+6);
        }
    }
}

chart.on('plotly_afterplot', syncHandles);
resetButton.addEventListener('click', async () => {
    for (const node of nodes.values()) { node.dx = 0; node.dy = 0; }
    selection.hidden = true;
    await renderPositions();
    await Plotly.relayout(chart, {
        'xaxis.range': compactLayout ? [-0.025, 1.025] : [-0.29, 1.29],
        'yaxis.range': [154, -1]
    });
    chart.parentElement.scrollLeft = 0;
});

adaptChart();
syncHandles();
new ResizeObserver(() => {
    cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(adaptChart);
}).observe(chart.parentElement);
