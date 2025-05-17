
import React from 'react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, avatarUrl }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex flex-col space-y-4">
        <div className="flex-1">
          <p className="text-gray-700 italic mb-4">"{quote}"</p>
          <div className="flex items-center">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={author} 
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-light text-purple flex items-center justify-center mr-3">
                {author.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-medium">{author}</p>
              <p className="text-sm text-gray-500">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
