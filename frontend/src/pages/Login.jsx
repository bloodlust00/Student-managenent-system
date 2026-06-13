import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, BookOpen, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password, rememberMe);
    if (result.success) {
      toast.success('Logged in successfully!');
      navigate(`/${result.role.toLowerCase()}/dashboard`);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden">
        {/* Left Side - Illustration/Branding */}
        <div className="w-1/2 bg-indigo-50 p-12 hidden md:flex flex-col justify-center relative">
          <div className="z-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to <br/><span className="text-primary">EduCore System</span></h1>
            <p className="text-gray-600 leading-relaxed mb-8">
              Streamline school management, class organization, and add students and faculty. Seamlessly track attendance, assess performance, and communicate effortlessly.
            </p>
          </div>
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-64 h-64 rounded-full bg-indigo-100 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-64 h-64 rounded-full bg-purple-100 opacity-50 blur-3xl"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8 md:hidden">
             <BookOpen className="text-primary" size={28} />
             <span className="text-2xl font-bold text-gray-900">EduCore</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login to your account</h2>
          <p className="text-sm text-gray-500 mb-8">Enter your credentials to access your dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="admin@educore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <a href="#" className="text-sm font-medium text-primary hover:text-secondary">Forgot password?</a>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              Sign In
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account? <a href="#" className="font-medium text-primary hover:text-secondary">Contact Admin</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
