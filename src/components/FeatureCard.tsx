
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  buttonText: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  linkTo,
  buttonText,
}) => {
  return (
    <Card className="h-full feature-card">
      <CardHeader className="pb-4">
        <div className="mb-4 text-purple">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="h-16">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button asChild variant="outline" className="w-full border-purple text-purple hover:bg-purple-light">
          <NavLink to={linkTo}>{buttonText}</NavLink>
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
