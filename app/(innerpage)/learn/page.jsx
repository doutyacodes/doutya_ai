"use client";

import LoadingSpinner from "@/app/_components/LoadingSpinner";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useChildren } from "@/context/CreateContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Page() {
const [subjects, setSubjects] = useState([])
const [isLoading, setIsLoading] = useState(true)
const { selectedAge ,selectedGrade} = useChildren(); 

const fetchSubjects = async() =>{
  try {
    setIsLoading(true)
    const response = await GlobalApi.FetchSubjects({age:selectedAge,grade:selectedGrade})
    // console.log("response",response.data.learnSubjects)
    setSubjects(response.data.learnSubjects)
  } catch (error) {
    console.log(error)
  }finally{
    setIsLoading(false)

  }
}
useEffect(() => {
 fetchSubjects()
}, [selectedAge])

if(isLoading)
{
  return <LoadingSpinner />
}


  return (
    <div className="min-h-screen  text-gray-800 p-6">
      <motion.header
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-orange-600">Welcome to the Learning Hub</h1>
        <p className="mt-2 text-lg text-gray-700">Explore, Learn, and Activities!</p>
      </motion.header>

      {/* Subjects Section */}
      <section className="mb-10">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800">Subjects</h2>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          { subjects?.length >0 && subjects?.map((subject) => (
            <motion.div
              key={subject.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg"
            >
              <Link
                href={`/learn/${subject.slug}`}
                className="text-xl font-medium text-orange-500 hover:underline"
              >
                {subject.subject}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Feedback Section */}
      <section className="mb-10">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800">Overall Feedback</h2>
        </motion.div>
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white shadow-md p-4 rounded-lg text-center"
          >
            <Link
              href="/share"
              className="text-lg font-medium text-orange-500 hover:underline"
            >
              Feedback
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Activity of the Week Section */}
      <section>
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800">Activity of the Week</h2>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-gradient-to-r from-orange-300 to-white shadow-md p-6 rounded-lg"
        >
          <Link
            href="/activity-of-the-week"
            className="text-lg font-medium text-orange-700 hover:underline"
          >
            View This Week's Activity
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
