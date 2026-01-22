import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    fullWidth = true,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || props.name;

    return (
        <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-500 transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={`
                        w-full bg-dark-800 border border-dark-700 rounded-lg 
                        ${icon ? 'pl-10' : 'px-4'} py-3 
                        text-white placeholder-gray-500
                        transition-all duration-300
                        focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                        disabled:opacity-50 disabled:bg-dark-900
                        ${error ? 'border-accent-red focus:border-accent-red focus:ring-accent-red' : 'hover:border-dark-600'}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-xs text-accent-red ml-1">{error}</p>
            )}
        </div>
    );
};
