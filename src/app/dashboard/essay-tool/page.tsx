
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, BrainCircuit, Loader2, Sparkles, ThumbsUp, ThumbsDown, Lightbulb, Download } from 'lucide-react';
import { analyzeEssay, AnalyzeEssayOutput } from '@/ai/flows/essay-feedback';
import { improveEssay } from '@/ai/flows/improve-essay';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function EssayToolPage() {
  const [essayPrompt, setEssayPrompt] = useState('');
  const [essayDraft, setEssayDraft] = useState('');
  const [storyContext, setStoryContext] = useState('');
  const [feedback, setFeedback] = useState<AnalyzeEssayOutput | null>(null);
  const [improvedEssay, setImprovedEssay] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!essayDraft) {
      toast({
        title: 'Essay Draft Required',
        description: 'Please enter your essay draft to get feedback.',
        variant: 'destructive',
      });
      return;
    }
    setIsAnalyzing(true);
    setFeedback(null);
    setImprovedEssay(null);
    try {
      const result = await analyzeEssay({
        essayPrompt,
        essayDraft,
        storyBuilderContext: storyContext,
      });
      setFeedback(result);
    } catch (error) {
      console.error('Error analyzing essay:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not get feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImprove = async () => {
    if (!essayDraft) {
       toast({
        title: 'Essay Draft Required',
        description:
          'Please provide an essay draft to generate an improved version.',
        variant: 'destructive',
      });
      return;
    }
     if (!storyContext) {
      toast({
        title: 'Story Context Required',
        description:
          'Please load your story context to generate a personalized, improved version.',
        variant: 'destructive',
      });
      return;
    }
    setIsImproving(true);
    setFeedback(null);
    setImprovedEssay(null);
    try {
      const result = await improveEssay({
        essayPrompt,
        essayDraft,
        storyBuilderNarrative: storyContext,
      });
      setImprovedEssay(result.improvedEssay);
    } catch (error) {
      console.error('Error improving essay:', error);
      toast({
        title: 'Improvement Failed',
        description: 'Could not improve the essay. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsImproving(false);
    }
  };
  
  const handleLoadNarrative = () => {
    const savedNarrative = localStorage.getItem('storyBuilderNarrative');
    if (savedNarrative) {
      setStoryContext(savedNarrative);
      toast({
        title: 'Narrative Loaded',
        description: 'Your story has been loaded from the Story Builder.',
      });
    } else {
      toast({
        title: 'No Narrative Found',
        description: 'Please save your story in the Story Builder first.',
        variant: 'destructive',
      });
    }
  };

  const renderFeedbackContent = (text: string) => {
    return text.split('* ').filter(item => item.trim() !== '').map((item, index) => (
      <li key={index} className="text-sm text-muted-foreground">{item.trim()}</li>
    ));
  };


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">AI Essay Tool</h1>
        <p className="text-muted-foreground">
          Get feedback on your essay and generate improved versions using AI.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Essay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="essay-prompt">Essay Prompt (Optional)</Label>
                <Input
                  id="essay-prompt"
                  placeholder="Paste the essay prompt here..."
                  value={essayPrompt}
                  onChange={e => setEssayPrompt(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="essay-draft">Essay Draft</Label>
                <Textarea
                  id="essay-draft"
                  placeholder="Paste your essay draft here..."
                  rows={12}
                  value={essayDraft}
                  onChange={e => setEssayDraft(e.target.value)}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="story-context">Story Builder Narrative</Label>
                  <Button variant="outline" size="sm" onClick={handleLoadNarrative}>
                    <Download className="mr-2 h-4 w-4" />
                    Load from Story Builder
                  </Button>
                </div>
                <Textarea
                  id="story-context"
                  placeholder="Load your narrative from the Story Builder or paste it here..."
                  rows={8}
                  value={storyContext}
                  onChange={e => setStoryContext(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-4">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || isImproving}
              className="w-full"
            >
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
              )}
              Get Feedback
            </Button>
            <Button
              onClick={handleImprove}
              disabled={isAnalyzing || isImproving}
              className="w-full"
            >
              {isImproving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Improve Essay
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {(isAnalyzing || isImproving) && (
            <Card className="flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center text-muted-foreground p-8">
                <Loader2 className="mx-auto h-12 w-12 animate-spin" />
                <p className="mt-4">
                  {isAnalyzing ? 'Analyzing your essay...' : 'Improving your essay...'}
                </p>
              </div>
            </Card>
          )}
          
          {feedback && !isAnalyzing && (
            <Card>
              <CardHeader>
                <CardTitle>Essay Feedback</CardTitle>
                <CardDescription>
                  Here is the AI's analysis of your essay.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg flex items-center mb-2 text-green-500"><ThumbsUp className="w-5 h-5 mr-2" />Strengths</h3>
                  <ul className="list-disc pl-5 space-y-1">{renderFeedbackContent(feedback.strengths)}</ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center mb-2 text-red-500"><ThumbsDown className="w-5 h-5 mr-2" />Weaknesses</h3>
                  <ul className="list-disc pl-5 space-y-1">{renderFeedbackContent(feedback.weaknesses)}</ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center mb-2 text-blue-500"><Lightbulb className="w-5 h-5 mr-2" />Suggestions</h3>
                  <ul className="list-disc pl-5 space-y-1">{renderFeedbackContent(feedback.suggestions)}</ul>
                </div>
              </CardContent>
            </Card>
          )}

          {improvedEssay && !isImproving &&(
            <Card>
              <CardHeader>
                <CardTitle>Improved Essay</CardTitle>
                <CardDescription>
                  Here's an AI-generated version of your essay.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {improvedEssay}
                </p>
              </CardContent>
            </Card>
          )}

          {!isAnalyzing && !isImproving && !feedback && !improvedEssay && (
            <Card className="flex items-center justify-center h-full min-h-[300px] lg:min-h-full">
              <div className="text-center text-muted-foreground p-8">
                <Sparkles className="mx-auto h-12 w-12" />
                <p className="mt-4">
                  Your AI feedback and improvements will appear here.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
