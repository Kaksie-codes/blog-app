import { AnimatePresence } from "framer-motion"
import { ReactNode } from "react"
import { motion } from 'framer-motion'

const AnimationWrapper = ({
    children,    
    initial = { opacity: 0 },
    animate = { opacity: 1 },
    transition = { duration: 1 },
    className,
    elementKey
} : {
    children:ReactNode,
    initial?:any,
    animate?:any,
    transition?:any,    
    className?: string,
    elementKey?:string,
}) => {
  return (
    <AnimatePresence>
        <motion.div  
            key={elementKey}          
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

export default AnimationWrapper