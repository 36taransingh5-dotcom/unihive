import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import hiveLogo from '@/assets/hive-logo.png';

export function Header() {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-background border-b-2 border-border">
      <div className="container max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src={hiveLogo} 
            alt="Hive Logo" 
            className="h-8 w-auto object-contain"
          />
        </Link>
        
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-full border-2 border-border bg-card flex items-center justify-center transition-all duration-150 hover:scale-105 brutal-shadow-sm"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-primary" />
            ) : (
              <Moon className="w-4 h-4 text-foreground" />
            )}
          </button>

          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className="font-bold border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg brutal-shadow-sm"
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut} 
                className="font-bold border-2 border-border bg-card text-foreground hover:bg-secondary rounded-lg brutal-shadow-sm"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="font-bold border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg brutal-shadow-sm"
            >
              <Link to="/login">Society Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
