import { FaGithub } from 'react-icons/fa6';

interface FooterLink {
  label: string;
  href: string;
  icon?: string;
}

interface FooterLinksProps {
  links: FooterLink[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub,
};

export default function FooterLinks({ links }: FooterLinksProps) {
  return (
    <div className="flex space-x-6">
      {links.map((item) => {
        const Icon = item.icon ? iconMap[item.icon] : null;

        return (
          <a
            key={item.href}
            href={item.href}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors flex items-center gap-1"
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {item.label}
          </a>
        );
      })}
    </div>
  );
}
