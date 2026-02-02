import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import hiveLogo from '@/assets/hive-logo.png';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src={hiveLogo} 
            alt="Hive Logo" 
            className="h-8 w-auto object-contain"
          />
        </Link>
        
        {user ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="rounded-xl">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut} className="rounded-xl">
              Sign Out
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" asChild className="rounded-xl">
            <Link to="/login">Society Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
