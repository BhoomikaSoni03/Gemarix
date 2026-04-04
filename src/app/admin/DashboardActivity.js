'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement,
    LineElement, Filler, Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

// Generate simulated 7-day lead activity
function mockWeekData(total) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const base  = Math.max(1, Math.floor(total / 14));
    return days.map(() => Math.max(0, base + Math.floor((Math.random() - 0.4) * base * 3)));
}

export default function DashboardActivity({ totalLeads }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const data = mockWeekData(totalLeads || 5);

    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            data,
            fill:            true,
            tension:         0.45,
            borderColor:     '#d4af37',
            borderWidth:     2,
            pointRadius:     3,
            pointBackgroundColor: '#d4af37',
            backgroundColor: (ctx) => {
                if (!ctx.chart.chartArea) return 'transparent';
                const gradient = ctx.chart.ctx.createLinearGradient(
                    0, ctx.chart.chartArea.top, 0, ctx.chart.chartArea.bottom
                );
                gradient.addColorStop(0,   'rgba(212,175,55,0.3)');
                gradient.addColorStop(1,   'rgba(212,175,55,0)');
                return gradient;
            },
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 }, stepSize: 1 }, beginAtZero: true },
        },
    };

    return (
        <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--a-text)' }}>
                    Lead Activity
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--a-text-muted)' }}>
                    Simulated · Last 7 days
                </span>
            </div>
            <div style={{ height: 130 }}>
                {mounted ? <Line data={chartData} options={options} /> : null}
            </div>
        </div>
    );
}
