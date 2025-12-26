  // APPLY BROWSER-SIDE AI FILTERS
  const applyAIEffect = async (videoElement: HTMLVideoElement, outputCanvas: HTMLCanvasElement): Promise<void> => {
    if (!aiMode || !videoElement || !outputCanvas) return;