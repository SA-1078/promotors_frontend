import { Link } from 'react-router-dom';

interface QuickActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    to: string;
    variant: 'primary' | 'secondary' | 'success' | 'warning';
}

const variantStyles = {
    primary: {
        gradient: 'from-primary-500 to-orange-600',
        iconBg: 'bg-primary-500/20',
        hoverShadow: 'hover:shadow-primary-500/30',
    },
    secondary: {
        gradient: 'from-blue-500 to-cyan-600',
        iconBg: 'bg-blue-500/20',
        hoverShadow: 'hover:shadow-blue-500/30',
    },
    success: {
        gradient: 'from-emerald-500 to-green-600',
        iconBg: 'bg-emerald-500/20',
        hoverShadow: 'hover:shadow-emerald-500/30',
    },
    warning: {
        gradient: 'from-purple-500 to-pink-600',
        iconBg: 'bg-purple-500/20',
        hoverShadow: 'hover:shadow-purple-500/30',
    },
};

export function QuickActionCard({ title, description, icon, to, variant }: QuickActionCardProps) {
    const styles = variantStyles[variant];

    return (
        <Link
            to={to}
            className={`
                group relative overflow-hidden rounded-xl border border-dark-700 
                bg-dark-800 p-5 transition-all duration-300
                hover:scale-105 hover:border-transparent hover:shadow-2xl ${styles.hoverShadow}
            `}
        >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

            <div className="relative flex items-center gap-4">
                {/* Icon */}
                <div className={`${styles.iconBg} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <div className="w-6 h-6 text-white">{icon}</div>
                </div>

                {/* Text */}
                <div className="flex-1">
                    <h4 className="font-bold text-white text-base mb-1 group-hover:text-primary-400 transition-colors">
                        {title}
                    </h4>
                    <p className="text-xs text-gray-400">{description}</p>
                </div>

                {/* Arrow */}
                <svg
                    className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
}
