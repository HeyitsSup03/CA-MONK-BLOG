import { FileText, PlusCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  showCreateForm: boolean;
  onToggleCreateForm: () => void;
}

export function Header({ showCreateForm, onToggleCreateForm }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-ca-blue" />
            <h1 className="text-2xl font-bold text-ca-blue">CA MONK</h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <a
              href="#"
              className="text-gray-700 hover:text-ca-blue transition-colors font-medium"
            >
              Tools
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-ca-blue transition-colors font-medium"
            >
              Practice
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-ca-blue transition-colors font-medium"
            >
              Events
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-ca-blue transition-colors font-medium"
            >
              Job Board
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-ca-blue transition-colors font-medium"
            >
              Points
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              onClick={onToggleCreateForm}
              variant={showCreateForm ? 'secondary' : 'default'}
              size="sm"
              className="text-xs md:text-sm"
            >
              <PlusCircle className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">
                {showCreateForm ? 'View Blogs' : 'Create Blog'}
              </span>
            </Button>
            <Button variant="default" size="sm" className="text-xs md:text-sm">
              <User className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
