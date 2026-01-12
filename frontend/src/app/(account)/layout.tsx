import { Header } from '@/components/layout/header/header';
import { Footer } from '@/components/layout/footer/footer';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
      <Footer />
    </>
  );
}
