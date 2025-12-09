export const checkMediaDevices = async () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Media devices API not supported');
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log('Available devices:', devices);

    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const audioDevices = devices.filter(device => device.kind === 'audioinput');

    console.log('Video devices:', videoDevices);
    console.log('Audio devices:', audioDevices);

    return { videoDevices, audioDevices };
  } catch (err) {
    console.error('Error checking media devices:', err);
    return { videoDevices: [], audioDevices: [] };
  }
};

export const getMediaStream = async (options?: {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
}) => {
  try {
    const constraints: MediaStreamConstraints = {
      video: options?.video ?? {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      },
      audio: options?.audio ?? true
    };

    console.log('Requesting media with constraints:', constraints);
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log('Got stream with tracks:', stream.getTracks());
    
    return stream;
  } catch (err) {
    console.error('Error getting media stream:', err);
    throw err;
  }
};