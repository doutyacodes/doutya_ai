// "use client";

// import { useState, useEffect } from 'react';
// import { PlusIcon, TrashIcon, ClipboardIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// export default function NewsRewriter() {
//   // State for the original article
//   const [article, setArticle] = useState('');
  
//   // State for the bias entries
//   const [biasEntries, setBiasEntries] = useState([
//     { id: 1, type: 'Pro', entity: '', percentage: 0 }
//   ]);
  
//   // State for age range
//   const [ageRange, setAgeRange] = useState({ min: 18, max: 65 });
  
//   // State for location
//   const [location, setLocation] = useState('');
  
//   // State for audience type
//   const [audienceType, setAudienceType] = useState('');
  
//   // State for rewritten article
//   const [rewrittenArticle, setRewrittenArticle] = useState('');
  
//   // State for loading status
//   const [isLoading, setIsLoading] = useState(false);
  
//   // State for showing audience type confirmation
//   const [showAudienceConfirm, setShowAudienceConfirm] = useState(false);

//   // State for validation errors
//   const [errors, setErrors] = useState({});

//   // Function to add a new bias entry
//   const addBiasEntry = (type) => {
//     const newEntry = {
//       id: Date.now(),
//       type,
//       entity: '',
//       percentage: 0
//     };
//     setBiasEntries([...biasEntries, newEntry]);
//   };

//   // Function to remove a bias entry
//   const removeBiasEntry = (id) => {
//     setBiasEntries(biasEntries.filter(entry => entry.id !== id));
//   };

//   // Function to update a bias entry
//   const updateBiasEntry = (id, field, value) => {
//     const updatedEntries = biasEntries.map(entry => {
//       if (entry.id === id) {
//         return { ...entry, [field]: field === 'percentage' ? parseInt(value, 10) || 0 : value };
//       }
//       return entry;
//     });
//     setBiasEntries(updatedEntries);
//   };

//   // Calculate total percentage for each bias type
//   const calculateTotalPercentage = (type) => {
//     return biasEntries
//       .filter(entry => entry.type === type)
//       .reduce((sum, entry) => sum + entry.percentage, 0);
//   };

//   // Function to handle form submission
//   const handleSubmit = async (skipConfirm = false) => {
//     // Reset errors
//     setErrors({});
    
//     // Validate inputs
//     const newErrors = {};
    
//     if (!article.trim()) {
//       newErrors.article = 'Please enter an article to rewrite';
//     }
    
//     if (!location.trim()) {
//       newErrors.location = 'Please enter a target location';
//     }
    
//     // Check Pro percentage total
//     const proTotal = calculateTotalPercentage('Pro');
//     const againstTotal = calculateTotalPercentage('Against');
    
//     if (proTotal + againstTotal !== 100) {
//       newErrors.bias = 'Bias percentages must add up to 100%';
//     }
    
//     // Check for empty entities
//     const hasEmptyEntity = biasEntries.some(entry => !entry.entity.trim());
//     if (hasEmptyEntity) {
//       newErrors.entity = 'All bias entities must be filled';
//     }
    
//     // Check if at least one bias entry exists
//     if (biasEntries.length === 0) {
//       newErrors.bias = 'At least one bias entry is required';
//     }
    
//     // Check age range
//     if (ageRange.min >= ageRange.max) {
//       newErrors.age = 'Minimum age must be less than maximum age';
//     }
    
//     // Set errors and return if any exist
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }
    
//     // Check if audience type is empty and show confirmation if not skipped
//     if (!audienceType.trim() && !skipConfirm) {
//       setShowAudienceConfirm(true);
//       return;
//     }
    
//     // Reset confirmation dialog
//     setShowAudienceConfirm(false);
    
//     // Start loading
//     setIsLoading(true);
    
//     try {
//       const response = await fetch('/api/narrative', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           biasList: biasEntries,
//           ageRange: `${ageRange.min} to ${ageRange.max}`,
//           location,
//           audienceType: audienceType.trim() || 'General audience',
//           originalArticle: article,
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to rewrite article');
//       }
      
