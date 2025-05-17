import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GeneratedContentProps {
  content: any;
  type: 'portfolio' | 'ats' | 'cover-letter';
}

const GeneratedContent: React.FC<GeneratedContentProps> = ({ content, type }) => {
  const renderPortfolio = () => (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
        <p className="text-gray-700">{content.professionalSummary}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Key Achievements</h2>
        <ul className="list-disc list-inside space-y-2">
          {content.keyAchievements.map((achievement: string, index: number) => (
            <li key={index} className="text-gray-700">{achievement}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Skills Showcase</h2>
        <div className="flex flex-wrap gap-2">
          {content.skills.map((skill: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Project Highlights</h2>
        <div className="space-y-4">
          {content.projects.map((project: any, index: number) => (
            <Card key={index} className="p-4">
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-700 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string, techIndex: number) => (
                  <Badge key={techIndex} variant="outline" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Career Timeline</h2>
        <div className="space-y-4">
          {content.careerTimeline.map((event: any, index: number) => (
            <div key={index} className="flex gap-4">
              <div className="w-24 text-gray-500">{event.date}</div>
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-gray-700">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderATSResume = () => (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
        <p className="text-gray-700">{content.summary}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Key Skills</h2>
        <div className="flex flex-wrap gap-2">
          {content.skills.map((skill: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Professional Experience</h2>
        <div className="space-y-4">
          {content.experience.map((exp: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <span className="text-gray-500">{exp.duration}</span>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {exp.achievements.map((achievement: string, achIndex: number) => (
                  <li key={achIndex} className="text-gray-700">{achievement}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Education</h2>
        <div className="space-y-4">
          {content.education.map((edu: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                </div>
                <span className="text-gray-500">{edu.year}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  const renderCoverLetter = () => (
    <div className="space-y-6">
      <section className="text-right">
        <p>{content.date}</p>
        <p>{content.recipientName}</p>
        <p>{content.recipientTitle}</p>
        <p>{content.companyName}</p>
        <p>{content.companyAddress}</p>
      </section>

      <section>
        <p className="text-gray-700">{content.greeting}</p>
      </section>

      <section className="space-y-4">
        {content.body.map((paragraph: string, index: number) => (
          <p key={index} className="text-gray-700">{paragraph}</p>
        ))}
      </section>

      <section>
        <p className="text-gray-700">{content.closing}</p>
        <p className="mt-4">{content.signature}</p>
      </section>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {type === 'portfolio' && renderPortfolio()}
      {type === 'ats' && renderATSResume()}
      {type === 'cover-letter' && renderCoverLetter()}
    </div>
  );
};

export default GeneratedContent; 