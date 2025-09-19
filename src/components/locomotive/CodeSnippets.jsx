import React from 'react';
import { motion } from 'framer-motion';

const codeSnippets = [
  {
    id: 1,
    code: `const magic = () => {
  return creativity + code;
};`,
    language: 'javascript',
    size: 'small'
  },
  {
    id: 2,
    code: `// Building the future
useEffect(() => {
  setAmazing(true);
}, [inspiration]);`,
    language: 'react',
    size: 'medium'
  },
  {
    id: 3,
    code: `.hero {
  background: dreams;
  transform: scale(∞);
}`,
    language: 'css',
    size: 'small'
  },
  {
    id: 4,
    code: `SELECT * FROM ideas 
WHERE status = 'brilliant'
ORDER BY impact DESC;`,
    language: 'sql',
    size: 'medium'
  },
  {
    id: 5,
    code: `<Component>
  <Dream />
  <Reality />
</Component>`,
    language: 'jsx',
    size: 'small'
  },
  {
    id: 6,
    code: `def create_magic():
    passion = get_inspiration()
    return passion.execute()`,
    language: 'python',
    size: 'medium'
  },
  {
    id: 7,
    code: `git commit -m "✨ Added magic"
git push origin amazing`,
    language: 'bash',
    size: 'small'
  },
  {
    id: 8,
    code: `interface Developer {
  skills: string[];
  passion: boolean;
  coffee: number;
}`,
    language: 'typescript',
    size: 'medium'
  }
];

export default function CodeSnippets({ section = 'default', count = 4 }) {
  const getSnippetsForSection = () => {
    // Different code snippets for different sections
    const shuffled = [...codeSnippets].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getLanguageColor = (language) => {
    const colors = {
      javascript: 'text-yellow-400',
      react: 'text-blue-400',
      css: 'text-pink-400',
      sql: 'text-green-400',
      jsx: 'text-cyan-400',
      python: 'text-purple-400',
      bash: 'text-orange-400',
      typescript: 'text-indigo-400'
    };
    return colors[language] || 'text-white';
  };

  const positions = [
    { top: '10%', left: '85%', rotate: 15 },
    { top: '25%', right: '90%', rotate: -10 },
    { bottom: '30%', left: '5%', rotate: 8 },
    { bottom: '15%', right: '15%', rotate: -12 },
    { top: '60%', left: '92%', rotate: 20 },
    { top: '40%', right: '95%', rotate: -15 },
    { bottom: '50%', left: '3%', rotate: 12 },
    { top: '80%', right: '5%', rotate: -8 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {getSnippetsForSection().map((snippet, index) => (
        <motion.div
          key={`${section}-${snippet.id}`}
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ 
            opacity: 0.15, 
            scale: 1,
            rotate: positions[index]?.rotate || 0
          }}
          transition={{ 
            duration: 2,
            delay: index * 0.3,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 8
          }}
          className="absolute"
          style={{
            ...positions[index],
            transform: `rotate(${positions[index]?.rotate || 0}deg)`
          }}
        >
          <div className="backdrop-blur-sm bg-black/20 border border-white/10 rounded-lg p-3 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className={`text-xs font-mono ${getLanguageColor(snippet.language)} ml-auto`}>
                {snippet.language}
              </span>
            </div>
            <pre className="text-xs font-mono text-white/80 whitespace-pre-wrap leading-relaxed">
              {snippet.code}
            </pre>
          </div>
        </motion.div>
      ))}
      
      {/* Floating symbols */}
      <motion.div
        className="absolute top-1/4 left-10 text-white/5 text-6xl font-mono"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {'</>'}
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/3 right-20 text-white/5 text-4xl font-mono"
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {'{}'}
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-5 text-white/5 text-5xl font-mono"
        animate={{ 
          x: [0, 10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {'()'}
      </motion.div>
    </div>
  );
}