import { HomeIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">₿</span>
              </div>
              <h1 className="ml-2 text-xl font-bold text-white">Trading Dashboard</h1>
            </div>
          </div>
          <nav className="mt-8 flex-1 space-y-1 px-2">
            <a
              href="#"
              className="bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <HomeIcon className="mr-3 h-6 w-6 flex-shrink-0" />
              Dashboard
            </a>
            <a
              href="#"
              className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <ChartBarIcon className="mr-3 h-6 w-6 flex-shrink-0" />
              Analytics
            </a>
            <a
              href="#"
              className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <CogIcon className="mr-3 h-6 w-6 flex-shrink-0" />
              Settings
            </a>
          </nav>
        </div>
        <div className="flex flex-shrink-0 bg-gray-700 p-4">
          <div className="flex items-center w-full">
            <div className="h-9 w-9 rounded-full bg-gray-500"></div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Trader</p>
              <p className="text-xs font-medium text-gray-300">View profile</p>
            </div>
          </div>
        </div>
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 