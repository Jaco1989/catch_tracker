"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Fish } from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600" />
        <div className="absolute inset-0 bg-[radial-gradient(#000_0.5px,transparent_0.5px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 h-screen flex flex-col items-center justify-center p-4">
        {/* Logo and Title Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-4 mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="bg-red-500 p-4 rounded-full">
              <Fish className="h-16 w-16 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl font-bold text-gray-900"
          >
            Welcome to CatchTrack
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-xl text-gray-600 max-w-md"
          >
            Your comprehensive solution for documenting and managing fishing
            operations
          </motion.p>
        </motion.div>

        {/* Buttons Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="space-y-4 w-full max-w-sm"
        >
          <Link href="/login" className="w-full block">
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-lg shadow-lg shadow-red-500/50 transition-all hover:shadow-xl hover:shadow-red-500/40"
              size="lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </Button>
          </Link>

          <Link href="/register" className="w-full block">
            <Button
              variant="outline"
              className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 h-12 text-lg shadow-lg transition-all hover:shadow-xl"
              size="lg"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create Account
            </Button>
          </Link>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full"
        >
          <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <motion.h3
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              Real-time Tracking
            </motion.h3>
            <p className="text-gray-600">
              Monitor your fishing operations in real-time with accurate
              tracking
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <motion.h3
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              Compliance Made Easy
            </motion.h3>
            <p className="text-gray-600">
              Stay compliant with automated documentation and reporting
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <motion.h3
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              Data Analytics
            </motion.h3>
            <p className="text-gray-600">
              Make informed decisions with comprehensive data analytics
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
