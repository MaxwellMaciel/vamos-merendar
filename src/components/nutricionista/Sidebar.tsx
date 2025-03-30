import { Link, useLocation } from 'react-router-dom';
import { Calendar, Utensils, MessageSquare, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/nutricionista/dashboard',
      label: 'Dashboard',
      icon: Calendar
    },
    {
      path: '/nutricionista/menu',
      label: 'Cardápio',
      icon: Utensils
    },
    {
      path: '/nutricionista/feedback',
      label: 'Feedback',
      icon: MessageSquare
    },
    {
      path: '/nutricionista/notifications',
      label: 'Notificações',
      icon: Bell
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-primary">Nutricionista</h2>
      </div>
      
      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors",
                isActive && "bg-primary/10 text-primary"
              )}
            >
              <Icon size={20} className="mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar; 