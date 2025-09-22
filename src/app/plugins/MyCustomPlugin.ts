// src/app/core/plugins/MyCustomPlugin.ts
import { registerPlugin } from '@capacitor/core';

export interface MyCustomPlugin {
  setWallpaper(options: { url: string; type?: 'home' | 'lock' }): Promise<{ success: boolean; message?: string }>;
}

const MyCustom = registerPlugin<MyCustomPlugin>('MyCustomPlugin');

export default MyCustom;
