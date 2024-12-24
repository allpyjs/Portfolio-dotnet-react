import { useState, useEffect } from "react";
import { useLightMode } from '../globals/interface';

import "./animated-backgrounds.css";

const AnimatedBackgrounds = () => {
    const lightMode = useLightMode();

    const backgrounds = [
        `/backgrounds/${lightMode ? 'light' : 'dark'} (1).jpg`,
        `/backgrounds/${lightMode ? 'light' : 'dark'} (2).jpg`,
        `/backgrounds/${lightMode ? 'light' : 'dark'} (3).jpg`,
        `/backgrounds/${lightMode ? 'light' : 'dark'} (4).jpg`,
    ];

    const [currentBackground, setCurrentBackground] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentBackground((prev) => (prev + 1) % backgrounds.length);
        }, 3000); // Change background every 3 seconds

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, []);

    return (
        <div className="animated-background" style={{ backgroundImage: `url("${backgrounds[currentBackground]}")` }} />
    );
};

export default AnimatedBackgrounds;
