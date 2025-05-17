"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, Newspaper, PenTool, BarChart2 } from 'lucide-react';

export default function SpecialFeatures() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/newstech/login');
  };

  const features = [
    {
      id: 'mapper',
      title: 'Doutya Mapper',
      description: 'Add location-specific news content to the news map interface. Create geographically targeted content that delivers relevant information to your audience.',
      icon: <Newspaper className="h-10 w-10 text-red-800" />,
      details: 'The Doutya Mapper provides news company administrators with the ability to add location-specific news to the interactive news map. Pin articles to exact geographic coordinates, create regional coverage areas, and manage location-based news distribution from a single intuitive interface.'
    },
    {
      id: 'narrative',
      title: 'Doutya Narrative',
      description: 'Create customized news articles and content based on audience demographics including bias preferences, age ranges, location, and target audience types.',
      icon: <PenTool className="h-10 w-10 text-red-800" />,
      details: 'The Doutya Narrative system allows content creation teams to craft tailored articles that resonate with specific audience segments. Customize content tone, complexity, and framing based on demographic targets while maintaining journalistic integrity.'
    },
    {
      id: 'analyse',
      title: 'Doutya Analyse',
      description: 'Comprehensive content analysis tools to identify bias, sentiment patterns, emotional impact, and other critical factors in your published materials.',
      icon: <BarChart2 className="h-10 w-10 text-red-800" />,
      details: 'Doutya Analyse provides powerful metrics and insights into your content. Measure bias vectors across multiple dimensions, analyze emotional sentiment patterns, identify tone variances, and generate comprehensive reports on content effectiveness and audience impact.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50">
      <Head>
        <title>Doutya Professional Tools</title>
        <meta name="description" content="Professional tools for news content creation, mapping and analysis" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Professional Tools for <span className="text-red-800">News Teams</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Specialized solutions for news professionals to create, map, and analyze content with precision and insight.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="border-2 border-gray-200 hover:border-red-300 rounded-lg p-6 transition-all duration-200"
            >
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Suite Description */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-6">
              Professional News Tech Suite
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl">
              Access our comprehensive suite of professional tools designed specifically for news organizations. 
              This integrated platform includes all three powerful tools: Doutya Mapper for location-based news management, 
              Doutya Narrative for audience-targeted content creation, and Doutya Analyse for in-depth content analysis.
            </p>
            <button
              onClick={handleLogin}
              className="bg-red-800 hover:bg-red-900 text-white px-8 py-3 rounded-lg font-medium flex items-center transition-colors"
            >
              Access Professional Suite <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Access Information */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Access Information</h3>
          <p className="text-gray-600">
            These professional tools are available exclusively to authorized news teams and content administrators. 
            Login credentials are provided by our team to verified professionals.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              Exclusive professional tools. Authorized access only.
            </p>
            <Link href="/" className="text-red-800 hover:text-red-900 text-sm font-medium">
              Return to Main Site
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}