// components/debates/DecisionTreeChat.jsx
"use client";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  TreePine,
  MessageSquare,
  RotateCcw,
  FileText,
  Loader2,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  TrendingUp,
  History
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const DecisionTreeChat = ({ debateTopicId, newsGroupId, onBack, userPlan }) => {
  const [treeData, setTreeData] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedPath, setSelectedPath] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debateInfo, setDebateInfo] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [pathsExplored, setPathsExplored] = useState(new Set());

  useEffect(() => {
    fetchDecisionTree();
    fetchUserProgress();
  }, [debateTopicId]);

  const fetchDecisionTree = async () => {
    try {
     const token = localStorage.getItem('user_token');
      const response = await fetch(`/api/debates/decision-tree/${debateTopicId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTreeData(data.tree);
        setDebateInfo(data.debateInfo);
        
        // Start with the root response (level 1)
        const rootResponse = data.tree.find(r => r.level === 1 && !r.parent_response_id);
        if (rootResponse) {
          setCurrentResponse(rootResponse);
        }
      } else {
        toast.error('Failed to load decision tree');
      }
    } catch (error) {
      console.error('Error fetching decision tree:', error);
      toast.error('Error loading debate');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
     const token = localStorage.getItem('user_token');
      const response = await fetch(`/api/debates/progress/${debateTopicId}/decision_tree`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress);
        if (data.progress?.conversationHistory) {
          setConversationHistory(data.progress.conversationHistory);
          setSelectedPath(data.progress.selectedPath || []);
          setPathsExplored(new Set(data.progress.pathsExplored || []));
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleOptionSelect = async (option) => {
    // Add current response and selected option to history
    const newHistoryItem = {
      response: currentResponse,
      selectedOption: option,
      timestamp: new Date().toISOString()
    };

    const newHistory = [...conversationHistory, newHistoryItem];
    const newPath = [...selectedPath, option.id];
    const newPathsExplored = new Set([...pathsExplored, `${currentResponse.id}-${option.id}`]);

    setConversationHistory(newHistory);
    setSelectedPath(newPath);
    setPathsExplored(newPathsExplored);

    // Save progress
    await saveProgress(newHistory, newPath, Array.from(newPathsExplored));

    // Check if this option leads to another response
    if (option.leads_to_response_id) {
      const nextResponse = treeData.find(r => r.id === option.leads_to_response_id);
      if (nextResponse) {
        setCurrentResponse(nextResponse);
      }
    } else if (option.is_terminal) {
      // Reached end of this path
      setIsComplete(true);
      setShowReport(true);
      await handleDebateComplete();
      toast.success('Path completed! You can explore other paths or review your journey.');
    }
  };

  const saveProgress = async (history, path, explored) => {
    try {
     const token = localStorage.getItem('user_token');
      await fetch('/api/debates/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          debateTopicId,
          debateType: 'decision_tree',
          progress: {
            conversationHistory: history,
            selectedPath: path,
            pathsExplored: explored,
            currentResponseId: currentResponse?.id
          }
        })
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleDebateComplete = async () => {
    try {
     const token = localStorage.getItem('user_token');
      await fetch('/api/debates/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          debateTopicId,
          debateType: 'decision_tree',
          completedAt: new Date().toISOString(),
          pathsExplored: Array.from(pathsExplored).length,
          totalResponses: conversationHistory.length
        })
      });
    } catch (error) {
      console.error('Error marking debate as complete:', error);
    }
  };

  const resetDebate = () => {
    const rootResponse = treeData.find(r => r.level === 1 && !r.parent_response_id);
    setCurrentResponse(rootResponse);
    setConversationHistory([]);
    setSelectedPath([]);
    setIsComplete(false);
    setShowReport(false);
  };

  const goBackToResponse = (historyIndex) => {
    const targetHistory = conversationHistory.slice(0, historyIndex + 1);
    const targetResponse = targetHistory[historyIndex]?.response;
    
    if (targetResponse) {
      setCurrentResponse(targetResponse);
      setConversationHistory(targetHistory);
      setSelectedPath(targetHistory.map(h => h.selectedOption.id));
      setIsComplete(false);
    }
  };

  const generateReport = () => {
    if (!conversationHistory.length) return null;

    const totalPaths = Array.from(pathsExplored).length;
    const averageResponseLength = conversationHistory.reduce((acc, item) => 
      acc + (item.response?.ai_message?.length || 0), 0) / conversationHistory.length;

    const positionCounts = conversationHistory.reduce((acc, item) => {
      const position = item.selectedOption?.option_position;
      acc[position] = (acc[position] || 0) + 1;
      return acc;
    }, {});

    const dominantPosition = Object.entries(positionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

    return {
      pathsExplored: totalPaths,
      responsesGiven: conversationHistory.length,
      dominantPosition,
      positionBreakdown: positionCounts,
      insights: [
        `Explored ${totalPaths} different conversation paths`,
        `Made ${conversationHistory.length} decisions throughout the debate`,
        `Showed a ${dominantPosition} leaning in responses`,
        'Demonstrated thoughtful engagement with complex topics'
      ],
      recommendations: [
        'Try exploring paths with different position leanings',
        'Consider the long-term implications of each choice',
        'Look for opportunities to find common ground',
        'Practice defending positions you initially disagree with'
      ]
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading decision tree...</p>
        </div>
      </div>
    );
  }

  if (!treeData || !currentResponse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Debate Hub
          </Button>
          
          <Card>
            <CardContent className="text-center py-12">
              <TreePine className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Decision Tree Not Available
              </h3>
              <p className="text-gray-600">
                The interactive decision tree for this debate topic is not available yet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentOptions = treeData.filter(item => 
    item.mc_response_id === currentResponse.id && item.option_text
  );

  const progress = conversationHistory.length > 0 ? 
    Math.min((conversationHistory.length / 10) * 100, 100) : 0;

  const report = generateReport();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Debate Hub
          </Button>
          
          <Badge className="bg-purple-100 text-purple-800">
            <TreePine className="w-3 h-3 mr-1" />
            Interactive Decision Tree
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Topic Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {debateInfo?.topic_title}
                </CardTitle>
                <p className="text-gray-600">{debateInfo?.topic_description}</p>
              </CardHeader>
            </Card>

            {/* Progress */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Progress: {conversationHistory.length} decisions made
                    </span>
                    <span className="text-sm text-gray-600">
                      {pathsExplored.size} paths explored
                    </span>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex items-center gap-2 justify-center">
                    <Button onClick={resetDebate} variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Start Over
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current AI Response */}
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-purple-200">
                    <MessageSquare className="w-5 h-5 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-purple-800">
                        {currentResponse.ai_persona}
                      </span>
                      <Badge className="bg-purple-200 text-purple-800 text-xs">
                        AI Moderator
                      </Badge>
                    </div>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {currentResponse.ai_message}
                    </p>
                    
                    {/* Response Options */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-purple-800">
                        How would you respond?
                      </h4>
                      {currentOptions.map((option, index) => (
                        <Button
                          key={option.id}
                          onClick={() => handleOptionSelect(option)}
                          className={`w-full text-left justify-start p-4 h-auto ${
                            option.option_position === 'for' 
                              ? 'bg-green-100 hover:bg-green-200 text-green-800 border-green-300'
                              : option.option_position === 'against'
                              ? 'bg-red-100 hover:bg-red-200 text-red-800 border-red-300'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
                          }`}
                          variant="outline"
                        >
                          <div className="flex items-start gap-3 w-full">
                            <div className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center text-xs font-medium">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{option.option_text}</p>
                              {option.is_terminal && (
                                <Badge className="mt-2 bg-yellow-100 text-yellow-800 text-xs">
                                  Ends conversation
                                </Badge>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 mt-1 opacity-60" />
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Section */}
            {showReport && report && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Your Debate Journey Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {report.pathsExplored}
                      </div>
                      <div className="text-sm text-gray-600">Paths Explored</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {report.responsesGiven}
                      </div>
                      <div className="text-sm text-gray-600">Decisions Made</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {report.dominantPosition}
                      </div>
                      <div className="text-sm text-gray-600">Dominant Stance</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round((report.pathsExplored / 10) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Exploration Rate</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Key Insights
                    </h4>
                    <ul className="space-y-2">
                      {report.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Recommendations for Next Time
                    </h4>
                    <ul className="space-y-2">
                      {report.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Conversation History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Your Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {conversationHistory.map((item, index) => (
                    <div 
                      key={index}
                      className="p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => goBackToResponse(index)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        <Badge className={`text-xs ${
                          item.selectedOption.option_position === 'for' 
                            ? 'bg-green-100 text-green-800'
                            : item.selectedOption.option_position === 'against'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.selectedOption.option_position}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {item.selectedOption.option_text}
                      </p>
                    </div>
                  ))}
                  {conversationHistory.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Your decisions will appear here
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Decisions:</span>
                    <Badge variant="outline">{conversationHistory.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Paths Explored:</span>
                    <Badge variant="outline">{pathsExplored.size}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Level:</span>
                    <Badge variant="outline">{currentResponse?.level || 1}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Position Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Position Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">For - Supporting arguments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Against - Opposing arguments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm">Neutral - Balanced perspective</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionTreeChat;