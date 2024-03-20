import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimationWrapper = ({
    children, 
    keyValue,
    initial = { opacity: 0 },
    animate = { opacity: 1 },
    transition = { duration: 1 },
    className
} : {
    children:ReactNode,
    initial?:any,
    animate?:any,
    transition?:any,
    keyValue: any,
    className?: string
}) => {

    return (
        <AnimatePresence>
            <motion.div
            key={keyValue}
            initial={initial}
            animate={animate}
            transition={transition}
            className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default AnimationWrapper;