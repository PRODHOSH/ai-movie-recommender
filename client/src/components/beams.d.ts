declare module '@/components/beams' {
  import { FC } from 'react';

  interface BeamsProps {
    beamWidth?: number;
    beamHeight?: number;
    beamNumber?: number;
    lightColor?: string;
    speed?: number;
    noiseIntensity?: number;
    scale?: number;
    rotation?: number;
  }

  const Beams: FC<BeamsProps>;
  export default Beams;
}
