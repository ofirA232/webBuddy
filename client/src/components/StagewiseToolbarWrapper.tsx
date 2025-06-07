import { StagewiseToolbar } from '@stagewise/toolbar-react';

const stagewiseConfig = {
  plugins: []
};

export function StagewiseToolbarWrapper() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <StagewiseToolbar config={stagewiseConfig} />;
} 