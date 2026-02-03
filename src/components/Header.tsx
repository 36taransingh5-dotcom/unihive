import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import hiveLogo from '@/assets/hive-logo.png';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
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
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="font-bold border-2 border-black bg-[#FFDE59] text-black hover:bg-[#FFE57A] rounded-lg"
              style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
            >
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut} 
              className="font-bold border-2 border-black bg-white text-black hover:bg-gray-100 rounded-lg"
              style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="font-bold border-2 border-black bg-[#FFDE59] text-black hover:bg-[#FFE57A] rounded-lg"
            style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
          >
            <Link to="/login">Society Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