//       const data = await response.json();
//       setRewrittenArticle(data.rewrittenArticle);
//     } catch (error) {
//       console.error('Error rewriting article:', error);
//       setErrors({ submit: 'Failed to rewrite article. Please try again.' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Function to copy rewritten article to clipboard
//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(rewrittenArticle)
//       .then(() => {
//         // Show a temporary copied message
//         const copyBtn = document.getElementById('copy-btn');
//         const originalText = copyBtn.textContent;
//         copyBtn.textContent = 'Copied!';
//         setTimeout(() => {
//           copyBtn.textContent = originalText;
//         }, 2000);
//       })
//       .catch(err => {
//         console.error('Error copying to clipboard:', err);
//       });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-gray-900">News Article Rewriter</h1>
//           <p className="mt-2 text-lg text-gray-600">
//             Customize news articles based on bias, age, location, and audience
//           </p>
//         </div>
        
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Left Column - Input Parameters */}
//               <div className="space-y-6">
//                 {/* Bias Configuration */}
//                 <div>
//                   <h2 className="text-lg font-medium text-gray-900 mb-3">Bias Configuration</h2>
                  
//                   {errors.bias && (
//                     <p className="text-red-600 text-sm mb-2">{errors.bias}</p>
//                   )}
//                   {errors.entity && (
//                     <p className="text-red-600 text-sm mb-2">{errors.entity}</p>
//                   )}
                  
//                   <div className="space-y-4">
//                     {biasEntries.map(entry => (
//                       <div key={entry.id} className="flex flex-col space-y-2">
//                         <div className="flex items-center justify-between">
//                           <div className="bg-gray-100 px-3 py-1 rounded text-sm font-medium">
//                             {entry.type}
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => removeBiasEntry(entry.id)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             <TrashIcon className="h-5 w-5" />
//                           </button>
//                         </div>
                        
//                         <div className="flex space-x-2">
//                           <div className="flex-grow">
//                             <input
//                               type="text"
//                               placeholder="Entity name"
//                               value={entry.entity}
//                               onChange={(e) => updateBiasEntry(entry.id, 'entity', e.target.value)}
//                               className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-red-800 focus:border-red-800"
//                             />
//                           </div>
//                           <div className="w-24">
//                             <div className="relative">
//                               <input
//                                 type="number"
//                                 min="0"
//                                 max="100"
//                                 value={entry.percentage}
//                                 onChange={(e) => updateBiasEntry(entry.id, 'percentage', e.target.value)}
//                                 className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-red-800 focus:border-red-800"
//                               />
//                               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                                 <span className="text-gray-500">%</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
                  
//                   <div className="flex justify-between mt-4">
//                     <div className="flex space-x-3">
//                       <button
//                         type="button"
//                         onClick={() => addBiasEntry('Pro')}
//                         className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
//                       >
//                         <PlusIcon className="h-4 w-4 mr-1" />
//                         Add Pro
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => addBiasEntry('Against')}
//                         className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
//                       >
//                         <PlusIcon className="h-4 w-4 mr-1" />
//                         Add Against
//                       </button>
//                     </div>
                    
//                     <div className="text-right">
//                       <p className={`text-sm font-medium ${calculateTotalPercentage('Pro') + calculateTotalPercentage('Against') === 100 ? 'text-green-600' : 'text-red-600'}`}>
//                         Total: {calculateTotalPercentage('Pro') + calculateTotalPercentage('Against')}%
//                       </p>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Age Range */}
//                 <div>
//                   <h2 className="text-lg font-medium text-gray-900 mb-3">Target Age Range</h2>
                  
//                   {errors.age && (
//                     <p className="text-red-600 text-sm mb-2">{errors.age}</p>
//                   )}
                  
//                   <div className="flex items-center space-x-4">
//                     <div>
//                       <label htmlFor="min-age" className="block text-sm font-medium text-gray-700">
//                         Minimum
//                       </label>
//                       <input
//                         type="number"
//                         id="min-age"
//                         min="1"
//                         max="120"
//                         value={ageRange.min}
//                         onChange={(e) => setAgeRange({ ...ageRange, min: parseInt(e.target.value, 10) || 1 })}
//                         className="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-red-800 focus:border-red-800"
//                       />
//                     </div>
                    
//                     <span className="text-gray-500">to</span>
                    
//                     <div>
//                       <label htmlFor="max-age" className="block text-sm font-medium text-gray-700">
//                         Maximum
//                       </label>
//                       <input
//                         type="number"
//                         id="max-age"
//                         min="1"
//                         max="120"
//                         value={ageRange.max}
//                         onChange={(e) => setAgeRange({ ...ageRange, max: parseInt(e.target.value, 10) || 1 })}
//                         className="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-red-800 focus:border-red-800"
//                       />
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Location */}
//                 <div>
//                   <h2 className="text-lg font-medium text-gray-900 mb-3">Target Location</h2>
                  
