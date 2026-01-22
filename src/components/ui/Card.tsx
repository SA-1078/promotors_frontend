import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'outline';
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    hover = false
}) => {
    const baseStyles = "rounded-xl overflow-hidden transition-all duration-300";

    const variants = {
        default: "bg-dark-800 border border-dark-700 shadow-xl",
        glass: "bg-dark-800/60 backdrop-blur-md border border-dark-700/50 shadow-2xl",
        outline: "bg-transparent border border-dark-700"
    };

    const hoverStyles = hover ? "hover:translate-y-[-4px] hover:shadow-2xl hover:border-primary-500/30 group" : "";

    return (
        <div className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`p-6 border-b border-dark-700/50 ${className}`}>
        {children}
    </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`p-6 border-t border-dark-700/50 bg-dark-900/30 ${className}`}>
        {children}
    </div>
);
