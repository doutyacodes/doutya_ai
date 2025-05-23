"use client"
import { useState } from 'react';
import { ArrowLeft, FileText, Brain, TrendingUp, Users, BookOpen, Eye, Share2, AlertTriangle, Loader2 } from 'lucide-react';

export default function NewsAnalyzer() {
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!title.trim() || !article.trim()) {
      setError('Please enter both title and article content');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newstech/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          article: article.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysis(data.data);
    } catch (err) {
      setError(err.message || 'Failed to analyze article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setArticle('');
    setAnalysis(null);
    setError('');
  };

  const getSentimentColor = (sentiment) => {
    if (!sentiment) return 'text-gray-600';
    const lower = sentiment.toLowerCase();
    if (lower.includes('positive')) return 'text-green-600';
    if (lower.includes('negative')) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getViralityColor = (score) => {
    if (score >= 7) return 'text-red-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (analysis) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analysis Results</h1>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">New Analysis</span>
              </button>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="font-semibold text-red-900 mb-2">{analysis.title}</h2>
              <p className="text-red-700 text-sm">Analysis completed on {new Date(analysis.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Analysis Sections */}
          <div className="space-y-6">
            {/* Bias & Perspective */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-red-800" />
                <h3 className="text-xl font-semibold text-gray-900">Bias & Perspective Analysis</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Political Leaning</h4>
                    <p className="text-gray-700 text-sm">{analysis.politicalLeaning}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Framing Bias</h4>
                    <p className="text-gray-700 text-sm">{analysis.framingBias}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Tone Analysis</h4>
                    <p className="text-gray-700 text-sm">{analysis.toneAnalysis}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Omission Bias</h4>
                    <p className="text-gray-700 text-sm">{analysis.omissionBias}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Quote Balance</h4>
                    <p className="text-gray-700 text-sm">{analysis.quoteBalance}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sentiment & Emotion */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-red-800" />
                <h3 className="text-xl font-semibold text-gray-900">Sentiment & Emotion</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Overall Sentiment</h4>
                  <p className={`text-sm font-medium ${getSentimentColor(analysis.overallSentiment)}`}>
                    {analysis.overallSentiment}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Emotional Tone</h4>
                  <p className="text-gray-700 text-sm">{analysis.emotionalTone}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Headline Consistency</h4>
                  <p className="text-gray-700 text-sm">{analysis.headlineVsBodyConsistency}</p>
                </div>
              </div>
            </div>

            {/* Language Complexity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-red-800" />
                <h3 className="text-xl font-semibold text-gray-900">Language Complexity</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Readability Score</h4>
                    <p className="text-gray-700 text-sm">
                      Grade Level: <span className="font-medium">{analysis.readabilityScore}</span>
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Writing Style</h4>
                    <p className="text-gray-700 text-sm">{analysis.writingStyle}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Jargon Detection</h4>
                    <p className="text-gray-700 text-sm">{analysis.jargonDetected}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Passive Voice Usage</h4>
                    <p className="text-gray-700 text-sm">{analysis.passiveVoiceUsage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Source Reliability */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-red-800" />
                <h3 className="text-xl font-semibold text-gray-900">Source Reliability</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Cited Sources</h4>
                  <p className="text-2xl font-bold text-red-800">{analysis.numCitedSources}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Source Reputation</h4>
                  <p className="text-gray-700 text-sm">{analysis.sourceReputation}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Fact-Check Items</h4>
                  <p className="text-gray-700 text-sm">{analysis.factCheckItems}</p>
                </div>
              </div>
            </div>

            {/* Clarity & Comprehension */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-red-800" />
                <h3 className="text-xl font-semibold text-gray-900">Clarity & Comprehension</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Time to Clarity</h4>
                  <p className="text-gray-700 text-sm">{analysis.timeToClarity}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Insight Ratio</h4>
                  <p className="text-gray-700 text-sm">{analysis.insightRatio}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Ambiguity Score</h4>
                  <p className="text-gray-700 text-sm">{analysis.ambiguityScore}</p>
                </div>
              </div>
            </div>

            {/* Engagement Prediction */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-red-800" />
                <h3 className="text-xl font-semibold text-gray-900">Engagement Prediction</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Predicted Dwell Time</h4>
                  <p className="text-gray-700 text-sm">{analysis.predictedDwellTime}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Scroll Depth</h4>
                  <p className="text-gray-700 text-sm">{analysis.scrollDepthPrediction}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Retention Expectation</h4>
                  <p className="text-gray-700 text-sm">{analysis.expectedBounceRetention}</p>
                </div>
              </div>
            </div>

            {/* Virality & Shareability */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-6 h-6 text-red-800" />
                <h3 className="text-xl font-semibold text-gray-900">Virality & Shareability</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Virality Score</h4>
                  <p className={`text-2xl font-bold ${getViralityColor(analysis.headlineViralityScore)}`}>
                    {analysis.headlineViralityScore}/10
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Social Bias Risk</h4>
                  <p className="text-gray-700 text-sm">{analysis.socialBiasRisk}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Clickbait Risk</h4>
                  <p className="text-gray-700 text-sm">{analysis.clickbaitRisk}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            AI News Article Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get comprehensive insights into news articles including bias detection, sentiment analysis, 
            readability scores, and virality predictions powered by advanced AI.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                Article Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the news article title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Article Input */}
            <div>
              <label htmlFor="article" className="block text-sm font-medium text-gray-900 mb-2">
                Article Content *
              </label>
              <textarea
                id="article"
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                placeholder="Paste the full news article content here..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-colors resize-none"
                disabled={isLoading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Paste the complete article text for accurate analysis
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !title.trim() || !article.trim()}
              className="w-full sm:w-auto px-8 py-3 bg-red-800 text-white font-medium rounded-lg hover:bg-red-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Article...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Analyze Article</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-red-800 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Bias Detection</h3>
                <p className="text-sm text-gray-600">Political leaning, framing, and tone analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-red-800 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Sentiment Analysis</h3>
                <p className="text-sm text-gray-600">Overall sentiment and emotional tone</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-red-800 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Readability</h3>
                <p className="text-sm text-gray-600">Complexity and accessibility scoring</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-red-800 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Source Analysis</h3>
                <p className="text-sm text-gray-600">Citation count and reputation assessment</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-red-800 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Engagement Prediction</h3>
                <p className="text-sm text-gray-600">Dwell time and retention forecasting</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Share2 className="w-5 h-5 text-red-800 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Virality Assessment</h3>
                <p className="text-sm text-gray-600">Shareability and clickbait risk analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
            <div className="mb-4">
              <Loader2 className="w-12 h-12 text-red-800 animate-spin mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analyzing Your Article
            </h3>
            <p className="text-gray-600 text-sm">
              Our AI is processing the content and generating comprehensive insights. This may take up to 2 minutes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}