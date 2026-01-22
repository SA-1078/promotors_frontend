import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
    size?: 'sm' | 'md';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = ''
}) => {
    const variants = {
        primary: "bg-primary-500/10 text-primary-500 border-primary-500/20",
        success: "bg-accent-green/10 text-accent-green border-accent-green/20",
        warning: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20",
        danger: "bg-accent-red/10 text-accent-red border-accent-red/20",
        info: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
        dark: "bg-dark-700 text-gray-300 border-dark-600"
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm"
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
};
