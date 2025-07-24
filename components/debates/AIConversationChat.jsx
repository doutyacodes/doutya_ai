// components/debates/AIConversationChat.jsx
"use client";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Bot,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Loader2,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AIConversationChat = ({ debateTopicId, newsGroupId, onBack, userPlan }) => {
  const [conversations, setConversations] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(3000); // 3 seconds between messages
  const [debateInfo, setDebateInfo] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetchConversations();
    fetchUserProgress();
  }, [debateTopicId]);

  useEffect(() => {
    let interval;
    if (isPlaying && autoPlay && currentRound < conversations.length) {
      interval = setInterval(() => {
        if (currentRound < conversations.length - 1) {
          setCurrentRound(prev => prev + 1);
        } else {
          setIsPlaying(false);
          setIsComplete(true);
          handleDebateComplete();
        }
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, autoPlay, currentRound, conversations.length, playbackSpeed]);

  const fetchConversations = async () => {
    try {
     const token = localStorage.getItem('user_token');
      const response = await fetch(`/api/debates/ai-conversations/${debateTopicId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
        setDebateInfo(data.debateInfo);
      } else {
        toast.error('Failed to load AI conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Error loading debate');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
     const token = localStorage.getItem('user_token');
      const response = await fetch(`/api/debates/progress/${debateTopicId}/ai_conversation`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress);
        if (data.progress?.completed) {
          setIsComplete(true);
          setCurrentRound(conversations.length - 1);
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
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
          debateType: 'ai_conversation',
          completedAt: new Date().toISOString()
        })
      });
      
      toast.success('Debate completed! View your insights below.');
      setShowReport(true);
    } catch (error) {
      console.error('Error marking debate as complete:', error);
    }
  };

  const startDebate = () => {
    setIsPlaying(true);
    setAutoPlay(true);
    if (currentRound === 0) {
      setCurrentRound(0);
    }
  };

  const pauseDebate = () => {
    setIsPlaying(false);
    setAutoPlay(false);
  };

  const resetDebate = () => {
    setCurrentRound(0);
    setIsPlaying(false);
    setAutoPlay(false);
    setIsComplete(false);
    setShowReport(false);
  };

  const goToRound = (roundIndex) => {
    setCurrentRound(roundIndex);
    setIsPlaying(false);
    setAutoPlay(false);
  };

  const generateReport = () => {
    if (!conversations.length) return null;

    const forPosition = debateInfo?.positions?.find(p => p.position_type === 'for');
    const againstPosition = debateInfo?.positions?.find(p => p.position_type === 'against');

    return {
      summary: `This AI debate explored ${debateInfo?.topic_title} through ${conversations.length} structured rounds between ${forPosition?.ai_persona} and ${againstPosition?.ai_persona}.`,
      keyPoints: [
        `${forPosition?.ai_persona} emphasized the benefits and positive aspects`,
        `${againstPosition?.ai_persona} highlighted concerns and potential drawbacks`,
        'Both perspectives provided evidence-based arguments',
        'The debate covered multiple dimensions of the topic'
      ],
      insights: [
        'Complex issues often have valid arguments on multiple sides',
        'Evidence-based reasoning strengthens debate positions',
        'Understanding opposing viewpoints leads to better decision-making',
        'Structured debate format helps organize complex discussions'
      ]
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading AI conversation...</p>
        </div>
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Debate Hub
          </Button>
          
          <Card>
            <CardContent className="text-center py-12">
              <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Conversations Not Available
              </h3>
              <p className="text-gray-600">
                AI conversations for this debate topic are not available yet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentConversation = conversations[currentRound];
  const progress = ((currentRound + 1) / conversations.length) * 100;
  const report = generateReport();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Debate Hub
          </Button>
          
          <Badge className="bg-blue-100 text-blue-800">
            <Bot className="w-3 h-3 mr-1" />
            AI vs AI Debate
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

            {/* Progress and Controls */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Round {currentRound + 1} of {conversations.length}
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round(progress)}% Complete
                    </span>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex items-center gap-2 justify-center">
                    {!isComplete ? (
                      <>
                        {!isPlaying ? (
                          <Button onClick={startDebate} className="bg-blue-600 hover:bg-blue-700">
                            <Play className="w-4 h-4 mr-2" />
                            {currentRound === 0 ? 'Start Debate' : 'Continue'}
                          </Button>
                        ) : (
                          <Button onClick={pauseDebate} variant="outline">
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </Button>
                        )}
                        <Button onClick={resetDebate} variant="outline">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Debate Complete
                        </Badge>
                        <Button onClick={resetDebate} variant="outline" size="sm">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Watch Again
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Conversation */}
            {currentConversation && (
              <div className="space-y-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-green-200">
                        <Bot className="w-5 h-5 text-green-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-green-800">
                            {currentConversation.for_ai_persona}
                          </span>
                          <Badge className="bg-green-200 text-green-800 text-xs">FOR</Badge>
                        </div>
                        <p className="text-gray-800 leading-relaxed">
                          {currentConversation.for_message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-red-200">
                        <Bot className="w-5 h-5 text-red-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-red-800">
                            {currentConversation.against_ai_persona}
                          </span>
                          <Badge className="bg-red-200 text-red-800 text-xs">AGAINST</Badge>
                        </div>
                        <p className="text-gray-800 leading-relaxed">
                          {currentConversation.against_message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Report Section */}
            {(isComplete || showReport) && report && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Debate Analysis & Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Summary</h4>
                    <p className="text-gray-700">{report.summary}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Key Discussion Points</h4>
                    <ul className="space-y-2">
                      {report.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Learning Insights</h4>
                    <ul className="space-y-2">
                      {report.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-200 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{insight}</span>
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
            {/* Round Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Debate Rounds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conversations.map((conv, index) => (
                    <Button
                      key={index}
                      variant={currentRound === index ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => goToRound(index)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        Round {index + 1}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Debate Positions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Debate Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {debateInfo?.positions?.map((position) => (
                    <div 
                      key={position.id}
                      className={`p-3 rounded-lg border ${
                        position.position_type === 'for' 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={
                          position.position_type === 'for' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }>
                          {position.position_type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm">{position.position_title}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>AI:</strong> {position.ai_persona}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Playback Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Playback Speed</label>
                    <select 
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="w-full mt-1 p-2 border rounded-md text-sm"
                    >
                      <option value={1000}>Fast (1s)</option>
                      <option value={2000}>Normal (2s)</option>
                      <option value={3000}>Slow (3s)</option>
                      <option value={5000}>Very Slow (5s)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Stats */}
            {userProgress && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge className={
                        userProgress.completed 
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }>
                        {userProgress.completed ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                    {userProgress.completedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completed:</span>
                        <span className="text-sm text-gray-600">
                          {new Date(userProgress.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConversationChat;