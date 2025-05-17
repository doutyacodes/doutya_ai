'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, ClipboardIcon } from '@heroicons/react/24/outline';

export default function NarrativeDetailPage({ params }) {
  const [narrative, setNarrative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const narrativeId = params.id;

  useEffect(() => {
    const fetchNarrativeDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/newstech/login');
          return;
        }

        const response = await fetch(`/api/newstech/narrative/view/${narrativeId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch narrative details');
        }

        const data = await response.json();
        if (data.status === 'success') {
          setNarrative(data.data);
        } else {
          throw new Error(data.message || 'Unknown error occurred');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching narrative details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNarrativeDetail();
  }, [narrativeId, router]);

  const handleBackToList = () => {
    router.push('/newstech/narrative');
  };

  const copyToClipboard = () => {
    if (!narrative) return;
    
    navigator.clipboard.writeText(narrative.rewrittenArticle)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Format bias entries for display
  const formatBiasEntries = (biases) => {
    if (!biases || !Array.isArray(biases)) return [];
    return biases.map(bias => ({
      id: bias.id,
      type: bias.biasType,
      entity: bias.entity,
      percentage: Number(bias.percentage).toFixed(1)
    }));
  };

  // Parse age range for display
  const parseAgeRange = (ageRangeStr) => {
    if (!ageRangeStr) return { min: '18', max: '65' };
    
    const parts = ageRangeStr.split(' to ');
    if (parts.length === 2) {
      return { min: parts[0], max: parts[1].replace(' years', '') };
    }
    
    return { min: '18', max: '65' };
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading narrative details...</p>
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
              <h3 className="text-sm font-medium text-red-800">Error Loading Narrative</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-800 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Back to Narratives
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!narrative) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-700">Narrative not found</p>
          <button
            onClick={handleBackToList}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Back to Narratives
          </button>
        </div>
      </div>
    );
  }

  const biasEntries = formatBiasEntries(narrative.biases);
  const ageRange = parseAgeRange(narrative.ageRange);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-8">
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBackToList}
              className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-full shadow-sm text-xs sm:text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors mb-4 sm:mb-6"
            >
              <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Back to Narratives
            </button>
          
            {/* Result Header */}
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-red-900">
                Your Narrative
              </h2>
              <button
                id="copy-btn"
                type="button"
                onClick={copyToClipboard}
                className={`inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 ${
                  copied ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                } border rounded-full shadow-sm text-xs sm:text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors`}
              >
                <ClipboardIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            {/* Summary of settings */}
            <div className="bg-slate-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Bias Distribution</h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {biasEntries.map(entry => (
                    <span 
                      key={entry.id} 
                      className={`text-2xs sm:text-xs px-1 sm:px-2 py-1 rounded-full ${entry.type === 'Pro' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {entry.entity}: {entry.percentage}%
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Age Range</h3>
                <p className="text-gray-800 font-medium text-sm">{ageRange.min} to {ageRange.max} years</p>
              </div>
              <div className="p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Location</h3>
                <p className="text-gray-800 font-medium text-sm">{narrative.location || 'Global'}</p>
              </div>
              <div className="p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Audience Type</h3>
                <p className="text-gray-800 font-medium text-sm">{narrative.audienceType || 'General audience'}</p>
              </div>
            </div>
            
            {/* Result Content */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-8 border border-slate-200 shadow-inner">
              <div className="prose prose-slate max-w-none">
                {narrative.rewrittenArticle.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}