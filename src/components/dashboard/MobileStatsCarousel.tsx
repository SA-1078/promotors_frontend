import { useState, useEffect } from 'react';
import { StatCard } from './StatCard';

interface StatData {
    title: string;
    value: number | string;
    subtitle: string;
    icon: React.ReactNode;
    variant: 'orders' | 'revenue' | 'users' | 'inventory';
    isCurrency?: boolean;
}

interface MobileStatsCarouselProps {
    stats: StatData[];
}

export function MobileStatsCarousel({ stats }: MobileStatsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Auto-advance every 4 seconds
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % stats.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [stats.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + stats.length) % stats.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % stats.length);
    };

    return (
        <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="w-full flex-shrink-0 px-1">
                            <StatCard
                                title={stat.title}
                                value={stat.value}
                                subtitle={stat.subtitle}
                                icon={stat.icon}
                                variant={stat.variant}
                                isCurrency={stat.isCurrency}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-3 mt-4">
                {/* Previous Button */}
                <button
                    onClick={goToPrevious}
                    className="p-2 rounded-full bg-dark-800 border border-dark-700 hover:bg-dark-700 hover:border-primary-500 transition-all"
                    aria-label="Anterior"
                >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Indicators */}
                <div className="flex gap-2">
                    {stats.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                ? 'bg-primary-500 w-6'
                                : 'bg-dark-700 hover:bg-dark-600'
                                }`}
                            aria-label={`Ir a tarjeta ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={goToNext}
                    className="p-2 rounded-full bg-dark-800 border border-dark-700 hover:bg-dark-700 hover:border-primary-500 transition-all"
                    aria-label="Siguiente"
                >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
