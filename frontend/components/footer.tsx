'use client';

import React from 'react';
import { Badge } from './ui/badge';
import { useFilters } from '@/contexts/FilterContext';

const Footer: React.FC = () => {
    const { filters } = useFilters();

    return (
        <footer className="fixed flex justify-end right-0 bottom-0 w-full bg-gray-50 text-gray-800 text-center py-2 z-50 px-4">
            <span>
                School: <Badge>{filters.schoolName || 'N/A'}</Badge> | Grade: <Badge>{filters.grade_id || 'N/A'}</Badge> | Class: <Badge>{filters.className || 'N/A'}</Badge>
            </span>
        </footer>
    );
};

export default Footer;
