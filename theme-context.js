// theme-context.js
const ThemeContext = React.createContext({
    theme: 'light',
    toggleTheme: () => {}
});

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = React.useState('light');
    
    React.useEffect(() => {
        // Check if user previously set a theme preference
        const savedTheme = localStorage.getItem('codeface-theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.body.className = savedTheme === 'dark' ? 'dark-theme' : '';
        }
    }, []);
    
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.className = newTheme === 'dark' ? 'dark-theme' : '';
        localStorage.setItem('codeface-theme', newTheme);
    };
    
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

