
'use client';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavbarMenu = () => {
  return (
    <NavigationMenu.Root className="relative z-10 w-full flex md:justify-center">
      <NavigationMenu.List className="flex items-center">
        {/* Categories dropdown */}
        <NavigationMenu.Item className="relative">
          <NavigationMenu.Trigger className="flex items-center gap-1 text-white rounded underline-transition transition uppercase">
            Categories
            <ChevronDown className="transition-transform data-[state=open]:rotate-180" />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md p-4 w-56">
            <ul className="space-y-2">
              <NavItem to="/shop?category=Body Care" title="BODY CARE" />
              <NavItem to="/shop?category=Facial Care" title="FACIAL CARE" />
              <NavItem to="/shop?category=Lip Care" title="LIP CARE" />
              <NavItem to="/shop?category=Intimate Care" title="INTIMATE CARE" />
              <NavItem to="/shop?category=Skincare Sets" title="SKIN CARE" />
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};

const NavItem = ({
  to,
  title,
}: {
  to: string;
  title: string;
}): JSX.Element => (
  <li>
    <NavigationMenu.Link asChild>
      <Link
        to={to}
        className=
          'block p-2 text-gray-700 rounded hover:text-coral transition'>
        <div className="font-medium">{title}</div>
      </Link>
    </NavigationMenu.Link>
  </li>
);

export default NavbarMenu;
