

// export default function NavbarDrop(): JSX.Element {
//   const [hovering, setHovering] = useState(false);


//   return (
//     <div
//       className="relative inline-block"
//       onMouseEnter={() => setHovering(true)}
//       onMouseLeave={() => setHovering(false)}
//     >
//       <div className="inline-flex items-center gap-1  cursor-pointer rounded-md">
//         Categories
//         <ChevronDown className="w-4 h-4" />
//       </div>

//       {hovering && (
//         <div className="absolute top-full left-0 min-w-[150px] rounded-md bg-white p-2 shadow-lg border border-gray-200 z-50">
//           <Link
//             to="/categories/body-care"
//             className="block text-black px-3 py-2 rounded hover:text-coral font-normal"
//           >
//             BODY CARE
//           </Link>
//           <Link
//             to="/categories/facial-care"
//             className="block text-black px-3 py-2 rounded hover:text-coral font-normal"
//           >
//             FACIAL CARE
//           </Link>
//           <Link
//             to="/categories/lip-care"
//             className="block text-black px-3 py-2 rounded hover:text-coral font-normal"
//           >
//             LIP CARE
//           </Link>
//           <Link
//             to="/categories/intimate-care"
//             className="block text-black px-3 py-2 rounded hover:text-coral font-normal"
//           >
//             INTIMATE CARE
//           </Link>
//           <Link
//             to="/categories/skincare"
//             className="block text-black px-3 py-2 rounded hover:text-coral font-normal"
//           >
//             SKIN CARE
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// }

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
              <NavItem to="/category/body-care" title="BODY CARE" />
              <NavItem to="/categories/facial-care" title="FACIAL CARE" />
              <NavItem to="/categories/lip-care" title="LIP CARE" />
              <NavItem to="/categories/intimate-care" title="INTIMATE CARE" />
              <NavItem to="/categories/skincare" title="SKIN CARE" />
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
