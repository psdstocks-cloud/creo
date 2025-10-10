import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Creo'
    const description = searchParams.get('description') || 'AI-Powered Stock Media & Image Generation'
    const site = searchParams.get('site') || 'Creo'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
            }}
          />
          
          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              textAlign: 'center',
              maxWidth: '1200px',
              width: '100%',
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#F59E0B',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                  boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'bold',
                  }}
                >
                  C
                </div>
              </div>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                }}
              >
                {site}
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '20px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                lineHeight: '1.2',
                textAlign: 'center',
                maxWidth: '1000px',
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: '32px',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '40px',
                textShadow: '0 1px 5px rgba(0, 0, 0, 0.3)',
                lineHeight: '1.4',
                textAlign: 'center',
                maxWidth: '900px',
              }}
            >
              {description}
            </div>

            {/* Features */}
            <div
              style={{
                display: 'flex',
                gap: '40px',
                marginTop: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px 24px',
                  borderRadius: '50px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                  }}
                >
                  🎨 AI Generation
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px 24px',
                  borderRadius: '50px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                  }}
                >
                  📸 Stock Media
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px 24px',
                  borderRadius: '50px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                  }}
                >
                  ⚡ Fast & Easy
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '20px',
              fontWeight: '500',
            }}
          >
            <div
              style={{
                marginRight: '10px',
              }}
            >
              Powered by AI
            </div>
            <div
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#10B981',
                borderRadius: '50%',
                marginLeft: '10px',
              }}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
