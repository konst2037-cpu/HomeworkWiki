'use client';

import React from 'react';
import { Badge } from './ui/badge';
import { useFilters } from '@/contexts/FilterContext';

const Footer: React.FC = () => {
    const { filters } = useFilters();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Provide default values to avoid hydration mismatch
    const schoolName = mounted ? (filters?.schoolName || '-') : '';
    const gradeId = mounted ? (filters?.grade_id || '-') : '';
    const className = mounted ? (filters?.className || '-') : '';

    return (
        <footer className="fixed right-0 bottom-0 w-full bg-gradient-to-r from-gray-200 via-purple-200 to-gray-300 text-gray-800 shadow-lg py-2 md:px-6 flex items-center justify-around md:justify-end z-50">
            <div className="flex gap-4 items-center">
                <span className="flex items-center gap-2">
                    <span className="font-medium">School:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">{schoolName}</Badge>
                </span>
                {/* <span className="flex items-center gap-2">
                    <span className="font-medium">Grade:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">{gradeId}</Badge>
                </span> */}
                <span className="flex items-center gap-2">
                    <span className="font-medium">Class:</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-300">{gradeId}{className}</Badge>
                </span>
            </div>
        </footer>
    );
};

export default Footer;
