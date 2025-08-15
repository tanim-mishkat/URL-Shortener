import UrlForm from "../components/UrlForm.jsx";
import UserUrls from "../components/UserUrls.jsx";
const DashboardPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">URL Shortener</h2>
        <UrlForm />
        <UserUrls />
      </div>
    </div>
  );
};

export default DashboardPage;