//                   {errors.location && (
//                     <p className="text-red-600 text-sm mb-2">{errors.location}</p>
//                   )}
                  
//                   <input
//                     type="text"
//                     placeholder="Enter location (e.g., India, New York, etc.)"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-red-800 focus:border-red-800"
//                   />
//                 </div>
                
//                 {/* Audience Type */}
//                 <div>
//                   <h2 className="text-lg font-medium text-gray-900 mb-3">
//                     Type of People (Optional)
//                   </h2>
//                   <input
//                     type="text"
//                     placeholder="E.g., College students, Politicians, Retired persons"
//                     value={audienceType}
//                     onChange={(e) => setAudienceType(e.target.value)}
//                     className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-red-800 focus:border-red-800"
//                   />
//                 </div>
//               </div>
              
//               {/* Right Column - Article Input and Output */}
//               <div className="space-y-6">
//                 {/* Original Article */}
//                 <div>
//                   <h2 className="text-lg font-medium text-gray-900 mb-3">Original Article</h2>
                  
//                   {errors.article && (
//                     <p className="text-red-600 text-sm mb-2">{errors.article}</p>
//                   )}
                  
//                   <textarea
//                     placeholder="Paste or type your news article here..."
//                     value={article}
//                     onChange={(e) => setArticle(e.target.value)}
//                     rows="12"
//                     className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-red-800 focus:border-red-800"
//                   ></textarea>
//                 </div>
                
//                 {/* Submit Button */}
//                 <div className="flex justify-center">
//                   <button
//                     type="button"
//                     onClick={() => handleSubmit()}
//                     disabled={isLoading}
//                     className="px-6 py-3 bg-red-800 text-white font-medium rounded-md shadow-sm hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 disabled:opacity-50 flex items-center"
//                   >
//                     {isLoading ? (
//                       <>
//                         <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
//                         Rewriting...
//                       </>
//                     ) : (
//                       'Rewrite Article'
//                     )}
//                   </button>
//                 </div>
                
//                 {errors.submit && (
//                   <p className="text-red-600 text-sm text-center">{errors.submit}</p>
//                 )}
//               </div>
//             </div>
            
