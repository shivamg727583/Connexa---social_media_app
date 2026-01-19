import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/features/auth/authThunks";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const isLoading = loading.register;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return;
    const res = await dispatch(registerUser(form));
    if (res.meta.requestStatus === "fulfilled") navigate("/login");
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 sm:p-8 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">C</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Join Connexa</h1>
            <p className="text-purple-100 text-sm sm:text-base">Create your account to get started</p>
          </div>

          <form onSubmit={submitHandler} className="p-6 sm:p-8 space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input type="text" placeholder="Choose a username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="h-11 sm:h-12" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input type="email" placeholder="Enter your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 sm:h-12" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input type="password" placeholder="Create a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-11 sm:h-12" required minLength={3} />
            </div>

            <Button type="submit" className="w-full h-11 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">Login</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;