// components/debates/DebateHub.jsx
"use client";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Bot,
  Crown,
  MessageSquare,
  TreePine,
  Users,
  Loader2,
  Lock,
  Play,
  CheckCircle,
  FileText,
  Sparkles,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AIConversationChat from './AIConversationChat';
import DecisionTreeChat from './DecisionTreeChat';
import UserDebateChat from './UserDebateChat';

const DebateHub = ({ newsGroupId, debateTopicId }) => {
  const [userPlan, setUserPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [debateData, setDebateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDebateType, setActiveDebateType] = useState(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [userProgress, setUserProgress] = useState({});

  // Debate types configuration
  const debateTypes = [
    {
      id: 'ai_conversation',
      title: 'AI vs AI Debate',
      description: 'Watch two AI personas debate with opposing viewpoints in structured rounds',
      icon: Bot,
      color: 'border-blue-500 bg-blue-50',
      textColor: 'text-blue-700',
      hoverColor: 'hover:bg-blue-100',
      features: ['5 structured rounds', 'Professional AI personas', 'Balanced arguments', 'Educational insights'],
      estimatedTime: '10-15 minutes',
      difficulty: 'Beginner'
    },
    {
      id: 'decision_tree',
      title: 'Interactive Decision Tree',
      description: 'Navigate through debate scenarios by choosing your responses and exploring different argument paths',
      icon: TreePine,
      color: 'border-purple-500 bg-purple-50',
      textColor: 'text-purple-700',  
      hoverColor: 'hover:bg-purple-100',
      features: ['Multiple choice paths', 'Branching conversations', 'Explore all viewpoints', 'Interactive learning'],
      estimatedTime: '15-25 minutes',
      difficulty: 'Intermediate'
    },
    {
      id: 'user_debate',
      title: 'Personal Debate Challenge',
      description: 'Engage directly with AI opponents, defend your position, and receive personalized feedback',
      icon: Users,
      color: 'border-amber-500 bg-amber-50',
      textColor: 'text-amber-700',
      hoverColor: 'hover:bg-amber-100',
      features: ['Real-time responses', 'Personalized feedback', 'Skill assessment', 'Debate scoring', 'Elite exclusive'],
      estimatedTime: '20-30 minutes',
      difficulty: 'Advanced',
      isEliteOnly: true
    }
  ];

  useEffect(() => {
    fetchUserPlan();
    fetchDebateData();
    fetchUserProgress();
  }, [debateTopicId]);

  const fetchUserPlan = async () => {
    try {
     const token = localStorage.getItem('user_token');
      if (!token) {
        setPlanLoading(false);
        return;
      }

      const response = await fetch('/api/user/plan', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserPlan(data);
      }
    } catch (error) {
      console.error('Error fetching user plan:', error);
    } finally {
      setPlanLoading(false);
    }
  };

  const fetchDebateData = async () => {
    try {
     const token = localStorage.getItem('user_token');
      const response = await fetch(`/api/debates/topic/${debateTopicId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDebateData(data);
      } else if (response.status === 404) {
        toast.error('Debate topic not found');
      }
    } catch (error) {
      console.error('Error fetching debate data:', error);
      toast.error('Failed to load debate data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
     const token = localStorage.getItem('user_token');
      const response = await fetch(`/api/debates/progress/${debateTopicId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress || {});
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const isEliteMember = () => {
    return userPlan?.current_plan === 'elite';
  };

  const canAccessDebateType = (debateType) => {
    if (debateType.isEliteOnly && !isEliteMember()) {
      return false;
    }
    return true;
  };

  const getDebateAvailability = (typeId) => {
    if (!debateData) return { available: false, reason: 'Loading...' };

    switch (typeId) {
      case 'ai_conversation':
        return {
          available: debateData.hasAiConversations,
          reason: debateData.hasAiConversations ? '' : 'AI conversations not available for this topic'
        };
      case 'decision_tree':
        return {
          available: debateData.hasDecisionTree,
          reason: debateData.hasDecisionTree ? '' : 'Decision tree not available for this topic'
        };
      case 'user_debate':
        return {
          available: debateData.hasUserDebate,
          reason: debateData.hasUserDebate ? '' : 'User debate not available for this topic'
        };
      default:
        return { available: false, reason: 'Unknown debate type' };
    }
  };

  const getUserProgress = (typeId) => {
    return userProgress[typeId] || { completed: false, startedAt: null, completedAt: null, score: null };
  };

  const startDebate = (debateType) => {
    if (!canAccessDebateType(debateType)) {
      setShowUpgradeDialog(true);
      return;
    }

    const availability = getDebateAvailability(debateType.id);
    if (!availability.available) {
      toast.error(availability.reason);
      return;
    }

    setActiveDebateType(debateType.id);
  };

  const handleBackToHub = () => {
    setActiveDebateType(null);
    fetchUserProgress(); // Refresh progress when returning
  };

  const renderDebateCard = (debateType) => {
    const canAccess = canAccessDebateType(debateType);
    const availability = getDebateAvailability(debateType.id);
    const progress = getUserProgress(debateType.id);
    const IconComponent = debateType.icon;

    return (
      <Card 
        key={debateType.id}
        className={`${debateType.color} ${canAccess && availability.available ? debateType.hoverColor : ''} 
          transition-all duration-200 cursor-pointer relative ${
          !canAccess || !availability.available ? 'opacity-60' : ''
        }`}
        onClick={() => startDebate(debateType)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/50`}>
                <IconComponent className={`w-6 h-6 ${debateType.textColor}`} />
              </div>
              <div>
                <CardTitle className={`${debateType.textColor} text-xl`}>
                  {debateType.title}
                </CardTitle>
                {debateType.isEliteOnly && (
                  <Badge className="mt-1 bg-purple-100 text-purple-800">
                    <Crown className="w-3 h-3 mr-1" />
                    Elite Only
                  </Badge>
                )}
              </div>
            </div>

            {progress.completed && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className={`${debateType.textColor} text-sm`}>
            {debateType.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {debateType.estimatedTime}
              </div>
              <Badge variant="outline" className="text-xs">
                {debateType.difficulty}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className={`font-medium ${debateType.textColor} text-sm`}>Features:</h4>
            <ul className="text-xs space-y-1">
              {debateType.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {!availability.available && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {availability.reason}
              </AlertDescription>
            </Alert>
          )}

          {!canAccess && (
            <Alert className="mt-4 border-purple-200 bg-purple-50">
              <Lock className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Upgrade to Elite to access this exclusive debate format
              </AlertDescription>
            </Alert>
          )}

          {progress.completed && (
            <div className="pt-2 border-t border-white/30">
              <div className="flex items-center justify-between text-xs">
                <span>Last completed:</span>
                <span>{new Date(progress.completedAt).toLocaleDateString()}</span>
              </div>
              {progress.score && (
                <div className="flex items-center justify-between text-xs mt-1">
                  <span>Score:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {progress.score}%
                  </Badge>
                </div>
              )}
            </div>
          )}

          <Button 
            className={`w-full ${
              canAccess && availability.available 
                ? 'bg-white/20 hover:bg-white/30 text-inherit' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canAccess || !availability.available}
          >
            {progress.completed ? (
              <>
                <FileText className="w-4 h-4 mr-2" />
                View Results & Replay
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Debate
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (planLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading debate hub...</p>
        </div>
      </div>
    );
  }

  // Show active debate chat
  if (activeDebateType) {
    const props = {
      newsGroupId,
      debateTopicId,
      onBack: handleBackToHub,
      userPlan
    };

    switch (activeDebateType) {
      case 'ai_conversation':
        return <AIConversationChat {...props} />;
      case 'decision_tree':
        return <DecisionTreeChat {...props} />;
      case 'user_debate':
        return <UserDebateChat {...props} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <Toaster />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-orange-100">
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Debate Hub</h1>
          </div>
          
          {debateData && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {debateData.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {debateData.description}
              </p>
            </div>
          )}

          {userPlan && (
            <div className="mt-6">
              <Badge className={`${userPlan.plan_details.color} px-4 py-2`}>
                <Crown className="w-4 h-4 mr-2" />
                {userPlan.plan_details.display_name} Member
              </Badge>
            </div>
          )}
        </div>

        {!debateData ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Debate Not Available
              </h3>
              <p className="text-gray-600 mb-6">
                The requested debate topic could not be found or is not available yet.
              </p>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Debate Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {debateTypes.map(renderDebateCard)}
            </div>

            {/* Positions Overview */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Debate Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {debateData.positions?.map((position, index) => (
                    <div 
                      key={position.id}
                      className={`p-4 rounded-lg border-2 ${
                        position.position_type === 'for' 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={
                          position.position_type === 'for' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }>
                          {position.position_type === 'for' ? 'FOR' : 'AGAINST'}
                        </Badge>
                        <h4 className="font-semibold">{position.position_title}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {position.position_description}
                      </p>
                      <p className="text-xs text-gray-600">
                        <strong>AI Persona:</strong> {position.ai_persona}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Progress Summary */}
            {Object.keys(userProgress).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {debateTypes.map(type => {
                      const progress = getUserProgress(type.id);
                      return (
                        <div key={type.id} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <type.icon className="w-4 h-4" />
                            <span className="font-medium">{type.title}</span>
                          </div>
                          {progress.completed ? (
                            <div className="space-y-1">
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                              {progress.score && (
                                <p className="text-sm text-gray-600">
                                  Score: {progress.score}%
                                </p>
                              )}
                            </div>
                          ) : progress.startedAt ? (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              In Progress
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              Not Started
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Upgrade Dialog */}
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-600" />
              Elite Membership Required
            </AlertDialogTitle>
            <AlertDialogDescription>
              This debate format is exclusively available to Elite members. 
              Upgrade your membership to access advanced debate features including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Personal debate challenges with AI opponents</li>
                <li>Real-time response analysis and feedback</li>
                <li>Advanced scoring and skill assessment</li>
                <li>Personalized improvement recommendations</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction className="bg-purple-600 hover:bg-purple-700">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Elite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DebateHub;