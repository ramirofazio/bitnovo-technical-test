import { AnimatePresence, motion } from "framer-motion";

export default function AnimatedContainer({ children, key, className }) {
  return (
    <AnimatePresence>
      <motion.section
        key={key}
        className={className}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.section>
    </AnimatePresence>
  );
}
