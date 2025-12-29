import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import type { Subscription } from '../../../../types';
import './SpendingGraph.css';

interface SpendingGraphProps {
    subscriptions: Subscription[];
}

const SpendingGraph: React.FC<SpendingGraphProps> = ({ subscriptions }) => {
    const { chartData, totalYearly } = useMemo(() => {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        // Initialize data structure
        const data = months.map(name => ({ name, value: 0 }));
        let yearlyTotal = 0;

        subscriptions.forEach(sub => {
            // Logic: Only calculate for active subscriptions
            if (sub.status !== 'Active') return;

            const price = parseFloat(sub.price.replace('$', ''));
            if (isNaN(price)) return;

            if (sub.payCycle === 'Monthly') {
                // Add to every month
                data.forEach(month => {
                    month.value += price;
                });
                yearlyTotal += price * 12;
            } else if (sub.payCycle === 'Yearly') {
                // Add only to renewal month
                // format: DD/MM/YYYY
                const parts = sub.renewalDate.split('/');
                if (parts.length === 3) {
                    // parts[1] is month (1-12)
                    const monthIndex = parseInt(parts[1], 10) - 1;
                    if (monthIndex >= 0 && monthIndex < 12) {
                        data[monthIndex].value += price;
                    }
                }
                yearlyTotal += price;
            }
        });

        return { chartData: data, totalYearly: yearlyTotal };
    }, [subscriptions]);

    return (
        <div className="spending-graph-card">
            <div className="spending-header">
                <h3>Total Projected Yearly Spending</h3>
                <p className="total-amount">${totalYearly.toFixed(2)}</p>
            </div>
            <div className="graph-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} interval={0} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', background: '#333', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, 'Spending'] as [string, string]}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill="#adfa1d" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SpendingGraph;
