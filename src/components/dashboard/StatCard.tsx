import { useCounterAnimation } from '../../hooks/useCounterAnimation';
import { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/format';

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    variant: 'revenue' | 'orders' | 'users' | 'inventory';
    isCurrency?: boolean;
}

const variantStyles = {
    revenue: {
        gradient: 'from-emerald-500 to-teal-600',
        iconBg: 'bg-emerald-500/20',
        iconColor: 'text-emerald-400',
        glow: 'shadow-emerald-500/20',
    },
    orders: {
        gradient: 'from-blue-500 to-cyan-600',
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-400',
        glow: 'shadow-blue-500/20',
    },
    users: {
        gradient: 'from-purple-500 to-pink-600',
        iconBg: 'bg-purple-500/20',
        iconColor: 'text-purple-400',
        glow: 'shadow-purple-500/20',
    },
    inventory: {
        gradient: 'from-orange-500 to-red-600',
        iconBg: 'bg-orange-500/20',
        iconColor: 'text-orange-400',
        glow: 'shadow-orange-500/20',
    },
};

export function StatCard({ title, value, subtitle, icon, trend, variant, isCurrency = false }: StatCardProps) {
    const numericValue = typeof value === 'string' ? 0 : value;
    const animatedValue = useCounterAnimation(numericValue, { duration: 2000 });
    const [isVisible, setIsVisible] = useState(false);
    const styles = variantStyles[variant];

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const displayValue = typeof value === 'string'
        ? value
        : isCurrency
            ? formatCurrency(animatedValue)
            : animatedValue.toLocaleString();

    return (
        <div
            className={`
                relative overflow-hidden rounded-2xl border border-dark-700 
                bg-gradient-to-br ${styles.gradient} p-[2px]
                transition-all duration-500 hover:scale-105 hover:shadow-2xl ${styles.glow}
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
        >
            {/* Inner card */}
            <div className="relative h-full bg-dark-900 rounded-2xl p-6">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <div className={`w-full h-full bg-gradient-to-br ${styles.gradient} rounded-full blur-2xl`}></div>
                </div>

                {/* Icon */}
                <div className={`${styles.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <div className={styles.iconColor}>{icon}</div>
                </div>

                {/* Title */}
                <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>

                {/* Value */}
                <p className="text-3xl md:text-4xl font-bold text-white mb-1 font-display">
                    {displayValue}
                </p>

                {/* Subtitle and Trend */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{subtitle}</p>
                    {trend && (
                        <div className={`flex items-center text-xs font-semibold ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            <svg
                                className={`w-4 h-4 ${trend.isPositive ? '' : 'rotate-180'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-1">{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
