'use client';

import React from 'react';
import { Badge } from './ui/badge';

const Footer: React.FC = () => {
    const [filters, setFilters] = React.useState({ school: '', grade: '', class_name: '' });

    React.useEffect(() => {
        const school = localStorage.getItem('homework_school') || '';
        const grade = localStorage.getItem('homework_grade') || '';
        const class_name = localStorage.getItem('homework_class') || '';
        setFilters({ school, grade, class_name });
    }, []);

    return (
        <footer className="fixed flex justify-end right-0 bottom-0 w-full bg-gray-50 text-gray-800 text-center py-2 z-50 px-4">
            <span>
                School: <Badge>{filters.school || 'N/A'}</Badge> | Grade: <Badge>{filters.grade || 'N/A'}</Badge> | Class: <Badge>{filters.class_name || 'N/A'}</Badge>
            </span>
        </footer>
    );
};

export default Footer;
