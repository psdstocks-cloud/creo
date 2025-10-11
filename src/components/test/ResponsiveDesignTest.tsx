'use client';

import React, { useState } from 'react';
import { ResponsiveContainer } from '@/components/layout/ResponsiveContainer';
import { ResponsiveGrid } from '@/components/layout/ResponsiveContainer';
import { ResponsiveFlex } from '@/components/layout/ResponsiveContainer';
import { ResponsiveNavigation } from '@/components/layout/ResponsiveNavigation';
import { ResponsiveForm, ResponsiveInput, ResponsiveButton } from '@/components/forms/ResponsiveForm';
import { ResponsiveCard, ResponsiveCardHeader, ResponsiveCardContent } from '@/components/ui/ResponsiveCard';
import { ResponsiveHeading, ResponsiveText } from '@/components/ui/ResponsiveTypography';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { ResponsiveModal } from '@/components/ui/ResponsiveModal';
import { useResponsive } from '@/hooks/useResponsive';

export const ResponsiveDesignTest: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isMobile, isTablet, isDesktop, width, height } = useResponsive();

  const menuItems = [
    { key: 'home', label: 'Home', href: '#home' },
    { key: 'about', label: 'About', href: '#about' },
    { key: 'contact', label: 'Contact', href: '#contact' },
  ];

  const testImages = [
    {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      alt: 'Mountain landscape',
    },
    {
      src: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
      alt: 'Ocean view',
    },
    {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      alt: 'Forest path',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Test */}
      <ResponsiveNavigation
        items={menuItems}
        logo={
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold">Creo</span>
          </div>
        }
        actions={
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-orange-600">Login</button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
              Sign Up
            </button>
          </div>
        }
        variant="glass"
        sticky={true}
      />

      {/* Main Content */}
      <ResponsiveContainer maxWidth="wide" padding="lg" className="pt-20">
        {/* Device Info */}
        <ResponsiveCard className="mb-8">
          <ResponsiveCardContent>
            <ResponsiveHeading level={2} className="mb-4">
              Responsive Design Test
            </ResponsiveHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <ResponsiveText variant="small" color="muted">Device Type</ResponsiveText>
                <ResponsiveText variant="body" weight="semibold">
                  {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
                </ResponsiveText>
              </div>
              <div>
                <ResponsiveText variant="small" color="muted">Screen Width</ResponsiveText>
                <ResponsiveText variant="body" weight="semibold">{width}px</ResponsiveText>
              </div>
              <div>
                <ResponsiveText variant="small" color="muted">Screen Height</ResponsiveText>
                <ResponsiveText variant="body" weight="semibold">{height}px</ResponsiveText>
              </div>
              <div>
                <ResponsiveText variant="small" color="muted">Breakpoint</ResponsiveText>
                <ResponsiveText variant="body" weight="semibold">
                  {width < 768 ? 'Mobile' : width < 1024 ? 'Tablet' : 'Desktop'}
                </ResponsiveText>
              </div>
            </div>
          </ResponsiveCardContent>
        </ResponsiveCard>

        {/* Typography Test */}
        <ResponsiveCard className="mb-8">
          <ResponsiveCardHeader title="Typography Test" />
          <ResponsiveCardContent>
            <div className="space-y-4">
              <ResponsiveHeading level={1}>Heading 1 - Main Title</ResponsiveHeading>
              <ResponsiveHeading level={2}>Heading 2 - Section Title</ResponsiveHeading>
              <ResponsiveHeading level={3}>Heading 3 - Subsection</ResponsiveHeading>
              <ResponsiveText variant="lead">
                This is a lead paragraph that should be larger and more prominent than regular body text.
              </ResponsiveText>
              <ResponsiveText variant="body">
                This is regular body text that should be readable on all devices. It includes proper line height and spacing for optimal readability.
              </ResponsiveText>
              <ResponsiveText variant="small" color="muted">
                This is small text used for captions, metadata, or secondary information.
              </ResponsiveText>
            </div>
          </ResponsiveCardContent>
        </ResponsiveCard>

        {/* Grid Test */}
        <ResponsiveCard className="mb-8">
          <ResponsiveCardHeader title="Grid System Test" />
          <ResponsiveCardContent>
            <ResponsiveGrid 
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              gap="md"
            >
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <ResponsiveCard key={item} variant="outlined" padding="md">
                  <ResponsiveCardContent>
                    <ResponsiveHeading level={4}>Card {item}</ResponsiveHeading>
                    <ResponsiveText variant="body" color="muted">
                      This is a test card to demonstrate responsive grid layout.
                    </ResponsiveText>
                  </ResponsiveCardContent>
                </ResponsiveCard>
              ))}
            </ResponsiveGrid>
          </ResponsiveCardContent>
        </ResponsiveCard>

        {/* Form Test */}
        <ResponsiveCard className="mb-8">
          <ResponsiveCardHeader title="Form Test" />
          <ResponsiveCardContent>
            <ResponsiveForm layout="vertical" spacing="md">
              <ResponsiveGrid 
                columns={{ mobile: 1, tablet: 2, desktop: 2 }}
                gap="md"
              >
                <ResponsiveInput
                  label="First Name"
                  placeholder="Enter your first name"
                  required
                />
                <ResponsiveInput
                  label="Last Name"
                  placeholder="Enter your last name"
                  required
                />
              </ResponsiveGrid>
              <ResponsiveInput
                label="Email"
                type="email"
                placeholder="Enter your email"
                required
              />
              <ResponsiveInput
                label="Message"
                placeholder="Enter your message"
                required
              />
              <ResponsiveFlex justify="end" gap="md">
                <ResponsiveButton variant="outline" onClick={() => setIsModalOpen(true)}>
                  Cancel
                </ResponsiveButton>
                <ResponsiveButton variant="primary" type="submit">
                  Submit
                </ResponsiveButton>
              </ResponsiveFlex>
            </ResponsiveForm>
          </ResponsiveCardContent>
        </ResponsiveCard>

        {/* Image Test */}
        <ResponsiveCard className="mb-8">
          <ResponsiveCardHeader title="Image Test" />
          <ResponsiveCardContent>
            <ResponsiveGrid 
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              gap="md"
            >
              {testImages.map((image, index) => (
                <div key={index} className="relative">
                  <ResponsiveImage
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
                    <ResponsiveText variant="small" color="white">
                      {image.alt}
                    </ResponsiveText>
                  </div>
                </div>
              ))}
            </ResponsiveGrid>
          </ResponsiveCardContent>
        </ResponsiveCard>

        {/* Button Test */}
        <ResponsiveCard className="mb-8">
          <ResponsiveCardHeader title="Button Test" />
          <ResponsiveCardContent>
            <div className="space-y-4">
              <ResponsiveFlex gap="md" wrap>
                <ResponsiveButton variant="primary" size="sm">Small Primary</ResponsiveButton>
                <ResponsiveButton variant="primary" size="md">Medium Primary</ResponsiveButton>
                <ResponsiveButton variant="primary" size="lg">Large Primary</ResponsiveButton>
              </ResponsiveFlex>
              <ResponsiveFlex gap="md" wrap>
                <ResponsiveButton variant="secondary">Secondary</ResponsiveButton>
                <ResponsiveButton variant="outline">Outline</ResponsiveButton>
                <ResponsiveButton variant="ghost">Ghost</ResponsiveButton>
                <ResponsiveButton variant="danger">Danger</ResponsiveButton>
              </ResponsiveFlex>
              <ResponsiveFlex gap="md" wrap>
                <ResponsiveButton variant="primary" fullWidth>
                  Full Width Button
                </ResponsiveButton>
              </ResponsiveFlex>
            </div>
          </ResponsiveCardContent>
        </ResponsiveCard>

        {/* Modal Test */}
        <ResponsiveCard className="mb-8">
          <ResponsiveCardHeader title="Modal Test" />
          <ResponsiveCardContent>
            <ResponsiveFlex gap="md">
              <ResponsiveButton onClick={() => setIsModalOpen(true)}>
                Open Modal
              </ResponsiveButton>
            </ResponsiveFlex>
          </ResponsiveCardContent>
        </ResponsiveCard>
      </ResponsiveContainer>

      {/* Modal */}
      <ResponsiveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Test Modal"
        description="This is a test modal to demonstrate responsive modal behavior."
        size="md"
      >
        <div className="space-y-4">
          <ResponsiveText variant="body">
            This modal should adapt to different screen sizes:
          </ResponsiveText>
          <ul className="list-disc list-inside space-y-2">
            <li>Mobile: Full width, full height</li>
            <li>Tablet: 90% width, auto height</li>
            <li>Desktop: Fixed width (600px), auto height</li>
          </ul>
          <ResponsiveFlex justify="end" gap="md">
            <ResponsiveButton variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </ResponsiveButton>
            <ResponsiveButton variant="primary" onClick={() => setIsModalOpen(false)}>
              Confirm
            </ResponsiveButton>
          </ResponsiveFlex>
        </div>
      </ResponsiveModal>
    </div>
  );
};

export default ResponsiveDesignTest;
