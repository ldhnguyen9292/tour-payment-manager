import React from 'react';
import { useSelector } from 'react-redux';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { RootState } from '@/store';
import LogoutButton from './LogoutButton';

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.jpg" alt="Logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-bold text-gray-900">
            Payment Manager
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={user?.avatarUrl}
                alt={user?.name || user?.username || 'User'}
              />
              <AvatarFallback>
                {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
