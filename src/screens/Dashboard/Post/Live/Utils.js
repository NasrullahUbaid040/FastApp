import { mediaDevices } from 'react-native-webrtc';

export default class Utils {
  static async getVideoStream(micStatus) {
    let isFront = true;
    const sourceInfos = await mediaDevices.enumerateDevices();
    // console.log(sourceInfos);
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if (
        sourceInfo.kind == 'videoinput' &&
        sourceInfo.facing == (isFront ? 'front' : 'environment')
      ) {
        videoSourceId = sourceInfo.deviceId;
      }
    }

    const stream = await mediaDevices.getUserMedia({
      audio: micStatus ? {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        googEchoCancellation: true,
        googAutoGainControl: true,
        googNoiseSuppression: true,
        googHighpassFilter: true,
        googTypingNoiseDetection: true,
        googNoiseReduction: true,
        volume: 1.0,
      } : false,
      video: {
        // width: 640,
        // height: 480,
        width: 100,
        height: 100,
        frameRate: 30,
        facingMode: isFront ? 'user' : 'environment',
        deviceId: videoSourceId,
      },
    });

    if (typeof stream != 'boolean') return stream;
    return null;
  }
  static async getAudioStream() {
    let isFront = true;
    const sourceInfos = await mediaDevices.enumerateDevices();
    // console.log(sourceInfos);
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if (
        sourceInfo.kind == 'videoinput' &&
        sourceInfo.facing == (isFront ? 'front' : 'environment')
      ) {
        videoSourceId = sourceInfo.deviceId;
      }
    }

    const stream = await mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        googEchoCancellation: true,
        googAutoGainControl: true,
        googNoiseSuppression: true,
        googHighpassFilter: true,
        googTypingNoiseDetection: true,
        googNoiseReduction: true,
        volume: 1.0,
      },
      video: false,
    });

    if (typeof stream != 'boolean') return stream;
    return null;
  }
}
