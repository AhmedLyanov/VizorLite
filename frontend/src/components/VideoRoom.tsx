import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

interface PeerType {
  id: string;
  peer: SimplePeer.Instance;
}

const VideoRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<any>(null);
  const [peers, setPeers] = useState<PeerType[]>([]);
  const [myVideo, setMyVideo] = useState<MediaStream | null>(null);
  const [myScreen, setMyScreen] = useState<MediaStream | null>(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [participants, setParticipants] = useState<string[]>([]);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [screenShareError, setScreenShareError] = useState<string | null>(null);

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const peerConnections = useRef<Map<string, SimplePeer.Instance>>(new Map());

  useEffect(() => {
    const init = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('Available devices:', devices);
      } catch (err) {
        console.error('Media check failed:', err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('join-room', roomId);
    });

    newSocket.on('connect_error', (err: Error) => {
      console.error('Socket connection error:', err);
    });

    setSocket(newSocket);

    return () => {
      console.log('Cleaning up...');
      newSocket.disconnect();

      if (myVideo) {
        myVideo.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }

      if (myScreen) {
        myScreen.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }

      peerConnections.current.forEach((peer, id) => {
        try {
          peer.destroy();
        } catch (err) {
          console.error('Error destroying peer:', err);
        }
      });
      peerConnections.current.clear();
    };
  }, [roomId]);

  useEffect(() => {
    const setupLocalStream = async () => {
      setIsLoading(true);
      setMediaError(null);

      try {
        let stream: MediaStream;

        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { min: 320, ideal: 640, max: 1280 },
              height: { min: 240, ideal: 480, max: 720 },
              facingMode: 'user'
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
        } catch (err) {
          console.warn('Failed with ideal settings, trying audio only:', err);

          stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
          });
        }

        setMyVideo(stream);

        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
          myVideoRef.current.onloadedmetadata = () => {
            myVideoRef.current?.play().catch(console.error);
          };
        }

        console.log('Local stream setup complete');
      } catch (err) {
        console.error('Failed to get any media access:', err);
        setMediaError('Unable to access camera or microphone. Please check permissions and try again.');

        const emptyStream = new MediaStream();
        setMyVideo(emptyStream);
      } finally {
        setIsLoading(false);
      }
    };

    if (!myVideo) {
      setupLocalStream();
    }
  }, []);

  useEffect(() => {
    if (!socket || !myVideo) return;

    const handleUserConnected = (data: any) => {
      console.log('New user connected:', data.userId);
      setParticipants(prev => [...prev.filter(id => id !== data.userId), data.userId]);

      createPeer(data.userId, true);
    };

    const handleOffer = async (payload: any) => {
      console.log('Received offer from:', payload.sender);
      createPeer(payload.sender, false, payload.sdp);
    };

    const handleAnswer = (payload: any) => {
      console.log('Received answer from:', payload.sender);
      const peer = peerConnections.current.get(payload.sender);
      if (peer && payload.sdp) {
        peer.signal(payload.sdp);
      }
    };

    const handleIceCandidate = (payload: any) => {
      const peer = peerConnections.current.get(payload.sender);
      if (peer && payload.candidate) {
        peer.signal(payload.candidate);
      }
    };

    const handleUserDisconnected = (userId: string) => {
      console.log('User disconnected:', userId);
      setParticipants(prev => prev.filter(id => id !== userId));

      const peer = peerConnections.current.get(userId);
      if (peer) {
        peer.destroy();
        peerConnections.current.delete(userId);
      }
    };

    socket.on('user-connected', handleUserConnected);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('user-disconnected', handleUserDisconnected);

    return () => {
      socket.off('user-connected', handleUserConnected);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('user-disconnected', handleUserDisconnected);
    };
  }, [socket, myVideo]);

  const createPeer = useCallback((userId: string, isInitiator: boolean, offer?: any) => {
    if (!socket || !myVideo) return;

    if (peerConnections.current.has(userId)) {
      console.log('Peer already exists for:', userId);
      return;
    }

    const peer = new SimplePeer({
      initiator: isInitiator,
      trickle: true,
      stream: myVideo,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    peer.on('signal', (data: any) => {
      if (data.type === 'offer') {
        socket.emit('offer', {
          target: userId,
          sdp: data
        });
      } else if (data.type === 'answer') {
        socket.emit('answer', {
          target: userId,
          sdp: data
        });
      } else if (data.candidate) {
        socket.emit('ice-candidate', {
          target: userId,
          candidate: data
        });
      }
    });

    peer.on('stream', (remoteStream: MediaStream) => {
      console.log('Got remote stream from:', userId);
      setTimeout(() => {
        const videoEl = remoteVideoRefs.current[userId];
        if (videoEl && videoEl.srcObject !== remoteStream) {
          videoEl.srcObject = remoteStream;
          videoEl.onloadedmetadata = () => {
            videoEl.play().catch(console.error);
          };
        }
      }, 0);
    });

    peer.on('close', () => {
      console.log('Peer connection closed:', userId);
      peer.destroy();
      peerConnections.current.delete(userId);
    });

    peer.on('error', (err: Error) => {
      console.error('Peer error for', userId, ':', err);
      peer.destroy();
      peerConnections.current.delete(userId);
    });

    peerConnections.current.set(userId, peer);

    if (offer) {
      peer.signal(offer);
    }

    return peer;
  }, [socket, myVideo]);

  const toggleVideo = () => {
    if (myVideo) {
      const videoTrack = myVideo.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (myVideo) {
      const audioTrack = myVideo.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    if (!socket) return;

    setScreenShareError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Screen sharing is not supported in your browser');
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      const videoTrack = screenStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          console.log('Screen sharing ended by browser');
          stopScreenShare();
        };
      }

      setMyScreen(screenStream);
      setIsSharingScreen(true);

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = screenStream;
        screenVideoRef.current.onloadedmetadata = () => {
          screenVideoRef.current?.play().catch(console.error);
        };
      }

      socket.emit('screen-share-started', roomId);

      peerConnections.current.forEach((peer) => {
        if (peer && (peer as any)._pc) {
          try {
            const senders = (peer as any)._pc.getSenders();
            const videoSender = senders.find((s: any) => s.track?.kind === 'video');
            const screenVideoTrack = screenStream.getVideoTracks()[0];

            if (videoSender && screenVideoTrack) {
              videoSender.replaceTrack(screenVideoTrack);
            }
          } catch (err) {
            console.error('Error replacing screen track in peer:', err);
          }
        }
      });

      console.log('Screen sharing started successfully');

    } catch (err) {
      console.error('Error sharing screen:', err);

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setScreenShareError('Screen sharing permission was denied. Please allow screen sharing to continue.');
          alert('Screen sharing permission was denied. Please allow screen sharing to continue.');
        } else if (err.name === 'NotFoundError') {
          setScreenShareError('No screen, window, or tab available to share.');
          alert('No screen, window, or tab available to share.');
        } else if (err.name === 'AbortError') {
          setScreenShareError('Screen sharing was cancelled.');
        } else {
          setScreenShareError(`Screen sharing error: ${err.message}`);
          alert(`Screen sharing error: ${err.message}`);
        }
      } else {
        setScreenShareError('An unknown error occurred during screen sharing.');
        alert('An unknown error occurred during screen sharing.');
      }

      setIsSharingScreen(false);
    }
  };

  const stopScreenShare = () => {
    if (!myScreen) return;

    myScreen.getTracks().forEach(track => {
      track.stop();
      track.enabled = false;
    });

    setMyScreen(null);
    setIsSharingScreen(false);
    setScreenShareError(null);

    if (socket) {
      socket.emit('screen-share-stopped', roomId);
    }

    if (myVideo) {
      peerConnections.current.forEach((peer) => {
        if (peer && (peer as any)._pc) {
          try {
            const senders = (peer as any)._pc.getSenders();
            const videoSender = senders.find((s: any) => s.track?.kind === 'video');
            const cameraVideoTrack = myVideo.getVideoTracks()[0];

            if (videoSender && cameraVideoTrack) {
              videoSender.replaceTrack(cameraVideoTrack);
            }
          } catch (err) {
            console.error('Error restoring camera track:', err);
          }
        }
      });
    }

    if (myVideoRef.current && myVideo) {
      myVideoRef.current.srcObject = myVideo;
    }

    console.log('Screen sharing stopped');
  };

  const leaveRoom = () => {
    navigate('/dashboard');
  };

  const isScreenShareSupported = () => {
    return navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Setting up your video room...</p>
      </div>
    );
  }

  return (
    <div className="video-room">
      <header className="room-header">
        <h1>Room: {roomId}</h1>
        <div className="room-controls">
          <button 
            onClick={toggleVideo} 
            className={`control-btn ${isVideoOn ? 'active' : 'inactive'}`}
            disabled={!myVideo || !myVideo.getVideoTracks().length}
          >
            {isVideoOn ? '📹 Video On' : '📵 Video Off'}
          </button>
          <button 
            onClick={toggleAudio} 
            className={`control-btn ${isAudioOn ? 'active' : 'inactive'}`}
            disabled={!myVideo || !myVideo.getAudioTracks().length}
          >
            {isAudioOn ? '🎤 Audio On' : '🔇 Audio Off'}
          </button>
          <button 
            onClick={isSharingScreen ? stopScreenShare : startScreenShare}
            className={`control-btn ${isSharingScreen ? 'sharing' : ''}`}
            disabled={!isScreenShareSupported()}
            title={!isScreenShareSupported() ? "Screen sharing not supported in your browser" : ""}
          >
            {isSharingScreen ? '🖥️ Stop Sharing' : '🖥️ Share Screen'}
          </button>
          <button onClick={leaveRoom} className="control-btn leave">
            🚪 Leave Room
          </button>
        </div>
      </header>

      {mediaError && (
        <div className="media-error">
          <p>⚠️ {mediaError}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {screenShareError && (
        <div className="screen-error">
          <p>⚠️ {screenShareError}</p>
          <button onClick={() => setScreenShareError(null)}>Dismiss</button>
        </div>
      )}

      <main className="room-content">
        <div className="local-stream">
          <div className="local-video-container">
            <h3>You {socket?.id?.substring(0, 6)}</h3>
            <video
              ref={myVideoRef}
              autoPlay
              playsInline
              muted
              className="local-video"
            />
            <div className="status-indicators">
              {!isVideoOn && <span className="status">Video Off</span>}
              {!isAudioOn && <span className="status">Muted</span>}
            </div>
          </div>
          
          {isSharingScreen && myScreen && (
            <div className="screen-share-container">
              <h3>Your Screen</h3>
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                muted
                className="screen-video"
              />
            </div>
          )}
        </div>

        <div className="remote-streams">
          <h3>Participants ({participants.length})</h3>
          <div className="remote-videos">
            {participants.length > 0 ? (
              participants.map((userId) => (
                <div key={userId} className="remote-video-container">
                  <h4>User {userId.substring(0, 6)}</h4>
                  <video
                    ref={(el) => {
                      if (el) {
                        remoteVideoRefs.current[userId] = el;
                      }
                    }}
                    autoPlay
                    playsInline
                    className="remote-video"
                  />
                </div>
              ))
            ) : (
              <div className="empty-participants">
                <p>Waiting for other participants...</p>
                <p className="hint">Share this room link with others</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoRoom;