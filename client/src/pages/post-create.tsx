import { useState } from "react";
import { useParams, useLocation } from "wouter";
// import { PostForm } from "@/components/forms/post-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PostCreate() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const userId = params.id;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => setLocation(`/profile/${userId}`)}
          className="text-neon-cyan hover:text-electric-green mb-4"
          data-testid="button-back-to-profile"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
        
        <Card className="bg-void border-purple-deep">
          <CardHeader>
            <CardTitle className="text-2xl text-holo-gold">Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              <p className="text-gray-400">Post creation form will be implemented here.</p>
              <Button 
                onClick={() => setLocation(`/profile/${userId}`)}
                className="mt-4"
              >
                Return to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}