import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          {/* Add your main content here */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
