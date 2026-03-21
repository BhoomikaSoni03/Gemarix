import './globals.css';

export const metadata = {
  title: 'Gemarix | Premium Marble Collection',
  description: 'Exclusive B2B showcase of the finest marbles worldwide.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
