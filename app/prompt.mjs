import fs from 'fs';
import path from 'path';

const navItems = [
  { href: '/inventory', label: 'Chemical Inventory' },
  { href: '/qr-codes', label: 'QR Code Management' },
  { href: '/reports', label: 'Reports' },
  { href: '/users', label: 'User Management' },
  { href: '/notifications', label: 'Notifications' },
  { href: '/settings', label: 'Settings' },
];

navItems.forEach((item) => {
  const folderPath = item.href.substring(1);
  const filePath = path.join(folderPath, 'page.tsx');

  fs.mkdirSync(folderPath, { recursive: true });

  console.log(`${folderPath} created`);
  const componentContent = `

const ${item.label.replace(' ', '').replace(' ', '')} = () => {
    return <div>${item.label}</div>;
};

export default ${item.label.replace(' ', '').replace(' ', '')};
    `;

  fs.writeFileSync(filePath, componentContent.trim());
  console.log(`${filePath} written done`);
});
