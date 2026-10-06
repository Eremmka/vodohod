import type { Metadata } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.scss';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  icons: { icon: `${BASE_PATH}/favicon.svg` },
  title: 'ВодоХод — доставка воды в Санкт-Петербурге и Ленобласти',
  description:
    'Доставка воды на объект, для бассейнов, ёмкостей, стройки, предприятий и частных домов. Север Санкт-Петербурга и Ленинградская область.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