//             {/* Rewritten Article Result */}
//             {rewrittenArticle && (
//               <div className="mt-8 border-t border-gray-200 pt-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold text-gray-900">Rewritten Article</h2>
//                   <button
//                     id="copy-btn"
//                     type="button"
//                     onClick={copyToClipboard}
//                     className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
//                   >
//                     <ClipboardIcon className="h-5 w-5 mr-1" />
//                     Copy
//                   </button>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
//                   <div className="prose max-w-none">
//                     {rewrittenArticle.split('\n\n').map((paragraph, index) => (
//                       <p key={index} className="mb-4">
//                         {paragraph}
//                       </p>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Audience Type Confirmation Modal */}
//       {showAudienceConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-3">Audience Type Not Specified</h3>
//             <p className="text-gray-600 mb-6">
//               You haven't specified a target audience type. Would you like to continue with a general audience?
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={() => setShowAudienceConfirm(false)}
//                 className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleSubmit(true)}
//                 className="px-4 py-2 bg-red-800 text-white font-medium rounded-md shadow-sm hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
//               >
//                 Continue
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, ClipboardIcon, ArrowPathIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

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
      const response = await fetch('/api/narrative', {
        method: 'POST',
        headers: {
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
      
      const data = await response.json();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-800">News Article Rewriter</h1>
          <p className="mt-2 text-lg text-gray-600">
            Customize news articles based on bias, age, location, and audience
          </p>
        </div>
        
        {!showResults ? (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Input Parameters */}
                <div className="space-y-8">
                  {/* Bias Configuration */}
                  <div className="bg-slate-50 p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-2">1</span>
                      Bias Configuration
                    </h2>
                    
                    {errors.bias && (
                      <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-md border-l-4 border-red-500">{errors.bias}</p>
                    )}
                    {errors.entity && (
                      <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-md border-l-4 border-red-500">{errors.entity}</p>
                    )}
                    
                    <div className="space-y-4">
                      {biasEntries.map(entry => (
                        <div key={entry.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
                          <div className="flex items-center justify-between mb-3">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${entry.type === 'Pro' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {entry.type}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeBiasEntry(entry.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                          
                          <div className="flex space-x-2">
                            <div className="flex-grow">
                              <input
                                type="text"
                                placeholder="Entity name"
                                value={entry.entity}
                                onChange={(e) => updateBiasEntry(entry.id, 'entity', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                              />
                            </div>
                            <div className="w-24">
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={entry.percentage}
                                  onChange={(e) => updateBiasEntry(entry.id, 'percentage', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500">%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap justify-between mt-4">
                      <div className="flex space-x-3 mb-3 sm:mb-0">
                        <button
                          type="button"
                          onClick={() => addBiasEntry('Pro')}
                          className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 border border-green-200 rounded-full shadow-sm text-sm font-medium hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Pro
                        </button>
                        <button
                          type="button"
                          onClick={() => addBiasEntry('Against')}
                          className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 border border-red-200 rounded-full shadow-sm text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Against
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium inline-block px-3 py-1 rounded-full ${calculateTotalPercentage('Pro') + calculateTotalPercentage('Against') === 100 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          Total: {calculateTotalPercentage('Pro') + calculateTotalPercentage('Against')}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Age Range */}
                  <div className="bg-slate-50 p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-2">2</span>
                      Target Age Range
                    </h2>
                    
                    {errors.age && (
                      <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-md border-l-4 border-red-500">{errors.age}</p>
                    )}
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex-1">
                        <label htmlFor="min-age" className="block text-sm font-medium text-gray-700 mb-1">
                          Minimum Age
                        </label>
                        <input
                          type="number"
                          id="min-age"
                          min="1"
                          max="120"
                          value={ageRange.min}
                          onChange={(e) => setAgeRange({ ...ageRange, min: parseInt(e.target.value, 10) || 1 })}
                          className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      
                      <div className="flex items-center justify-center h-10 w-10 bg-gray-200 rounded-full">
                        <span className="text-gray-600 font-medium">to</span>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="max-age" className="block text-sm font-medium text-gray-700 mb-1">
                          Maximum Age
                        </label>
                        <input
                          type="number"
                          id="max-age"
                          min="1"
                          max="120"
                          value={ageRange.max}
                          onChange={(e) => setAgeRange({ ...ageRange, max: parseInt(e.target.value, 10) || 1 })}
                          className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="bg-slate-50 p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-2">3</span>
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
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  
                  {/* Audience Type */}
                  <div className="bg-slate-50 p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-2">4</span>
                      Type of People (Optional)
                    </h2>
                    <input
                      type="text"
                      placeholder="E.g., College students, Politicians, Retired persons"
                      value={audienceType}
                      onChange={(e) => setAudienceType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
                
                {/* Right Column - Article Input and Output */}
                <div className="space-y-8">
                  {/* Original Article */}
                  <div className="bg-slate-50 p-6 rounded-xl shadow-sm h-full">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-2">5</span>
                      Original Article
                    </h2>
                    
                    {errors.article && (
                      <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-md border-l-4 border-red-500">{errors.article}</p>
                    )}
                    
                    <textarea
                      placeholder="Paste or type your news article here..."
                      value={article}
                      onChange={(e) => setArticle(e.target.value)}
                      rows="16"
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors h-full"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center text-lg"
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                      Rewriting Article...
                    </>
                  ) : (
                    'Rewrite Article'
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
            <div className="p-8">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToForm}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full shadow-sm text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors mb-6"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Editor
              </button>
            
              {/* Result Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-800">
                  Rewritten Article
                </h2>
                <button
                  id="copy-btn"
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full shadow-sm text-sm font-medium hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <ClipboardIcon className="h-5 w-5 mr-2" />
                  Copy to Clipboard
                </button>
              </div>
              
              {/* Summary of settings */}
              <div className="bg-slate-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Bias Distribution</h3>
                  <div className="flex flex-wrap gap-2">
                    {biasEntries.map(entry => (
                      <span 
                        key={entry.id} 
                        className={`text-xs px-2 py-1 rounded-full ${entry.type === 'Pro' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {entry.entity}: {entry.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Age Range</h3>
                  <p className="text-gray-800 font-medium">{ageRange.min} to {ageRange.max} years</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                  <p className="text-gray-800 font-medium">{location}</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Audience Type</h3>
                  <p className="text-gray-800 font-medium">{audienceType || "General audience"}</p>
                </div>
              </div>
              
              {/* Result Content */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-slate-200 shadow-inner">
                <div className="prose prose-slate max-w-none">
                  {rewrittenArticle.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
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
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold mr-2">!</span>
              Audience Type Not Specified
            </h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t specified a target audience type. Would you like to continue with a general audience?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAudienceConfirm(false)}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}