// components/Drawer.js

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sun } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, toggleDrawer }) => {
  return (
    <div
      className={`fixed inset-0 bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } md:hidden`}
    >
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Link href="/" className="text-black hover:text-blue-900" onClick={toggleDrawer}>
          Home
        </Link>
        <Link href="/about" className="text-black hover:text-blue-900" onClick={toggleDrawer}>
          About Us
        </Link>
        <Link href="/team" className="text-black hover:text-blue-900" onClick={toggleDrawer}>
          Our Team
        </Link>
        <Link href="/contact" className="text-black hover:text-blue-900" onClick={toggleDrawer}>
          Contact Us
        </Link>
        <Button className="rounded-full bg-blue-900 text-white hover:bg-blue-800 p-3" onClick={toggleDrawer}>
          <Sun className="text-white" size={20} />
        </Button>
        <Button variant="ghost" className="text-black" onClick={toggleDrawer}>
          Log in
        </Button>
        <Button className="bg-blue-900 text-white hover:bg-blue-800" onClick={toggleDrawer}>
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default Drawer;