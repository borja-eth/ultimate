import { HomeIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
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
      </div>
    </div>
  );
} 