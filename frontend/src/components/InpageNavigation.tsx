import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface InpageNavigationProps {
    routes: string[];    
    defaultHidden: string[];
    children: ReactNode;
    activeTabRef: React.RefObject<HTMLButtonElement>;
    defaultActiveIndex?: number;
}

const InpageNavigation: React.FC<InpageNavigationProps> = ({ activeTabRef, children, routes, defaultHidden, defaultActiveIndex = 0 }) => {
    const [inPageNavIndex, setInPageNavIndex] = useState<number>(defaultActiveIndex);
    const activeTabLineRef = useRef<HTMLHRElement>(null);
    

    const changePageState = (btn: HTMLButtonElement, i: number) => {
        const { offsetLeft, offsetWidth } = btn;
        if (activeTabLineRef.current) {
            activeTabLineRef.current.style.width = offsetWidth + 'px';
            activeTabLineRef.current.style.left = offsetLeft + 'px';
        }
        setInPageNavIndex(i);
    };

    useEffect(() => {
        if (activeTabRef.current && activeTabLineRef.current) {
            const btn = activeTabRef.current;
            changePageState(btn, defaultActiveIndex);
        }
    }, [defaultActiveIndex]);

    return (
        <div className='w-full '>
            <div className="top-[80px] z-[1] shadow-sm sticky mb-8 border-b bg-white  w-full mx-auto  md:mr-auto border-grey flex flex-nowrap overflow-x-auto">
                <div className='relative'>
                    {routes.map((route, index) => (
                        <button
                            key={index}
                            ref={index === defaultActiveIndex ? activeTabRef : undefined}
                            onClick={(e) => changePageState(e.currentTarget as HTMLButtonElement, index)}
                            className={`p-4 pt-8 px-5 capitalize ${inPageNavIndex === index ? 'text-black font-bold' : 'text-dark-grey'} ${defaultHidden.includes(route) ? 'md:hidden' : ''}`}>
                            {route}
                        </button>
                    ))}
                    <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
                </div>              
            </div>
            {Array.isArray(children) ? children[inPageNavIndex] : children}
        </div>
    );
};

export default InpageNavigation;
