// components/debates/UserDebateChat.jsx
"use client";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Send,
  RotateCcw,
  FileText,
  Loader2,
  CheckCircle,
  Clock,
  Trophy,
  Target,
  Lightbulb,
  TrendingUp,
  Star,
  Brain,
  Zap
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

const UserDebateChat = ({ debateTopicId, newsGroupId, onBack, userPlan }) => {
  const [debateInfo, setDebateInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [debateState, setDebateState] = useState('not_started'); // not_started, in_progress, completed
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [aiOpponent, setAiOpponent] = useState(null);
  const [round, setRound] = useState(0);
  const [maxRounds] = useState(5);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(null);
  const [debateScore, setDebateScore] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [timeLimit] = useState(120); // 2 minutes per response
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [showReport, setShowReport] = useState(false);
  
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchDebateInfo();
    fetchUserProgress();
  }, [debateTopicId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Timer for user responses
    if (debateState === 'in_progress' && !isTyping && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [debateState, isTyping, timeRemaining]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchDebateInfo = async () => {
    try {
     const token = localStorage.getItem('user_token');
      const response = await fetch(`/api/debates/user-debate/${debateTopicId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDebateInfo(data.debateInfo);
      } else {
        toast.error('Failed to load debate information');
      }
    } catch (error) {
      console.error('Error fetching debate info:', error);
      toast.error('Error loading debate');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
     const token = localStorage.getItem('user_token');
      const response = await fetch(`/api/debates/progress/${debateTopicId}/user_debate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress);
        if (data.progress?.completed) {
          setDebateState('completed');
          setMessages(data.progress.messages || []);
          setDebateScore(data.progress.score);
          setFeedback(data.progress.feedback || []);
          setShowReport(true);
        } else if (data.progress?.inProgress) {
          setDebateState('in_progress');
          setMessages(data.progress.messages || []);
          setRound(data.progress.round || 0);
          setSelectedPosition(data.progress.selectedPosition);
          setAiOpponent(data.progress.aiOpponent);
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const startDebate = async (position) => {
    try {
     const token = localStorage.getItem('user_token');
      const response = await fetch('/api/debates/start-user-debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          debateTopicId,
          selectedPosition: position.position_type,
          userPosition: position
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedPosition(position);
        setAiOpponent(data.aiOpponent);
        setDebateState('in_progress');
        setRound(1);
        setTimeRemaining(timeLimit);
        
        // Add AI's opening statement
        const openingMessage = {
          id: Date.now(),
          type: 'ai',
          content: data.openingStatement,
          timestamp: new Date().toISOString(),
          round: 1
        };
        
        setMessages([openingMessage]);
        toast.success('Debate started! Make your opening argument.');
      } else {
        toast.error('Failed to start debate');
      }
    } catch (error) {
      console.error('Error starting debate:', error);
      toast.error('Error starting debate');
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage.trim(),
      timestamp: new Date().toISOString(),
      round
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setCurrentMessage('');
    setIsTyping(true);
    setTimeRemaining(timeLimit);

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    try {
     const token = localStorage.getItem('user_token');
      const response = await fetch('/api/debates/user-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          debateTopicId,
          userMessage: userMessage.content,
          round,
          conversationHistory: updatedMessages
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.aiResponse,
          timestamp: new Date().toISOString(),
          round: round + 1,
          feedback: data.feedback
        };

        setMessages(prev => [...prev, aiResponse]);
        
        if (data.feedback) {
          setFeedback(prev => [...prev, data.feedback]);
        }

        if (round >= maxRounds) {
          // Debate completed
          setDebateState('completed');
          setDebateScore(data.finalScore);
          setShowReport(true);
          await handleDebateComplete(data.finalScore, [...updatedMessages, aiResponse]);
          toast.success('Debate completed! Check your performance report.');
        } else {
          setRound(prev => prev + 1);
          setTimeRemaining(timeLimit);
        }
      } else {
        toast.error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message');
    } finally {
      setIsTyping(false);
    }
  };

  const handleTimeout = async () => {
    if (debateState !== 'in_progress') return;

    const timeoutMessage = {
      id: Date.now(),
      type: 'system',
      content: 'Time limit exceeded. AI opponent wins this round.',
      timestamp: new Date().toISOString(),
      round
    };

    setMessages(prev => [...prev, timeoutMessage]);
    
    if (round >= maxRounds) {
      setDebateState('completed');
      setShowReport(true);
      await handleDebateComplete(0, [...messages, timeoutMessage]);
    } else {
      setRound(prev => prev + 1);
      setTimeRemaining(timeLimit);
    }
  };

  const handleDebateComplete = async (finalScore, finalMessages) => {
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
          debateType: 'user_debate',
          completedAt: new Date().toISOString(),
          score: finalScore,
          messages: finalMessages,
          feedback: feedback,
          rounds: round
        })
      });
    } catch (error) {
      console.error('Error marking debate as complete:', error);
    }
  };

  const resetDebate = () => {
    setDebateState('not_started');
    setMessages([]);
    setCurrentMessage('');
    setSelectedPosition(null);
    setAiOpponent(null);
    setRound(0);
    setTimeRemaining(timeLimit);
    setDebateScore(null);
    setFeedback([]);
    setShowReport(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 80) return { text: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 60) return { text: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Loading personal debate...</p>
        </div>
      </div>
    );
  }

  if (!debateInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Debate Hub
          </Button>
          
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Personal Debate Not Available
              </h3>
              <p className="text-gray-600">
                The personal debate challenge for this topic is not available yet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Debate Hub
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-amber-100 text-amber-800">
              <Users className="w-3 h-3 mr-1" />
              Personal Debate Challenge
            </Badge>
            {debateState === 'in_progress' && (
              <Badge className={`${timeRemaining <= 30 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
            )}
          </div>
        </div>

        {/* Position Selection */}
        {debateState === 'not_started' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Choose Your Position
                </CardTitle>
                <p className="text-gray-600">
                  Select which side of the debate you want to defend. You'll face an AI opponent who will challenge your arguments.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {debateInfo.positions?.map((position) => (
                    <Card 
                      key={position.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        position.position_type === 'for' 
                          ? 'border-green-200 hover:bg-green-50' 
                          : 'border-red-200 hover:bg-red-50'
                      }`}
                      onClick={() => startDebate(position)}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge className={
                              position.position_type === 'for' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }>
                              {position.position_type === 'for' ? 'FOR' : 'AGAINST'}
                            </Badge>
                            <h3 className="font-semibold text-lg">
                              {position.position_title}
                            </h3>
                          </div>
                          
                          <p className="text-gray-700">
                            {position.position_description}
                          </p>
                          
                          <div className="pt-4 border-t">
                            <p className="text-sm text-gray-600">
                              <strong>You'll debate against:</strong> {
                                position.position_type === 'for' 
                                  ? debateInfo.positions?.find(p => p.position_type === 'against')?.ai_persona
                                  : debateInfo.positions?.find(p => p.position_type === 'for')?.ai_persona
                              }
                            </p>
                          </div>
                          
                          <Button className="w-full mt-4">
                            Choose This Position
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Debate */}
        {(debateState === 'in_progress' || debateState === 'completed') && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Debate Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        {debateInfo.topic_title}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">
                        Round {round} of {maxRounds}
                      </p>
                    </div>
                    {debateState === 'completed' && debateScore !== null && (
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(debateScore)}`}>
                          {debateScore}%
                        </div>
                        <Badge className={getScoreBadge(debateScore).color}>
                          {getScoreBadge(debateScore).text}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>

              {/* Messages */}
              <Card className="h-96">
                <CardContent className="p-0 h-full">
                  <div className="h-full overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : message.type === 'ai'
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {message.type !== 'user' && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-sm">
                                {message.type === 'ai' ? aiOpponent?.ai_persona || 'AI Opponent' : 'System'}
                              </span>
                              {message.type === 'ai' && (
                                <Badge className="bg-gray-200 text-gray-800 text-xs">
                                  Round {message.round}
                                </Badge>
                              )}
                            </div>
                          )}
                          <p className="leading-relaxed">{message.content}</p>
                          
                          {message.feedback && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-1 mb-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs font-medium">AI Feedback</span>
                              </div>
                              <p className="text-xs text-gray-600">{message.feedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-gray-600">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
              </Card>

              {/* Input Area */}
              {debateState === 'in_progress' && !isTyping && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Textarea
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Type your argument here..."
                        className="min-h-24"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            sendMessage();
                          }
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {currentMessage.length}/1000 characters • Press Ctrl+Enter to send
                        </div>
                        <Button 
                          onClick={sendMessage}
                          disabled={!currentMessage.trim() || isTyping}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Argument
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Performance Report */}
              {showReport && debateScore !== null && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Your Debate Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className={`text-2xl font-bold ${getScoreColor(debateScore)}`}>
                          {debateScore}%
                        </div>
                        <div className="text-sm text-gray-600">Overall Score</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {messages.filter(m => m.type === 'user').length}
                        </div>
                        <div className="text-sm text-gray-600">Arguments Made</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {round}
                        </div>
                        <div className="text-sm text-gray-600">Rounds Completed</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {feedback.length}
                        </div>
                        <div className="text-sm text-gray-600">Feedback Points</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Feedback Summary
                      </h4>
                      <div className="space-y-2">
                        {feedback.map((fb, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="w-3 h-3 text-blue-500" />
                              <span className="text-sm font-medium">Round {index + 1}</span>
                            </div>
                            <p className="text-sm text-gray-700">{fb}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button onClick={resetDebate} variant="outline" className="w-full">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Start New Debate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Current Position */}
              {selectedPosition && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Position</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge className={
                        selectedPosition.position_type === 'for' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }>
                        {selectedPosition.position_type.toUpperCase()}
                      </Badge>
                      <p className="text-sm font-medium">
                        {selectedPosition.position_title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedPosition.position_description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Opponent */}
              {aiOpponent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Opponent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <Users className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-medium">{aiOpponent.ai_persona}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Arguing {aiOpponent.position_type === 'for' ? 'FOR' : 'AGAINST'} the topic
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Round:</span>
                      <Badge variant="outline">{round}/{maxRounds}</Badge>
                    </div>
                    <Progress value={(round / maxRounds) * 100} className="h-2" />
                    {debateState === 'in_progress' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Time Left:</span>
                        <Badge className={
                          timeRemaining <= 30 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }>
                          {formatTime(timeRemaining)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• Use evidence to support your arguments</p>
                    <p>• Address counterarguments directly</p>
                    <p>• Stay focused on the topic</p>
                    <p>• Be respectful but assertive</p>
                    <p>• Time management is crucial</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDebateChat;