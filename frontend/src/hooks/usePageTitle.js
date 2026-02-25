import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTitle = (title) => {
    const location = useLocation();

    useEffect(() => {
        document.title = title ? `${title} | Vignan University` : 'Vignan University';
    }, [location, title]);
};

export default usePageTitle;
