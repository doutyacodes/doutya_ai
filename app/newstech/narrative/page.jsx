"use client";

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, ClipboardIcon, ArrowPathIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function NewsRewriter() {
  // State for the original article
  const [article, setArticle] = useState('');
  
  // State for the bias entries
  const [biasEntries, setBiasEntries] = useState([
    { id: 1, type: 'Pro', entity: '', percentage: 0 }
  ]);
  
  // State for age range
  const [ageRange, setAgeRange] = useState({ min: 18, max: 65 });
  
  // State for location
  const [location, setLocation] = useState('');
  
  // State for audience type
  const [audienceType, setAudienceType] = useState('');
  
  // State for rewritten article
  const [rewrittenArticle, setRewrittenArticle] = useState('');
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  
  // State for showing audience type confirmation
  const [showAudienceConfirm, setShowAudienceConfirm] = useState(false);

  // State for validation errors
  const [errors, setErrors] = useState({});
  
  // State for showing results view
  const [showResults, setShowResults] = useState(false);

  const router = useRouter()

  // Function to add a new bias entry
  const addBiasEntry = (type) => {
    const newEntry = {
      id: Date.now(),
      type,
      entity: '',
      percentage: 0
    };
    setBiasEntries([...biasEntries, newEntry]);
  };

  // Function to remove a bias entry
  const removeBiasEntry = (id) => {
    setBiasEntries(biasEntries.filter(entry => entry.id !== id));
  };

  // Function to update a bias entry
  const updateBiasEntry = (id, field, value) => {
    const updatedEntries = biasEntries.map(entry => {
      if (entry.id === id) {
        return { ...entry, [field]: field === 'percentage' ? parseInt(value, 10) || 0 : value };
      }
      return entry;
    });
    setBiasEntries(updatedEntries);
  };

  // Calculate total percentage for each bias type
  const calculateTotalPercentage = (type) => {
    return biasEntries
      .filter(entry => entry.type === type)
      .reduce((sum, entry) => sum + entry.percentage, 0);
  };

  // Function to handle form submission
  const handleSubmit = async (skipConfirm = false) => {
    // Reset errors
    setErrors({});
    
    // Validate inputs
    const newErrors = {};
    
    if (!article.trim()) {
      newErrors.article = 'Please enter an article to rewrite';
    }
    
    if (!location.trim()) {
      newErrors.location = 'Please enter a target location';
    }
    
    // Check Pro percentage total
    const proTotal = calculateTotalPercentage('Pro');
    const againstTotal = calculateTotalPercentage('Against');
    
    if (proTotal + againstTotal !== 100) {
      newErrors.bias = 'Bias percentages must add up to 100%';
    }
    
    // Check for empty entities
    const hasEmptyEntity = biasEntries.some(entry => !entry.entity.trim());
    if (hasEmptyEntity) {
      newErrors.entity = 'All bias entities must be filled';
    }
    
    // Check if at least one bias entry exists
    if (biasEntries.length === 0) {
      newErrors.bias = 'At least one bias entry is required';
    }
    
    // Check age range
    if (ageRange.min >= ageRange.max) {
      newErrors.age = 'Minimum age must be less than maximum age';
    }
    
    // Set errors and return if any exist
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Check if audience type is empty and show confirmation if not skipped
    if (!audienceType.trim() && !skipConfirm) {
      setShowAudienceConfirm(true);
      return;
    }
    
    // Reset confirmation dialog
    setShowAudienceConfirm(false);
    
    // Start loading
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/newstech/narrative', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          biasList: biasEntries,
          ageRange: `${ageRange.min} to ${ageRange.max}`,
          location,
          audienceType: audienceType.trim() || 'General audience',
          originalArticle: article,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to rewrite article');
      }
      
      const { data } = await response.json();
      setRewrittenArticle(data.rewrittenArticle);
      setShowResults(true);
    } catch (error) {
      console.error('Error rewriting article:', error);
      setErrors({ submit: 'Failed to rewrite article. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to copy rewritten article to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(rewrittenArticle)
      .then(() => {
        // Show a temporary copied message
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
      });
  };

  // Function to go back to the form
  const handleBackToForm = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-red-900">News Narrative</h1>
            <p className="mt-2 text-lg text-gray-600">
              Customize news articles based on bias, age, location, and audience
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => router.push('/newstech/narrative/view-all')}
              type="button"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              View All Narratives
            </button>
          </div>
        </div>
        
        {!showResults ? (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                {/* Left Column - Original Article First (CHANGED) */}
                <div className="space-y-4 sm:space-y-8">
                  {/* Original Article now comes first */}
                  <div className="bg-slate-50 p-4 sm:p-6 rounded-xl shadow-sm h-full">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-800 flex items-center justify-center text-white font-bold mr-2">1</span>
                      Original Article
                    </h2>
                    
                    {errors.article && (
                      <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-md border-l-4 border-red-500">{errors.article}</p>
                    )}
                    
                    <textarea
                      placeholder="Paste or type your news article here..."
                      value={article}
                      onChange={(e) => setArticle(e.target.value)}
                      rows="12"
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-3 sm:px-4 py-2 focus:ring-red-500 focus:border-red-500 transition-colors h-full"
                    ></textarea>
                  </div>
                  
                  {/* Submit Button (for mobile, shown only on smaller screens) */}
                  <div className="flex justify-center lg:hidden">
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center text-base sm:text-lg"
                    >
                      {isLoading ? (
                        <>
                          <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Get Narrative'
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Right Column - Input Parameters */}
                <div className="space-y-4 sm:space-y-8">
                  {/* Bias Configuration */}
                  <div className="bg-slate-50 p-4 sm:p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-800 flex items-center justify-center text-white font-bold mr-2">2</span>
                      Bias Configuration
                    </h2>
                    
                    {errors.bias && (
                      <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-md border-l-4 border-red-500">{errors.bias}</p>
                    )}
                    {errors.entity && (
                      <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-md border-l-4 border-red-500">{errors.entity}</p>
                    )}
                    
                    <div className="space-y-3 sm:space-y-4">
                      {biasEntries.map(entry => (
                        <div key={entry.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${entry.type === 'Pro' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {entry.type}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeBiasEntry(entry.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </div>
                          
                          <div className="flex space-x-2">
                            <div className="flex-grow">
                              <input
                                type="text"
                                placeholder="Entity name"
                                value={entry.entity}
                                onChange={(e) => updateBiasEntry(entry.id, 'entity', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg shadow-sm px-3 sm:px-4 py-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base"
                              />
                            </div>
                            <div className="w-20 sm:w-24">
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={entry.percentage}
                                  onChange={(e) => updateBiasEntry(entry.id, 'percentage', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg shadow-sm px-2 sm:px-4 py-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 text-sm sm:text-base">%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap justify-between mt-4">
                      <div className="flex space-x-2 sm:space-x-3 mb-3 sm:mb-0">
                        <button
                          type="button"
                          onClick={() => addBiasEntry('Pro')}
                          className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-green-100 text-green-800 border border-green-200 rounded-full shadow-sm text-xs sm:text-sm font-medium hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Add Pro
                        </button>
                        <button
                          type="button"
                          onClick={() => addBiasEntry('Against')}
                          className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-red-100 text-red-800 border border-red-200 rounded-full shadow-sm text-xs sm:text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Add Against
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-xs sm:text-sm font-medium inline-block px-2 sm:px-3 py-1 rounded-full ${calculateTotalPercentage('Pro') + calculateTotalPercentage('Against') === 100 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          Total: {calculateTotalPercentage('Pro') + calculateTotalPercentage('Against')}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Age Range */}
                  <div className="bg-slate-50 p-4 sm:p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-800 flex items-center justify-center text-white font-bold mr-2">3</span>
                      Target Age Range
                    </h2>
                    
                    {errors.age && (
                      <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-md border-l-4 border-red-500">{errors.age}</p>
                    )}
                    
                    <div className="flex items-center space-x-3 sm:space-x-6">
                      <div className="flex-1">
                        <label htmlFor="min-age" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Minimum Age
                        </label>
                        <input
                          type="number"
                          id="min-age"
                          min="1"
                          max="120"
                          value={ageRange.min}
                          onChange={(e) => setAgeRange({ ...ageRange, min: parseInt(e.target.value, 10) || 1 })}
                          className="w-full border border-gray-300 rounded-lg shadow-sm px-3 sm:px-4 py-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base"
                        />
                      </div>
                      
                      <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full">
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">to</span>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="max-age" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Maximum Age
                        </label>
                        <input
                          type="number"
                          id="max-age"
                          min="1"
                          max="120"
                          value={ageRange.max}
                          onChange={(e) => setAgeRange({ ...ageRange, max: parseInt(e.target.value, 10) || 1 })}
                          className="w-full border border-gray-300 rounded-lg shadow-sm px-3 sm:px-4 py-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="bg-slate-50 p-4 sm:p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-800 flex items-center justify-center text-white font-bold mr-2">4</span>
                      Target Location
                    </h2>
                    
                    {errors.location && (
                      <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-md border-l-4 border-red-500">{errors.location}</p>
                    )}
                    
                    <input
                      type="text"
                      placeholder="Enter location (e.g., India, New York, etc.)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-3 sm:px-4 py-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base"
                    />
                  </div>
                  
                  {/* Audience Type */}
                  <div className="bg-slate-50 p-4 sm:p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-800 flex items-center justify-center text-white font-bold mr-2">5</span>
                      Type of People (Optional)
                    </h2>
                    <input
                      type="text"
                      placeholder="E.g., College students, Politicians, Retired persons"
                      value={audienceType}
                      onChange={(e) => setAudienceType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-3 sm:px-4 py-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
              
              {/* Submit Button (Desktop, hidden on smaller screens) */}
              <div className="hidden lg:flex justify-center mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isLoading}
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-red-700 to-red-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center text-lg"
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Get Narrative'
                  )}
                </button>
              </div>
              
              {errors.submit && (
                <p className="text-red-600 text-sm text-center mt-4 bg-red-50 p-3 rounded-md border-l-4 border-red-500 max-w-md mx-auto">{errors.submit}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-4 sm:p-8">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToForm}
                className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-full shadow-sm text-xs sm:text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors mb-4 sm:mb-6"
              >
                <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Back to Editor
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
                  className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-red-100 text-red-700 border border-red-200 rounded-full shadow-sm text-xs sm:text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <ClipboardIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  Copy
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
                  <p className="text-gray-800 font-medium text-sm">{location}</p>
                </div>
                <div className="p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Audience Type</h3>
                  <p className="text-gray-800 font-medium text-sm">{audienceType || "General audience"}</p>
                </div>
              </div>
              
              {/* Result Content */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-8 border border-slate-200 shadow-inner">
                <div className="prose prose-slate max-w-none">
                  {rewrittenArticle.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Audience Type Confirmation Modal */}
      {showAudienceConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold mr-2">!</span>
              Audience Type Not Specified
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              You haven&apos;t specified a target audience type. Would you like to continue with a general audience?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAudienceConfirm(false)}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-red-700 to-red-800 text-white font-medium rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all text-xs sm:text-sm"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-xs sm:max-w-sm w-full mx-4 p-4 sm:p-6 text-center">
            <div className="flex justify-center mb-3">
              <ArrowPathIcon className="h-12 w-12 text-red-800 animate-spin" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Creating Your Narrative</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Please wait while we craft a personalized narrative based on your parameters...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}