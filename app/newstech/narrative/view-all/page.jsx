'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ClockIcon, 
  UserIcon, 
  MapPinIcon, 
  UsersIcon, 
  EyeIcon,
  ChevronRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function NarrativesPage() {
  const [narratives, setNarratives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNarratives = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/newstech/login');
          return;
        }

        const response = await fetch('/api/newstech/narrative/view', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch narratives');
        }

        const data = await response.json();
        if (data.status === 'success') {
          setNarratives(data.data);
        } else {
          throw new Error(data.message || 'Unknown error occurred');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching narratives:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNarratives();
  }, [router]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading narratives...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <div className="bg-red-50 border-l-4 border-red-800 p-4 w-full max-w-3xl rounded-lg shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Narratives</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-800 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Narratives</h1>
          <Link href="/newstech" legacyBehavior>
            <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Create New Narrative
            </a>
          </Link>
        </div>

        {narratives.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No narratives found</h3>
            <p className="text-gray-500 mb-4">You haven&apos;t created any narratives yet.</p>
            <Link href="/newstech" legacyBehavior>
              <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Create Your First Narrative
              </a>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {narratives.map((narrative) => (
              <div
                key={narrative.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200"
              >
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {narrative.biases && narrative.biases.slice(0, 3).map((bias) => (
                      <span
                        key={bias.id}
                        className={`text-xs px-2 py-1 rounded-full ${
                          bias.biasType === 'Pro' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {bias.entity}: {Number(bias.percentage).toFixed(1)}%
                      </span>
                    ))}
                    {narrative.biases && narrative.biases.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                        +{narrative.biases.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 italic mb-1">Original article excerpt:</p>
                    <p className="text-sm text-gray-800">
                      {truncateText(narrative.originalArticle)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{narrative.location || 'Global'}</span>
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{narrative.audienceType || 'General'}</span>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{narrative.ageRange || 'All ages'}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{formatDate(narrative.createdAt)}</span>
                    </div>
                  </div>

                  <Link href={`/newstech/narrative/view-all/${narrative.id}`} legacyBehavior>
                    <a className="inline-flex items-center justify-center w-full px-4 py-2 bg-red-50 text-red-800 text-sm font-medium rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Full Narrative
                      <ChevronRightIcon className="h-4 w-4 ml-2" />
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}