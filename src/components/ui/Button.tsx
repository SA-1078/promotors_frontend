import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
    to?: string;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    to,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20 hover:shadow-primary-600/30 hover:-translate-y-0.5",
        secondary: "bg-dark-700 hover:bg-dark-600 text-white border border-dark-600 hover:border-dark-500",
        outline: "border-2 border-primary-600 text-primary-500 hover:bg-primary-600 hover:text-white",
        ghost: "text-gray-400 hover:text-white hover:bg-dark-800",
        danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg font-bold tracking-wide"
    };

    const widthClass = fullWidth ? "w-full" : "";
    const loadingClass = isLoading ? "opacity-75 cursor-wait" : "";

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${loadingClass} ${className}`;

    const content = (
        <>
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!isLoading && icon && <span className="mr-2">{icon}</span>}
            {children}
        </>
    );

    if (to && !disabled) {
        return (
            <Link to={to} className={combinedClasses}>
                {content}
            </Link>
        );
    }

    return (
        <button className={combinedClasses} disabled={disabled || isLoading} {...props}>
            {content}
        </button>
    );
};
